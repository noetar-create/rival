import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { createVideo, createUser, getUserByEmail, awardVerifiedBadgesToTopThree } from '@/lib/db';

const execAsync = promisify(exec);

const NICHES = [
  { name: 'psychology', prompt: 'Write a compelling 60-second video script about an interesting psychology fact or human behavior insight. Make it shocking or surprising. Start with a hook. No intro, just dive in. Max 120 words.' },
  { name: 'true_crime', prompt: 'Write a compelling 60-second video script about a fascinating true crime case or mystery. Keep it factual but gripping. Start with a hook. Max 120 words.' },
  { name: 'relationships', prompt: 'Write a compelling 60-second video script with relationship advice or a surprising relationship fact. Make it relatable. Start with a hook. Max 120 words.' },
  { name: 'finance', prompt: 'Write a compelling 60-second video script about a money tip, financial fact, or wealth-building insight most people don\'t know. Start with a hook. Max 120 words.' },
  { name: 'motivation', prompt: 'Write a compelling 60-second motivational video script that feels raw and real, not cheesy. A mindset shift or brutal truth. Start with a hook. Max 120 words.' },
  { name: 'health', prompt: 'Write a compelling 60-second video script about a surprising health or wellness fact most people get wrong. Start with a hook. Max 120 words.' },
  { name: 'history', prompt: 'Write a compelling 60-second video script about a wild or little-known historical fact or event. Start with a hook. Max 120 words.' },
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

async function generateScript(niche: typeof NICHES[0]): Promise<{ title: string; script: string }> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    messages: [{
      role: 'user',
      content: `${niche.prompt}\n\nAlso give it a catchy short title (max 8 words). Return JSON only: {"title": "...", "script": "..."}`
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

async function createVideoFile(audioPath: string, title: string, outputPath: string, niche: string): Promise<void> {
  const colors: Record<string, string> = {
    psychology: '0x1a0a2e:0x16213e',
    true_crime: '0x1a0000:0x2d0000',
    relationships: '0x1a0a1a:0x2d0a2d',
    finance: '0x0a1a0a:0x0a2d0a',
    motivation: '0x1a1a00:0x2d2d00',
    health: '0x001a1a:0x002d2d',
    history: '0x1a0a00:0x2d1a00',
  };
  const [c1, c2] = (colors[niche] || '0x0a0a1a:0x1a0a2e').split(':');
  const safeTitle = title.replace(/'/g, '').substring(0, 50);
  const cmd = `ffmpeg -y \
    -f lavfi -i "color=c=${c1}:size=720x1280:rate=30" \
    -i "${audioPath}" \
    -filter_complex "\
      [0:v]gradients=s=720x1280:c0=${c1}:c1=${c2}:type=linear:speed=0.3[bg];\
      [bg]drawtext=text='RIVAL':fontsize=48:fontcolor=white@0.3:x=(w-tw)/2:y=100:font=Sans:style=Bold[v1];\
      [v1]drawtext=text='${safeTitle}':fontsize=36:fontcolor=white:x=(w-tw)/2:y=(h-th)/2:font=Sans:style=Bold:line_spacing=10:text_shaping=1[v2]" \
    -map "[v2]" -map "1:a" \
    -c:v libx264 -preset fast -crf 28 \
    -c:a aac -b:a 128k \
    -shortest \
    "${outputPath}" 2>&1`;
  await execAsync(cmd);
}

async function runGeneration() {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
  await mkdir(uploadDir, { recursive: true });

  const systemUser = await ensureSystemUser();
  if (!systemUser) return;

  const today = new Date().toISOString().split('T')[0];
  const timestamp = Date.now();

  for (let i = 0; i < 2; i++) {
    const niche = NICHES[(timestamp + i) % NICHES.length];
    const voiceId = VOICES[i % VOICES.length];
    try {
      const { title, script } = await generateScript(niche);
      const audioBuffer = await generateAudio(script, voiceId);

      const baseName = `rival_${niche.name}_${today}_${timestamp}_${i}`;
      const audioPath = path.join(uploadDir, `${baseName}.mp3`);
      const videoPath = path.join(uploadDir, `${baseName}.mp4`);

      await writeFile(audioPath, audioBuffer);
      await createVideoFile(audioPath, title, videoPath, niche.name);

      const fileUrl = `/uploads/videos/${baseName}.mp4`;
      const hashtags = `#${niche.name} #rival #compete`;
      createVideo(systemUser.id, title, hashtags, fileUrl, '', hashtags);
    } catch (err) {
      console.error('Video generation error:', err);
    }
  }

  try { awardVerifiedBadgesToTopThree(); } catch {}
}

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Return immediately — process runs in background
  runGeneration().catch(console.error);

  return NextResponse.json({ status: 'started', date: new Date().toISOString() });
}
