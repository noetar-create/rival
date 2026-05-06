import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { removeFromCollection } from '@/lib/db';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; videoId: string }> }
) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, videoId } = await params;
  removeFromCollection(parseInt(id), parseInt(videoId), user.userId);
  return Response.json({ ok: true });
}
