import { NextRequest } from 'next/server';
import { getVideoCommentsWithReplies, createComment, createReply, getVideoById, createNotification } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const comments = getVideoCommentsWithReplies(parseInt(id));
  return Response.json(comments);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { content, parent_id } = await req.json() as { content: string; parent_id?: number };
  if (!content?.trim()) return Response.json({ error: 'Empty comment' }, { status: 400 });

  const videoId = parseInt(id);
  if (parent_id) {
    createReply(videoId, user.userId, content.trim(), parent_id);
  } else {
    createComment(videoId, user.userId, content.trim());
    const video = getVideoById(videoId);
    if (video && video.user_id !== user.userId) {
      createNotification(video.user_id, 'new_comment', `@${user.username} commented on your video "${video.title.slice(0, 40)}"`);
    }
  }
  return Response.json({ ok: true });
}
