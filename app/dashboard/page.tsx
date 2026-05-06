import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import {
  getUserById,
  getUserVideos,
  getDailyStats,
  getUserWeeklyRank,
  getUserWeeklyPoints,
  getWeeklyCompetitionWins,
  getReferralStats,
} from '@/lib/db';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Creator Dashboard',
  description: 'Your Rival creator dashboard — stats, videos, referrals, and more.',
  robots: { index: false, follow: false },
};

const ALL_GAMES = ['reaction', 'memory', 'trivia', 'typing', 'emoji', 'wordscramble', 'numberguess', 'predict'];

function formatNum(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return 'today';
}

export default async function DashboardPage() {
  const authUser = await getAuthUser();
  if (!authUser) {
    redirect('/login');
  }

  const user = getUserById(authUser.userId);
  if (!user) redirect('/login');

  let videos: Awaited<ReturnType<typeof getUserVideos>> = [];
  let dailyStats: Awaited<ReturnType<typeof getDailyStats>> = undefined;
  let weeklyRank = 0;
  let weeklyPoints = 0;
  let competitionWins = { wins: 0 };
  let referralStats: Awaited<ReturnType<typeof getReferralStats>> = { referrals: [], totalPoints: 0, count: 0 };

  try {
    videos = getUserVideos(authUser.userId);
    dailyStats = getDailyStats(authUser.userId);
    weeklyRank = getUserWeeklyRank(authUser.userId);
    weeklyPoints = getUserWeeklyPoints(authUser.userId);
    competitionWins = getWeeklyCompetitionWins(authUser.userId);
    referralStats = getReferralStats(authUser.userId);
  } catch {}

  const gamesPlayedToday = dailyStats ? JSON.parse(dailyStats.games_played) as string[] : [];
  const referralLink = `https://rivalapp.io/signup?ref=${user.referral_code ?? ''}`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">
            📊 Dashboard
          </h1>
          <p className="text-white/40 mt-1">
            Hey <span className="text-purple-400">@{user.username}</span>
            {user.verified === 1 && (
              <span className="ml-2 text-blue-400 text-xs font-bold bg-blue-400/20 px-1.5 py-0.5 rounded-full">✓ Verified</span>
            )}
          </p>
        </div>
        <Link href="/upload" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-200">
          + Upload
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Points', value: formatNum(user.total_points), icon: '⚡', color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30' },
          { label: 'Weekly Points', value: formatNum(weeklyPoints), icon: '📅', color: 'from-pink-500/20 to-pink-600/10 border-pink-500/30' },
          { label: 'Weekly Rank', value: weeklyRank > 0 ? `#${weeklyRank}` : '—', icon: '🏆', color: 'from-orange-500/20 to-orange-600/10 border-orange-500/30' },
          { label: 'Comp Wins', value: competitionWins.wins.toString(), icon: '🎯', color: 'from-green-500/20 to-green-600/10 border-green-500/30' },
        ].map((stat) => (
          <div key={stat.label} className={`p-5 rounded-2xl bg-gradient-to-br ${stat.color} border`}>
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-black text-white">{stat.value}</div>
            <div className="text-white/50 text-xs mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Daily game status */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-white font-bold mb-1">Today&apos;s Games</h2>
          <p className="text-white/40 text-xs mb-4">
            {gamesPlayedToday.length}/8 different games — {gamesPlayedToday.length >= 8 ? '✅ Bonus earned!' : `play ${8 - gamesPlayedToday.length} more for +2 pts`}
          </p>
          <div className="grid grid-cols-4 gap-2">
            {ALL_GAMES.map((game) => {
              const done = gamesPlayedToday.includes(game);
              return (
                <div
                  key={game}
                  className={`flex items-center justify-center py-2 rounded-xl text-xs font-medium border transition-all ${
                    done
                      ? 'bg-green-500/20 border-green-500/40 text-green-300'
                      : 'bg-white/5 border-white/10 text-white/30'
                  }`}
                >
                  {done ? '✓' : '○'} {game.replace('numberguess', 'guess').replace('wordscramble', 'words').replace('reaction', 'react').replace('typing', 'type').replace('memory', 'mem').replace('trivia', 'quiz').replace('emoji', 'emoji').replace('predict', 'pred')}
                </div>
              );
            })}
          </div>
          <div className="mt-4">
            <Link href="/games" className="text-purple-400 text-sm hover:text-purple-300 transition-colors">
              Play games →
            </Link>
          </div>
        </div>

        {/* Referral */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-white font-bold mb-1">Referral Program</h2>
          <p className="text-white/40 text-xs mb-4">Share your link. Both of you get +5 pts.</p>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/60 font-mono truncate">
              {user.referral_code ? referralLink : 'No referral code yet'}
            </div>
            {user.referral_code && (
              <button
                onClick={undefined}
                className="shrink-0 px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-colors"
                title="Copy link"
              >
                📋
              </button>
            )}
          </div>

          <div className="flex gap-4 text-center">
            <div className="flex-1 p-3 rounded-xl bg-white/5">
              <div className="text-xl font-black text-white">{referralStats.count}</div>
              <div className="text-white/40 text-xs">Friends referred</div>
            </div>
            <div className="flex-1 p-3 rounded-xl bg-white/5">
              <div className="text-xl font-black text-green-400">{referralStats.totalPoints}</div>
              <div className="text-white/40 text-xs">Points earned</div>
            </div>
          </div>
        </div>
      </div>

      {/* Your videos */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold">Your Videos</h2>
          <span className="text-white/40 text-xs">{videos.length} total</span>
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-white/40 mb-4">No videos yet. Upload your first one!</p>
            <Link href="/upload" className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-200">
              Upload Video
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/30 text-xs border-b border-white/10">
                  <th className="text-left py-2 pr-4 font-medium">Title</th>
                  <th className="text-right py-2 px-2 font-medium">Views</th>
                  <th className="text-right py-2 px-2 font-medium">Likes</th>
                  <th className="text-right py-2 px-2 font-medium">Downloads</th>
                  <th className="text-right py-2 pl-2 font-medium">Posted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {videos.map((v) => (
                  <tr key={v.id} className="group">
                    <td className="py-3 pr-4">
                      <div className="text-white/80 group-hover:text-white transition-colors line-clamp-1">{v.title}</div>
                      {v.flagged === 1 && (
                        <span className="text-[10px] text-orange-400 font-medium">Pending review</span>
                      )}
                    </td>
                    <td className="text-right py-3 px-2 text-white/50">{formatNum(v.views)}</td>
                    <td className="text-right py-3 px-2 text-white/50">{formatNum(v.likes)}</td>
                    <td className="text-right py-3 px-2 text-white/50">{formatNum(v.download_count ?? 0)}</td>
                    <td className="text-right py-3 pl-2 text-white/40">{timeAgo(v.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
