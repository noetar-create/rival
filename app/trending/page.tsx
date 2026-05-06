import { getTrendingFeed } from '@/lib/db';
import VideoCard from '@/components/VideoCard';

export const dynamic = 'force-dynamic';

export default function TrendingPage() {
  const videos = getTrendingFeed(40);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🔥</span>
        <div>
          <h1 className="text-2xl font-black text-white">Trending Now</h1>
          <p className="text-white/40 text-sm">Top videos in the last 48 hours</p>
        </div>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-24 text-white/30">
          <div className="text-5xl mb-4">🔥</div>
          <p>No trending videos yet — check back soon</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map((video, i) => (
            <div key={video.id} className="relative">
              {i < 3 && (
                <div className="absolute -top-2 -left-2 z-10 w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white font-black text-sm shadow-lg">
                  {i + 1}
                </div>
              )}
              <VideoCard
                id={video.id}
                title={video.title}
                description={video.description ?? undefined}
                username={video.username}
                likes={video.likes}
                views={video.views}
                thumbnail_url={video.thumbnail_url}
                created_at={video.created_at}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
