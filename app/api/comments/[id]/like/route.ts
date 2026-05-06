import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { toggleCommentLike } from '@/lib/db';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const result = toggleCommentLike(parseInt(id), user.userId);
  return Response.json(result);
}
