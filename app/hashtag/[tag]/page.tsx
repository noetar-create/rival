import type { Metadata } from 'next';
import { getVideosByHashtag } from '@/lib/db';
import VideoCard from '@/components/VideoCard';

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `#${tag} videos`,
    description: `All videos tagged with #${tag} on Rival — the competitive social platform.`,
    openGraph: {
      title: `#${tag} on Rival`,
      description: `Watch and compete with #${tag} content on Rival.`,
    },
  };
}

export default async function HashtagPage({ params }: Props) {
  const { tag } = await params;

  let videos: Awaited<ReturnType<typeof getVideosByHashtag>> = [];
  try {
    videos = getVideosByHashtag(tag, 40);
  } catch {}

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-semibold px-4 py-2 rounded-full mb-4">
          #{tag}
        </div>
        <h1 className="text-3xl font-black text-white mb-2">
          <span className="text-purple-400">#</span>{tag}
        </h1>
        <p className="text-white/40">{videos.length} video{videos.length !== 1 ? 's' : ''} tagged with #{tag}</p>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-24 rounded-3xl bg-white/5 border border-white/10">
          <div className="text-5xl mb-4">🎬</div>
          <h2 className="text-xl font-bold text-white mb-2">No videos yet for #{tag}</h2>
          <p className="text-white/40 mb-6">Be the first to upload a video with this hashtag!</p>
          <a
            href="/upload"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl text-sm"
          >
            Upload Video
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
    </div>
  );
}
