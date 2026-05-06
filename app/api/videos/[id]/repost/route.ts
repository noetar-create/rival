import { NextRequest } from 'next/server';
import { toggleRepost } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const result = toggleRepost(parseInt(id), user.userId);
  return Response.json(result);
}
