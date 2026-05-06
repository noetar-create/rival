import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { deleteCollection, getCollectionItems } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const videos = getCollectionItems(parseInt(id), user.userId);
  return Response.json(videos);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  deleteCollection(parseInt(id), user.userId);
  return Response.json({ ok: true });
}
