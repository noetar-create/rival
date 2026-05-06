import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getUserProfileByUsername, getUserVideos } from '@/lib/db';
import VideoCard from '@/components/VideoCard';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ username: string }>;
}

function formatNum(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const profile = getUserProfileByUsername(username);
  if (!profile) notFound();

  const videos = getUserVideos(profile.id);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Profile header */}
      <div className="flex items-center gap-5 mb-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-black text-white shrink-0">
          {profile.username[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-black text-white truncate">@{profile.username}</h1>
            {profile.verified === 1 && (
              <span className="text-blue-400 text-xs font-bold bg-blue-400/20 px-1.5 py-0.5 rounded-full shrink-0">✓</span>
            )}
          </div>
          <div className="flex gap-4 text-sm text-white/60">
            <span><span className="text-white font-bold">{formatNum(profile.video_count)}</span> videos</span>
            <span><span className="text-white font-bold">{formatNum(profile.follower_count)}</span> followers</span>
            <span><span className="text-white font-bold">{formatNum(profile.following_count)}</span> following</span>
          </div>
        </div>
        <a
          href={`/api/users/${profile.username}/follow`}
          className="shrink-0 px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-xl"
        >
          Follow
        </a>
      </div>

      {/* Videos grid */}
      {videos.length === 0 ? (
        <div className="text-center py-16 text-white/30">No videos yet</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              id={video.id}
              title={video.title}
              description={video.description ?? undefined}
              username={video.username}
              likes={video.likes}
              views={video.views}
              thumbnail_url={video.thumbnail_url}
              created_at={video.created_at}
            />
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link href="/" className="text-purple-400 hover:text-purple-300 text-sm">← Back to feed</Link>
      </div>
    </div>
  );
}
