import { getAuthUser } from '@/lib/auth';
import { getCreatorWatchAnalytics, getFollowerCount, getFollowingCount } from '@/lib/db';

export async function GET() {
  const user = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const videos = getCreatorWatchAnalytics(user.userId);
  const totalViews = videos.reduce((s, v) => s + v.views, 0);
  const totalLikes = videos.reduce((s, v) => s + v.likes, 0);
  const followerCount = getFollowerCount(user.userId);
  const followingCount = getFollowingCount(user.userId);
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
  const recentViews = videos.filter(v => v.created_at > weekAgo).reduce((s, v) => s + v.views, 0);
  const totalWatchEvents = videos.reduce((s, v) => s + v.watch_events, 0);
  const avgWatchSeconds = totalWatchEvents > 0
    ? Math.round(videos.reduce((s, v) => s + v.avg_watch_seconds * v.watch_events, 0) / totalWatchEvents)
    : 0;

  const sources = {
    feed: videos.reduce((s, v) => s + v.from_feed, 0),
    direct: videos.reduce((s, v) => s + v.from_direct, 0),
    profile: videos.reduce((s, v) => s + v.from_profile, 0),
    search: videos.reduce((s, v) => s + v.from_search, 0),
  };

  return Response.json({ videos, totalViews, totalLikes, followerCount, followingCount, recentViews, avgWatchSeconds, totalWatchEvents, sources });
}
