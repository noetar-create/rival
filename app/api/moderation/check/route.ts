import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getAuthUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, description } = await request.json();
  if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 });

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

    const text = response.choices[0]?.message?.content ?? '{"safe": true, "reason": "OK"}';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return NextResponse.json({ safe: true, reason: 'Could not parse moderation response' });

    const result = JSON.parse(match[0]) as { safe: boolean; reason: string };
    return NextResponse.json(result);
  } catch (err) {
    console.error('Moderation error:', err);
    return NextResponse.json({ safe: true, reason: 'Moderation service unavailable' });
  }
}
