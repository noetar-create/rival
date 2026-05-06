import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getAuthUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, description } = await request.json();
  if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 });

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
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

    const text = response.content[0].type === 'text' ? response.content[0].text : '{"safe": true, "reason": "OK"}';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return NextResponse.json({ safe: true, reason: 'Could not parse moderation response' });

    const result = JSON.parse(match[0]) as { safe: boolean; reason: string };
    return NextResponse.json(result);
  } catch (err) {
    console.error('Moderation error:', err);
    // On error, default to safe (fail open)
    return NextResponse.json({ safe: true, reason: 'Moderation service unavailable' });
  }
}
