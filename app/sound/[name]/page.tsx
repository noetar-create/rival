import { notFound } from 'next/navigation';
import Link from 'next/link';
import VideoCard from '@/components/VideoCard';
import { getVideosBySound } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ name: string }>;
}

export default async function SoundPage({ params }: Props) {
  const { name } = await params;
  const sound = decodeURIComponent(name);
  const videos = getVideosBySound(sound, 40);

  if (videos.length === 0) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
          <span className="text-3xl">🎵</span>
        </div>
        <div>
          <h1 className="text-xl font-black text-white leading-tight">{sound}</h1>
          <p className="text-white/40 text-sm mt-1">{videos.length} {videos.length === 1 ? 'video' : 'videos'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {videos.map(v => (
          <VideoCard
            key={v.id}
            id={v.id}
            title={v.title}
            description={v.description ?? undefined}
            username={v.username}
            likes={v.likes}
            views={v.views}
            thumbnail_url={v.thumbnail_url}
            created_at={v.created_at}
          />
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link href="/sounds" className="text-purple-400 hover:text-purple-300 text-sm">← Back to Sounds</Link>
      </div>
    </div>
  );
}
