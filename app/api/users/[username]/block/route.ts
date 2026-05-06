import { NextRequest } from 'next/server';
import { blockUser, getUserByUsername } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { username } = await params;
  const target = getUserByUsername(username);
  if (!target) return Response.json({ error: 'Not found' }, { status: 404 });
  if (target.id === user.userId) return Response.json({ error: 'Cannot block yourself' }, { status: 400 });

  const result = blockUser(user.userId, target.id);
  return Response.json(result);
}
