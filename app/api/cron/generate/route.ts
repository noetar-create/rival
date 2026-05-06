import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { createVideo, awardVerifiedBadgesToTopThree } from '@/lib/db';

const execFileAsync = promisify(execFile);

const NICHES = [
  { name: 'psychology', prompt: 'Write a compelling 60-second video script about an interesting psychology fact or human behavior insight. Make it shocking or surprising. Start with a hook. No intro, just dive in. Max 120 words. Also pick a 2-3 word keyword for cinematic stock footage that fits the mood (e.g. "crowded street", "dark corridor", "person thinking").' },
  { name: 'true_crime', prompt: 'Write a compelling 60-second video script about a fascinating true crime case or mystery. Keep it factual but gripping. Start with a hook. Max 120 words. Also pick a 2-3 word keyword for dark cinematic stock footage (e.g. "dark alley", "police lights", "abandoned building").' },
  { name: 'relationships', prompt: 'Write a compelling 60-second video script with relationship advice or a surprising relationship fact. Make it relatable. Start with a hook. Max 120 words. Also pick a 2-3 word keyword for cinematic stock footage (e.g. "couple sunset", "city night", "walking together").' },
  { name: 'finance', prompt: 'Write a compelling 60-second video script about a money tip, financial fact, or wealth-building insight most people don\'t know. Start with a hook. Max 120 words. Also pick a 2-3 word keyword for stock footage (e.g. "city skyline", "luxury car", "busy office").' },
  { name: 'motivation', prompt: 'Write a compelling 60-second motivational video script that feels raw and real, not cheesy. A mindset shift or brutal truth. Start with a hook. Max 120 words. Also pick a 2-3 word keyword for powerful cinematic footage (e.g. "mountain sunrise", "running athlete", "ocean waves").' },
  { name: 'health', prompt: 'Write a compelling 60-second video script about a surprising health or wellness fact most people get wrong. Start with a hook. Max 120 words. Also pick a 2-3 word keyword for stock footage (e.g. "nature forest", "healthy food", "yoga meditation").' },
  { name: 'history', prompt: 'Write a compelling 60-second video script about a wild or little-known historical fact or event. Start with a hook. Max 120 words. Also pick a 2-3 word keyword for cinematic stock footage (e.g. "ancient ruins", "vintage city", "old architecture").' },
];

const VOICES = [
  'JBFqnCBsd6RMkjVDRZzb', // George
  'EXAVITQu4vr4xnSDxMaL', // Sarah
  'TX3LPaxmHKxFdv7VOQHJ', // Liam
];

async function ensureSystemUser() {
  const { getUserByEmail, createUser } = await import('@/lib/db');
  const bcrypt = await import('bcryptjs');
  let user = getUserByEmail('rival@system.ai');
  if (!user) {
    const hash = await bcrypt.hash('system_rival_2026', 10);
    createUser('RivalAI', 'rival@system.ai', hash);
    user = getUserByEmail('rival@system.ai');
  }
  return user!;
}

async function generateScript(niche: typeof NICHES[0]): Promise<{ title: string; script: string; keyword: string }> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 400,
    messages: [{
      role: 'user',
      content: `${niche.prompt}\n\nReturn JSON only: {"title": "catchy title max 8 words", "script": "the voiceover script", "keyword": "2-3 word pexels search term"}`
    }]
  });
  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON in response');
  return JSON.parse(match[0]);
}

async function generateAudio(script: string, voiceId: string): Promise<Buffer> {
  const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });
  const audio = await client.textToSpeech.convert(voiceId, {
    text: script,
    modelId: 'eleven_multilingual_v2',
    outputFormat: 'mp3_44100_128',
  });
  const chunks: Uint8Array[] = [];
  const reader = (audio as unknown as ReadableStream<Uint8Array>).getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  return Buffer.concat(chunks);
}

interface PexelsVideoFile {
  quality: string;
  width: number;
  height: number;
  link: string;
}

interface PexelsVideo {
  video_files: PexelsVideoFile[];
}

interface PexelsResponse {
  videos: PexelsVideo[];
}

