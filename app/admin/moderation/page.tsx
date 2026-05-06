import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { getFlaggedVideos, approveVideo, rejectVideo } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Moderation Queue',
  robots: { index: false, follow: false },
};

// Simple admin check — in production, add proper role check
const ADMIN_EMAILS = ['noetar@gmail.com', 'admin@rivalapp.io'];

async function handleApprove(formData: FormData) {
  'use server';
  const id = formData.get('id');
  if (id) approveVideo(parseInt(id as string));
  redirect('/admin/moderation');
}

async function handleReject(formData: FormData) {
  'use server';
  const id = formData.get('id');
  if (id) rejectVideo(parseInt(id as string));
  redirect('/admin/moderation');
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return 'just now';
}

export default async function ModerationPage() {
  const user = await getAuthUser();
  if (!user) redirect('/login');
  if (!ADMIN_EMAILS.includes(user.email)) {
    redirect('/');
  }

  let flaggedVideos: Awaited<ReturnType<typeof getFlaggedVideos>> = [];
  try {
    flaggedVideos = getFlaggedVideos();
  } catch {}

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
          🔒 Admin Only
        </div>
        <h1 className="text-3xl font-black text-white mb-2">Moderation Queue</h1>
        <p className="text-white/40">{flaggedVideos.length} video{flaggedVideos.length !== 1 ? 's' : ''} pending review</p>
      </div>

      {flaggedVideos.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-white/5 border border-white/10">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-white mb-2">Queue is clear</h2>
          <p className="text-white/40">No videos pending moderation.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {flaggedVideos.map((video) => (
            <div key={video.id} className="p-6 rounded-2xl bg-[#111111] border border-orange-500/20">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-orange-400 text-xs font-bold bg-orange-400/10 px-2 py-0.5 rounded-full">Flagged</span>
                    <span className="text-white/30 text-xs">{timeAgo(video.created_at)}</span>
                  </div>
                  <h3 className="text-white font-bold mb-1">{video.title}</h3>
                  <p className="text-white/50 text-sm mb-1">by @{video.username}</p>
                  {video.description && (
                    <p className="text-white/40 text-sm">{video.description}</p>
                  )}
                  {video.file_url && (
                    <a href={video.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs mt-2 inline-block hover:text-blue-300">
                      View file →
                    </a>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <form action={handleApprove}>
                    <input type="hidden" name="id" value={video.id} />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded-xl transition-colors"
                    >
                      Approve
                    </button>
                  </form>
                  <form action={handleReject}>
                    <input type="hidden" name="id" value={video.id} />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-xl transition-colors"
                    >
                      Reject
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
