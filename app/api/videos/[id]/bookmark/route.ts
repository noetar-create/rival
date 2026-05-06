import { NextRequest } from 'next/server';
import { toggleBookmark } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const videoId = parseInt(id);
  const result = toggleBookmark(videoId, user.userId);
  return Response.json(result);
}
