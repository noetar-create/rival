import { NextRequest } from 'next/server';
import { getVideos, createVideo } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');
  const videos = getVideos(limit, offset);
  return Response.json({ videos });
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, description, file_url, thumbnail_url } = await request.json();
  if (!title) return Response.json({ error: 'Title required' }, { status: 400 });

  const result = createVideo(user.userId, title, description || '', file_url || '', thumbnail_url || '');
  return Response.json({ success: true, id: result.lastInsertRowid }, { status: 201 });
}
