import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { createStory, getStoriesForFeed } from '@/lib/db';

export async function GET() {
  const user = await getAuthUser();
  const stories = getStoriesForFeed(user?.userId ?? null);
  return Response.json(stories);
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { content, bg_color } = await req.json() as { content: string; bg_color?: string };
  if (!content?.trim()) return Response.json({ error: 'Content required' }, { status: 400 });
  const result = createStory(user.userId, content.trim(), bg_color || '#7c3aed');
  return Response.json({ ok: true, id: result.lastInsertRowid }, { status: 201 });
}
