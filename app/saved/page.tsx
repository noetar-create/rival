import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { getUserBookmarks } from '@/lib/db';
import VideoCard from '@/components/VideoCard';

export const metadata: Metadata = {
  title: 'Saved Videos',
  description: 'Your bookmarked and saved videos on Rival.',
  robots: { index: false, follow: false },
};

export default async function SavedPage() {
  const user = await getAuthUser();
  if (!user) {
    redirect('/login');
  }

  let bookmarks: Awaited<ReturnType<typeof getUserBookmarks>> = [];
  try {
    bookmarks = getUserBookmarks(user.userId);
  } catch {}

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">🔖 Saved Videos</h1>
        <p className="text-white/40">Videos you&apos;ve bookmarked to watch later.</p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-24 rounded-3xl bg-white/5 border border-white/10">
          <div className="text-5xl mb-4">🔖</div>
          <h2 className="text-xl font-bold text-white mb-2">No saved videos yet</h2>
          <p className="text-white/40 mb-6">Tap the bookmark button on any video in the feed to save it here.</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl text-sm"
          >
            Browse Videos
          </a>
        </div>
      ) : (
        <>
          <p className="text-white/40 text-sm mb-6">{bookmarks.length} saved video{bookmarks.length !== 1 ? 's' : ''}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {bookmarks.map((video) => (
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
        </>
      )}
    </div>
  );
}
