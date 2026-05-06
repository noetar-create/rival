import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { addToCollection } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const { video_id } = await req.json() as { video_id: number };
  const result = addToCollection(parseInt(id), video_id, user.userId);
  return Response.json(result);
}
