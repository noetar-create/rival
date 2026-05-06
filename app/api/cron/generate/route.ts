import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { createVideo, createFeedGame, awardVerifiedBadgesToTopThree } from '@/lib/db';

const execFileAsync = promisify(execFile);

const NICHES = [
  { name: 'psychology', prompt: 'Write a viral TikTok-style 60-second voiceover script about a shocking psychology or dark human behavior fact. Hook in the first sentence. Use "you"/"your". Punchy, no filler. Max 120 words. Return JSON: {"title":"...","script":"...","keyword":"2-3 word pexels search"}' },
  { name: 'true_crime', prompt: 'Write a viral TikTok-style 60-second voiceover script about a gripping true crime case or unsolved mystery. Start with the most shocking detail. Max 120 words. Return JSON: {"title":"...","script":"...","keyword":"2-3 word pexels search"}' },
  { name: 'relationships', prompt: 'Write a viral TikTok-style 60-second voiceover script about a surprising relationship or dating truth that stops people mid-scroll. Speak directly to the viewer. Max 120 words. Return JSON: {"title":"...","script":"...","keyword":"2-3 word pexels search"}' },
  { name: 'finance', prompt: 'Write a viral TikTok-style 60-second voiceover script about a money secret or wealth truth most people never learn. Make it feel urgent. Max 120 words. Return JSON: {"title":"...","script":"...","keyword":"2-3 word pexels search"}' },
  { name: 'motivation', prompt: 'Write a viral TikTok-style 60-second voiceover script — raw, no-BS mindset shift or hard truth about success or discipline. No clichés. Max 120 words. Return JSON: {"title":"...","script":"...","keyword":"2-3 word pexels search"}' },
  { name: 'health', prompt: 'Write a viral TikTok-style 60-second voiceover script about a health or body fact most people have completely backwards. Make it feel like forbidden knowledge. Max 120 words. Return JSON: {"title":"...","script":"...","keyword":"2-3 word pexels search"}' },
  { name: 'history', prompt: 'Write a viral TikTok-style 60-second voiceover script about a wild, dark, or little-known historical event. Start with the most insane detail. Max 120 words. Return JSON: {"title":"...","script":"...","keyword":"2-3 word pexels search"}' },
  { name: 'comedy', prompt: 'Write a viral TikTok-style 60-second voiceover script that is genuinely funny — absurd observations, "nobody talks about this" moments, or hilariously true facts about everyday life. Dry humor, fast pace. Max 120 words. Return JSON: {"title":"...","script":"...","keyword":"2-3 word pexels search"}' },
  { name: 'science', prompt: 'Write a viral TikTok-style 60-second voiceover script about a mind-blowing science or space fact that makes people question reality. Start with something that sounds impossible. Max 120 words. Return JSON: {"title":"...","script":"...","keyword":"2-3 word pexels search"}' },
  { name: 'mystery', prompt: 'Write a viral TikTok-style 60-second voiceover script about a real unsolved mystery, strange phenomenon, or conspiracy that turned out to be true. Build suspense. Max 120 words. Return JSON: {"title":"...","script":"...","keyword":"2-3 word pexels search"}' },
  { name: 'horror', prompt: 'Write a viral TikTok-style 60-second voiceover script about a creepy real event, psychological horror fact, or terrifying true story. Build dread slowly. Max 120 words. Return JSON: {"title":"...","script":"...","keyword":"2-3 word pexels search"}' },
  { name: 'life_hacks', prompt: 'Write a viral TikTok-style 60-second voiceover script with life hacks or tips that feel almost illegal they are so useful — things people wish someone told them years ago. Max 120 words. Return JSON: {"title":"...","script":"...","keyword":"2-3 word pexels search"}' },
  { name: 'fitness', prompt: 'Write a viral TikTok-style 60-second voiceover script about a fitness or body truth that most gym-goers get completely wrong. Confident and direct. Max 120 words. Return JSON: {"title":"...","script":"...","keyword":"2-3 word pexels search"}' },
  { name: 'food', prompt: 'Write a viral TikTok-style 60-second voiceover script about a shocking food fact or dangerous ingredient that will change how someone thinks about what they eat. Max 120 words. Return JSON: {"title":"...","script":"...","keyword":"2-3 word pexels search"}' },
  { name: 'self_improvement', prompt: 'Write a viral TikTok-style 60-second voiceover script about a stoicism or self-improvement insight that actually changes behavior — specific, not generic. Max 120 words. Return JSON: {"title":"...","script":"...","keyword":"2-3 word pexels search"}' },
  { name: 'top10', prompt: 'Write a viral TikTok-style 60-second rapid-fire Top 10 list voiceover script. Pick any fascinating topic (dangerous places, illegal foods, psychological tricks, money facts, historical events, strange laws, etc). Format: "Number 10... Number 9..." Each item gets one punchy sentence. Fast pace. Max 130 words. Return JSON: {"title":"...","script":"...","keyword":"2-3 word pexels search"}' },
  { name: 'did_you_know', prompt: 'Write a viral TikTok-style 60-second voiceover script starting with one mind-blowing "did you know" fact, then expand on it with 3-4 related shocking details. Hook immediately. Max 120 words. Return JSON: {"title":"...","script":"...","keyword":"2-3 word pexels search"}' },
  { name: 'dark_facts', prompt: 'Write a viral TikTok-style 60-second voiceover script revealing the dark, hidden, or disturbing truth behind something everyday — a company, a food brand, a famous place, a childhood thing. Unsettling but factual. Max 120 words. Return JSON: {"title":"...","script":"...","keyword":"2-3 word pexels search"}' },
  { name: 'animals', prompt: 'Write a viral TikTok-style 60-second voiceover script about a bizarre animal ability, the most dangerous creature most people ignore, or a shocking animal fact. Make it feel unbelievable. Max 120 words. Return JSON: {"title":"...","script":"...","keyword":"2-3 word pexels search"}' },
  { name: 'geography', prompt: 'Write a viral TikTok-style 60-second voiceover script about a fascinating country or geography fact — countries that barely exist, bizarre borders, islands nobody lives on, places you cannot visit. Max 120 words. Return JSON: {"title":"...","script":"...","keyword":"2-3 word pexels search"}' },
  { name: 'wealthy', prompt: 'Write a viral TikTok-style 60-second voiceover script about how the ultra-rich actually live — secret habits, what billionaires spend money on, wealth facts that sound fake but are real. Max 120 words. Return JSON: {"title":"...","script":"...","keyword":"2-3 word pexels search"}' },
  { name: 'sleep_dreams', prompt: 'Write a viral TikTok-style 60-second voiceover script about a shocking sleep or dream fact — sleep paralysis, why you twitch, what happens to your brain, lucid dreaming, or sleep deprivation effects. Max 120 words. Return JSON: {"title":"...","script":"...","keyword":"2-3 word pexels search"}' },
  { name: 'human_body', prompt: 'Write a viral TikTok-style 60-second voiceover script about a weird or disturbing thing the human body does that most people never think about. Make it feel like forbidden anatomy. Max 120 words. Return JSON: {"title":"...","script":"...","keyword":"2-3 word pexels search"}' },
  { name: 'predictions', prompt: 'Write a viral TikTok-style 60-second voiceover script about a bold, science-backed prediction — what Earth looks like in 100 years, the future of AI, climate, space colonization, or human evolution. Max 120 words. Return JSON: {"title":"...","script":"...","keyword":"2-3 word pexels search"}' },
  { name: 'survival', prompt: 'Write a viral TikTok-style 60-second voiceover script with survival tips for a specific scenario most people never think about — quicksand, rip currents, bear attacks, getting lost, car underwater, etc. Urgent and practical. Max 120 words. Return JSON: {"title":"...","script":"...","keyword":"2-3 word pexels search"}' },
  { name: 'space', prompt: 'Write a viral TikTok-style 60-second voiceover script about a space or universe fact that makes people feel insignificant in the best way — black holes, the scale of space, parallel universes, what is beyond the universe. Max 120 words. Return JSON: {"title":"...","script":"...","keyword":"2-3 word pexels search"}' },
  { name: 'conspiracy_true', prompt: 'Write a viral TikTok-style 60-second voiceover script about a real conspiracy theory that turned out to be completely true — MKUltra, Operation Paperclip, COINTELPRO, corporate cover-ups. Factual and shocking. Max 120 words. Return JSON: {"title":"...","script":"...","keyword":"2-3 word pexels search"}' },
];

