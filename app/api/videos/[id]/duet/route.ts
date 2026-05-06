import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { getVideoById, getDuetVideos } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const duets = getDuetVideos(parseInt(id));
  return Response.json(duets);
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const video = getVideoById(parseInt(id));
  if (!video) return Response.json({ error: 'Not found' }, { status: 404 });
  // Returns upload URL with duet context — the actual video creation happens via /api/videos POST with duet_of_id
  return Response.json({ duet_of_id: video.id, duet_of_username: video.username, duet_of_title: video.title });
}
