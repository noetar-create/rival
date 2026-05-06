import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getUserProfileByUsername, getUserVideos, isFollowing } from '@/lib/db';
import VideoCard from '@/components/VideoCard';
import { getAuthUser } from '@/lib/auth';

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

  const viewer = await getAuthUser();
  const isOwn = viewer?.username === username;

  const isPrivate = profile.is_private === 1;
  const viewerFollows = viewer ? isFollowing(viewer.userId, profile.id) : false;
  const canSeeVideos = !isPrivate || isOwn || viewerFollows;

  const allVideos = canSeeVideos ? getUserVideos(profile.id) : [];
  const pinned = canSeeVideos ? profile.pinned_video : null;
  const videos = allVideos.filter(v => !pinned || v.id !== pinned.id);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Profile header */}
      <div className="flex items-center gap-5 mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-black text-white shrink-0">
          {profile.username[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-black text-white truncate">
              {profile.display_name || `@${profile.username}`}
            </h1>
            {profile.verified === 1 && (
              <span className="text-blue-400 text-xs font-bold bg-blue-400/20 px-1.5 py-0.5 rounded-full shrink-0">✓</span>
            )}
          </div>
          {profile.display_name && (
            <p className="text-white/40 text-sm mb-1">@{profile.username}</p>
          )}
          <div className="flex gap-4 text-sm text-white/60">
            <span><span className="text-white font-bold">{formatNum(profile.video_count)}</span> videos</span>
            <span><span className="text-white font-bold">{formatNum(profile.follower_count)}</span> followers</span>
            <span><span className="text-white font-bold">{formatNum(profile.following_count)}</span> following</span>
          </div>
        </div>
      </div>

      {/* Bio & website */}
      {profile.bio && (
        <p className="text-white/70 text-sm leading-relaxed mb-2 whitespace-pre-wrap">{profile.bio}</p>
      )}
      {profile.website && (
        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-purple-400 text-sm hover:text-purple-300 mb-4 inline-block">
          🔗 {profile.website.replace(/^https?:\/\//, '')}
        </a>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 mb-8 mt-4">
        {isOwn ? (
          <>
            <Link href="/edit-profile" className="flex-1 text-center py-2 px-4 border border-white/20 text-white text-sm font-semibold rounded-xl hover:bg-white/5 transition-colors">
              Edit Profile
            </Link>
            <Link href="/settings" className="px-4 py-2 border border-white/20 text-white/60 text-sm rounded-xl hover:bg-white/5 transition-colors">
              ⚙️
            </Link>
            <Link href={`/messages/${username}`} className="px-4 py-2 border border-white/20 text-white/60 text-sm rounded-xl hover:bg-white/5 transition-colors">
              💬
            </Link>
          </>
        ) : (
          <>
            <a
              href={`/api/users/${profile.username}/follow`}
              className="flex-1 text-center py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              Follow
            </a>
            <Link href={`/messages/${username}`} className="px-4 py-2 bg-white/10 text-white text-sm font-semibold rounded-xl hover:bg-white/15 transition-colors">
              💬 Message
            </Link>
          </>
        )}
      </div>

      {/* Pinned video */}
      {pinned && (
        <div className="mb-6">
          <div className="flex items-center gap-2 text-white/50 text-xs font-semibold mb-2">
            <span>📌</span> <span>PINNED</span>
          </div>
          <VideoCard
            id={pinned.id}
            title={pinned.title}
            description={pinned.description ?? undefined}
            username={pinned.username}
            likes={pinned.likes}
            views={pinned.views}
            thumbnail_url={pinned.thumbnail_url}
            created_at={pinned.created_at}
          />
        </div>
      )}

      {/* Private account wall */}
      {isPrivate && !canSeeVideos ? (
        <div className="text-center py-16 border border-white/10 rounded-2xl bg-white/3">
          <div className="text-4xl mb-3">🔒</div>
          <p className="text-white font-bold mb-1">This account is private</p>
          <p className="text-white/40 text-sm">Follow to see their videos</p>
        </div>
      ) : (
        <>
          {/* Videos grid */}
          <h2 className="text-white font-bold text-sm mb-3">Videos ({allVideos.length})</h2>
          {videos.length === 0 && !pinned ? (
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
        </>
      )}

      <div className="mt-8 text-center">
        <Link href="/" className="text-purple-400 hover:text-purple-300 text-sm">← Back to feed</Link>
      </div>
    </div>
  );
}