const VOICES = ['onyx', 'nova', 'alloy', 'echo', 'fable', 'shimmer'] as const;

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
      content: `${niche.prompt}\n\nIMPORTANT: Return raw JSON only, no markdown, no explanation.`
    }]
  });
  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON in response');
  return JSON.parse(match[0]);
}

async function generateAudio(script: string, voice: string): Promise<Buffer> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.audio.speech.create({
    model: 'tts-1',
    voice: voice as 'onyx' | 'nova' | 'alloy' | 'echo' | 'fable' | 'shimmer',
    input: script,
    response_format: 'mp3',
  });
  return Buffer.from(await response.arrayBuffer());
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

async function generateGames() {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1500,
    messages: [{
      role: 'user',
      content: `Generate 5 trivia questions for a TikTok-style feed game. Make each one surprising, mind-blowing, or hard to believe. Mix these categories: science, history, geography, nature, space, food, animals, body, psychology, finance. Each question needs exactly 4 answer options with only 1 correct. Include a short fun fact (1 sentence) revealed after answering. Return a JSON array only, no markdown: [{"question":"...","options":["a","b","c","d"],"correct_index":0,"category":"science","fun_fact":"..."}]`
    }]
  });
  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) return;
  const games = JSON.parse(match[0]) as Array<{ question: string; options: string[]; correct_index: number; category: string; fun_fact: string }>;
  for (const g of games) {
    try { createFeedGame(g.question, g.options, g.correct_index, g.category, g.fun_fact); } catch {}
  }
}

async function runGeneration() {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
  await mkdir(uploadDir, { recursive: true });

  const systemUser = await ensureSystemUser();
  if (!systemUser) return;

  const today = new Date().toISOString().split('T')[0];
  const timestamp = Date.now();

  for (let i = 0; i < 8; i++) {
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
  try { await generateGames(); } catch (e) { console.error('Game generation failed:', e); }
}

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  runGeneration().catch(console.error);
  return NextResponse.json({ status: 'started', date: new Date().toISOString() });
}
