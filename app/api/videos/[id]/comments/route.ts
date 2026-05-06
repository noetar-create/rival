import { NextRequest } from 'next/server';
import { getVideoComments, createComment } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const comments = getVideoComments(parseInt(id));
  return Response.json(comments);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { content } = await req.json() as { content: string };
  if (!content?.trim()) return Response.json({ error: 'Empty comment' }, { status: 400 });

  createComment(parseInt(id), user.userId, content.trim());
  return Response.json({ ok: true });
}
