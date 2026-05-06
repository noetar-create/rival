import { NextRequest } from 'next/server';
import { getForYouFeed, getFollowingFeed, getTrendingFeed } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type') ?? 'foryou';
  const user = await getAuthUser();
  const userId = user?.userId ?? null;

  let videos;
  if (type === 'following' && userId) {
    videos = getFollowingFeed(userId, 30);
  } else if (type === 'trending') {
    videos = getTrendingFeed(30);
  } else {
    videos = getForYouFeed(userId, 30);
  }

  return Response.json(videos);
}
