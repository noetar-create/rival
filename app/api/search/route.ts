import { NextRequest } from 'next/server';
import { searchVideos, searchUsers } from '@/lib/db';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? '';
  if (!q) return Response.json({ videos: [], users: [] });

  const videos = searchVideos(q, 20);
  const users = searchUsers(q, 8);
  return Response.json({ videos, users });
}