async function fetchStockVideo(keyword: string, destPath: string): Promise<void> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) throw new Error('PEXELS_API_KEY not set');

  let videoUrl: string | null = null;

  for (const orientation of ['portrait', 'landscape']) {
    const params = new URLSearchParams({ query: keyword, per_page: '10', orientation });
    const res = await fetch(`https://api.pexels.com/videos/search?${params}`, {
      headers: { Authorization: apiKey },
    });
    if (!res.ok) continue;

    const data = await res.json() as PexelsResponse;
    if (!data.videos?.length) continue;

    const video = data.videos[Math.floor(Math.random() * Math.min(5, data.videos.length))];
    const files = video.video_files.sort((a, b) => (a.width * a.height) - (b.width * b.height));

    // Prefer SD for smaller file size, fall back to smallest HD
    const file = files.find(f => f.quality === 'sd') || files[0];
    if (file?.link) { videoUrl = file.link; break; }
  }

  if (!videoUrl) throw new Error(`No stock video found for: ${keyword}`);

  const videoRes = await fetch(videoUrl);
  if (!videoRes.ok) throw new Error('Failed to download stock video');
  const buffer = Buffer.from(await videoRes.arrayBuffer());
  await writeFile(destPath, buffer);
}

async function assembleVideo(
  stockPath: string,
  audioPath: string,
  title: string,
  outputPath: string,
): Promise<void> {
  // Strip chars that break ffmpeg drawtext
  const safeTitle = title.replace(/['"\\:%=[\]]/g, '').substring(0, 48) || 'Rival';

  await execFileAsync('ffmpeg', [
    '-y',
    '-stream_loop', '-1', '-i', stockPath,
    '-i', audioPath,
    '-filter_complex',
    // Scale to portrait, crop to 720x1280, dim with drawbox, add title caption
    `[0:v]scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280[bg];` +
    `[bg]drawbox=x=0:y=0:w=iw:h=ih:color=black@0.35:t=fill[dim];` +
    `[dim]drawtext=text='${safeTitle}':fontsize=34:fontcolor=white:` +
    `x=(w-tw)/2:y=h-160:font=Sans:box=1:boxcolor=black@0.55:boxborderw=14[v]`,
    '-map', '[v]',
    '-map', '1:a',
    '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '28',
    '-c:a', 'aac', '-b:a', '96k',
    '-shortest',
    outputPath,
  ]);
}

async function runGeneration() {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
  await mkdir(uploadDir, { recursive: true });

  const systemUser = await ensureSystemUser();
  if (!systemUser) return;

  const today = new Date().toISOString().split('T')[0];
  const timestamp = Date.now();

  for (let i = 0; i < 3; i++) {
    const niche = NICHES[(timestamp + i) % NICHES.length];
    const voiceId = VOICES[i % VOICES.length];
    const baseName = `rival_${niche.name}_${today}_${timestamp}_${i}`;
    const stockPath = path.join(uploadDir, `stock_${timestamp}_${i}.mp4`);

    try {
      const { title, script, keyword } = await generateScript(niche);

      const audioBuffer = await generateAudio(script, voiceId);
      const audioPath = path.join(uploadDir, `${baseName}.mp3`);
      await writeFile(audioPath, audioBuffer);

      const videoPath = path.join(uploadDir, `${baseName}.mp4`);
      let fileUrl = `/uploads/videos/${baseName}.mp3`;

      try {
        await fetchStockVideo(keyword, stockPath);
        await assembleVideo(stockPath, audioPath, title, videoPath);
        fileUrl = `/uploads/videos/${baseName}.mp4`;
      } catch (err) {
        console.error('Video assembly failed, using audio only:', err);
      } finally {
        await unlink(stockPath).catch(() => {});
      }

      const hashtags = `#${niche.name} #rival #compete`;
      createVideo(systemUser.id, title, hashtags, fileUrl, '', hashtags);
    } catch (err) {
      console.error(`Generation error (${niche.name}):`, err);
      await unlink(stockPath).catch(() => {});
    }
  }

  try { awardVerifiedBadgesToTopThree(); } catch {}
}

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  runGeneration().catch(console.error);
  return NextResponse.json({ status: 'started', date: new Date().toISOString() });
}
