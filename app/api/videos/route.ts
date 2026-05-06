import { NextRequest } from 'next/server';
import { getVideos, createVideo, createVideoFlagged } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import OpenAI from 'openai';

async function moderateContent(title: string, description: string): Promise<{ safe: boolean; reason: string }> {
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: `You are a content moderator. Evaluate if this video content violates community rules.

Rules violations: hate speech, nudity/explicit sexual content, graphic violence, spam, harassment, illegal content, or bot-generated manipulation.

Title: "${title}"
Description: "${description || ''}"

Respond with JSON only: {"safe": true/false, "reason": "brief explanation"}`
      }]
    });
    const text = response.choices[0]?.message?.content ?? '';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return { safe: true, reason: 'OK' };
    return JSON.parse(match[0]) as { safe: boolean; reason: string };
  } catch {
    return { safe: true, reason: 'Moderation unavailable' };
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');
  const videos = getVideos(limit, offset);
  return Response.json({ videos });
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, description, file_url, thumbnail_url, hashtags, content_warning, duet_of_id, sound } = await request.json();
  if (!title) return Response.json({ error: 'Title required' }, { status: 400 });

  // Run moderation check
  const modResult = await moderateContent(title, description || '');

  let result;
  if (!modResult.safe) {
    result = createVideoFlagged(user.userId, title, description || '', file_url || '', thumbnail_url || '', hashtags || null);
    return Response.json({
      success: true,
      id: result.lastInsertRowid,
      flagged: true,
      message: 'Your video is pending review.',
    }, { status: 201 });
  }

  result = createVideo(user.userId, title, description || '', file_url || '', thumbnail_url || '', hashtags || null, content_warning ? 1 : 0, duet_of_id || null, sound || undefined);
  return Response.json({ success: true, id: result.lastInsertRowid, flagged: false }, { status: 201 });
}
