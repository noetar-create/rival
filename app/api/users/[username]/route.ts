import { NextRequest } from 'next/server';
import { getUserProfileByUsername, getUserVideos } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { isFollowing } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const profile = getUserProfileByUsername(username);
  if (!profile) return Response.json({ error: 'Not found' }, { status: 404 });

  const videos = getUserVideos(profile.id);
  const viewer = await getAuthUser();
  const viewerFollowing = viewer ? isFollowing(viewer.userId, profile.id) : false;

  return Response.json({
    id: profile.id,
    username: profile.username,
    avatar_url: profile.avatar_url,
    verified: profile.verified,
    follower_count: profile.follower_count,
    following_count: profile.following_count,
    video_count: profile.video_count,
    viewer_following: viewerFollowing,
    videos,
  });
}
