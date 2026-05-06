import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { markMessagesRead, getUserByUsername } from '@/lib/db';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { username } = await params;
  const other = getUserByUsername(username);
  if (!other) return Response.json({ error: 'Not found' }, { status: 404 });
  markMessagesRead(user.userId, other.id);
  return Response.json({ ok: true });
}
