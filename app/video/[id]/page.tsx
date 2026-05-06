import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getVideoById } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const video = getVideoById(parseInt(id));
  if (!video) return { title: 'Video not found' };
  return {
    title: `${video.title} — Rival`,
    description: video.description ?? `Watch this video by @${video.username} on Rival`,
    openGraph: {
      title: video.title,
      description: video.description ?? `Watch on Rival`,
      images: video.thumbnail_url ? [video.thumbnail_url] : [],
      type: 'video.other',
    },
    twitter: {
      card: 'summary_large_image',
      title: video.title,
      description: video.description ?? `Watch on Rival`,
    },
  };
}

function formatNum(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

const gradients = [
  'from-purple-600 via-pink-600 to-orange-500',
  'from-blue-600 via-purple-600 to-pink-500',
  'from-green-500 via-teal-500 to-blue-600',
  'from-orange-500 via-red-500 to-pink-600',
  'from-indigo-600 via-blue-500 to-cyan-500',
  'from-pink-500 via-rose-500 to-orange-500',
];

export default async function VideoPage({ params }: Props) {
  const { id } = await params;
  const video = getVideoById(parseInt(id));
  if (!video) notFound();

  const gradient = gradients[video.id % gradients.length];
  const hashtags = video.hashtags?.match(/#[\w]+/g) ?? [];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Video player */}
        <div className="relative rounded-3xl overflow-hidden bg-black aspect-[9/16] mb-4">
          {video.file_url ? (
            <video
              src={video.file_url}
              className="w-full h-full object-cover"
              controls
              autoPlay
              loop
              playsInline
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
              <div className="text-center px-6">
                <div className="text-5xl mb-3">🎬</div>
                <p className="text-white font-bold text-lg leading-snug">{video.title}</p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Meta */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Link href={`/profile/${video.username}`} className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-black text-white shrink-0">
              {video.username[0]?.toUpperCase()}
            </Link>
            <div>
              <Link href={`/profile/${video.username}`} className="text-white font-bold text-sm hover:text-purple-300">@{video.username}</Link>
              {video.verified === 1 && <span className="ml-1 text-blue-400 text-xs">✓</span>}
            </div>
          </div>

          <h1 className="text-white font-bold text-base leading-snug">{video.title}</h1>

          <div className="flex gap-4 text-white/50 text-sm">
            <span>❤️ {formatNum(video.likes)}</span>
            <span>👁 {formatNum(video.views)}</span>
          </div>

          {hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {hashtags.map(tag => (
                <Link key={tag} href={`/hashtag/${tag.replace('#', '')}`} className="text-purple-400 text-sm hover:text-purple-300">
                  {tag}
                </Link>
              ))}
            </div>
          )}

          <Link
            href="/"
            className="block w-full text-center py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity mt-2"
          >
            Watch more on Rival →
          </Link>
        </div>
      </div>
    </div>
  );
}
