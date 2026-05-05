import type { Metadata } from 'next';
import { getVideos } from '@/lib/db';
import VideoCard from '@/components/VideoCard';

export const metadata: Metadata = {
  title: 'Rival — Compete. Win. Repeat.',
  description: 'The competitive social platform. Post videos, play daily mini-games, and climb the weekly leaderboard to win real prizes every week.',
  openGraph: {
    title: 'Rival — Compete. Win. Repeat.',
    description: 'Post videos, play games, and compete for weekly prizes on the most competitive social platform ever built.',
  },
};

const mockVideos = [
  { id: 1, user_id: 1, title: "My reaction to winning the weekly leaderboard 🏆", description: "Three weeks in a row!", username: "champ_carlos", likes: 2847, views: 41200, thumbnail_url: null, created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: 2, user_id: 2, title: "The emoji decode game broke my brain 🧠", description: "Level 7 was impossible", username: "emoji_queen", likes: 1923, views: 28500, thumbnail_url: null, created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
  { id: 3, user_id: 3, title: "I typed 87 WPM on my phone. No big deal 😎", description: "Mobile typing speedrun", username: "fast_fingers99", likes: 4201, views: 67800, thumbnail_url: null, created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() },
  { id: 4, user_id: 4, title: "Hot take contest winner reveals ☕", description: "You won't believe what I said", username: "opinionsonly", likes: 891, views: 15300, thumbnail_url: null, created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() },
  { id: 5, user_id: 5, title: "Caption contest strategy that never fails", description: "The second-layer joke always wins", username: "caption_king", likes: 3112, views: 52000, thumbnail_url: null, created_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString() },
  { id: 6, user_id: 6, title: "Reaction time 187ms — new Rival record?!", description: "Training paid off", username: "reflex_master", likes: 6720, views: 98400, thumbnail_url: null, created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Rival',
  url: 'https://rivalapp.io',
  description: 'The competitive social platform where you post videos, play daily games, and battle for the weekly leaderboard.',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://rivalapp.io/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export default function HomePage() {
  let dbVideos: typeof mockVideos = [];
  try {
    const fetched = getVideos(20, 0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dbVideos = fetched as any;
  } catch {}
  const videos = dbVideos.length > 0 ? dbVideos : mockVideos;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="relative rounded-3xl overflow-hidden mb-10 bg-gradient-to-br from-purple-900/40 via-[#111111] to-pink-900/30 border border-purple-500/20 p-8 md:p-12">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-transparent to-pink-600/5" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 live-pulse inline-block" />
              LIVE COMPETITIONS NOW
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4">
              Compete.<br />
              <span className="gradient-text">Win. Repeat.</span>
            </h1>
            <p className="text-white/60 text-lg md:text-xl max-w-xl mb-6">
              The social platform with real stakes. Post videos, play daily mini-games, vote on the funniest content, and battle for the weekly prize.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/signup"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/30 text-sm"
              >
                Start Competing Free
              </a>
              <a
                href="/games"
                className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl transition-all duration-200 border border-white/10 text-sm"
              >
                Browse Games
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10">
            {[
              { value: '7', label: 'Daily Games' },
              { value: '+2 pts', label: 'Per competition win' },
              { value: 'Weekly', label: 'Prize resets' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-black gradient-text">{stat.value}</div>
                <div className="text-white/40 text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Competitions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Today&apos;s Competitions</h2>
            <span className="text-white/40 text-sm">Win +2 pts each</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { href: '/vote', label: 'Video Vote', icon: '🎬', color: 'from-purple-600 to-indigo-600' },
              { href: '/funniest', label: 'Funniest Post', icon: '😂', color: 'from-pink-600 to-rose-600' },
              { href: '/caption', label: 'Caption This', icon: '💬', color: 'from-orange-500 to-amber-500' },
              { href: '/hottakes', label: 'Hot Takes', icon: '🔥', color: 'from-red-600 to-orange-600' },
              { href: '/predict', label: 'Predict', icon: '🔮', color: 'from-blue-600 to-cyan-600' },
            ].map((comp) => (
              <a
                key={comp.href}
                href={comp.href}
                className={`group flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br ${comp.color} opacity-90 hover:opacity-100 border border-white/10 hover:border-white/20 transition-all duration-200 hover:scale-[1.03] hover:shadow-lg`}
              >
                <span className="text-3xl group-hover:scale-110 transition-transform duration-200">{comp.icon}</span>
                <span className="text-white text-xs font-semibold text-center leading-tight">{comp.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Video Feed */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-white">🔥 Trending Videos</h2>
            <a href="/upload" className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
              + Upload yours
            </a>
          </div>

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
        </div>

        {/* CTA Banner */}
        <div className="mt-12 text-center py-12 px-6 rounded-3xl bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/20">
          <h2 className="text-3xl font-black text-white mb-3">Ready to compete?</h2>
          <p className="text-white/50 mb-6 max-w-md mx-auto">
            Join thousands of creators and competitors. Play games, post videos, win prizes — every single week.
          </p>
          <a
            href="/signup"
            className="inline-block px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-purple-500/30"
          >
            Join Rival Free →
          </a>
        </div>
      </div>
    </>
  );
}
