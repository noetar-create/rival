import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { getMessages, sendMessage, getUserByUsername, createNotification } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { username } = await params;
  const other = getUserByUsername(username);
  if (!other) return Response.json({ error: 'User not found' }, { status: 404 });
  const messages = getMessages(user.userId, other.id);
  return Response.json({ messages, other: { id: other.id, username: other.username, avatar_url: other.avatar_url } });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { username } = await params;
  const other = getUserByUsername(username);
  if (!other) return Response.json({ error: 'User not found' }, { status: 404 });
  if (other.id === user.userId) return Response.json({ error: 'Cannot message yourself' }, { status: 400 });
  const { content } = await req.json() as { content: string };
  if (!content?.trim()) return Response.json({ error: 'Empty message' }, { status: 400 });
  sendMessage(user.userId, other.id, content.trim());
  createNotification(other.id, 'new_message', `@${user.username} sent you a message.`);
  return Response.json({ ok: true });
}
