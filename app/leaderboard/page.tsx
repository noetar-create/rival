import type { Metadata } from 'next';
import { getWeeklyLeaderboard } from '@/lib/db';
import LeaderboardRow from '@/components/LeaderboardRow';

export const metadata: Metadata = {
  title: 'Weekly Leaderboard — Rival',
  description: 'See who is dominating the Rival weekly leaderboard. Top 3 players win prizes every Monday.',
};

export default function LeaderboardPage() {
  let leaderboard: { id: number; username: string; avatar_url: string | null; weekly_points: number }[] = [];
  try {
    leaderboard = getWeeklyLeaderboard();
  } catch {}

  // Fill with mock data if empty
  if (leaderboard.length === 0) {
    leaderboard = [
      { id: 1, username: 'champ_carlos', avatar_url: null, weekly_points: 47 },
      { id: 2, username: 'reflex_master', avatar_url: null, weekly_points: 41 },
      { id: 3, username: 'trivia_queen', avatar_url: null, weekly_points: 38 },
      { id: 4, username: 'caption_king', avatar_url: null, weekly_points: 34 },
      { id: 5, username: 'emoji_queen', avatar_url: null, weekly_points: 31 },
      { id: 6, username: 'fast_fingers99', avatar_url: null, weekly_points: 28 },
      { id: 7, username: 'opinionsonly', avatar_url: null, weekly_points: 25 },
      { id: 8, username: 'memory_maestro', avatar_url: null, weekly_points: 22 },
    ];
  }

  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  const resetDate = new Date(now);
  resetDate.setDate(now.getDate() + daysUntilMonday);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
          🏆 WEEKLY COMPETITION • RESETS EVERY MONDAY
        </div>
        <h1 className="text-3xl font-black text-white mb-2">Weekly Leaderboard</h1>
        <p className="text-white/50">
          Resets in {daysUntilMonday} day{daysUntilMonday !== 1 ? 's' : ''} on Monday.
          Top 3 win prizes.
        </p>
      </div>

      {/* Prize Info */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { rank: '1st', prize: 'Grand Prize', emoji: '🥇', color: 'from-yellow-600/20 to-orange-600/20 border-yellow-500/30' },
          { rank: '2nd', prize: 'Runner Up', emoji: '🥈', color: 'from-gray-600/20 to-slate-600/20 border-gray-400/30' },
          { rank: '3rd', prize: '3rd Place', emoji: '🥉', color: 'from-orange-800/20 to-amber-800/20 border-orange-700/30' },
        ].map(p => (
          <div key={p.rank} className={`bg-gradient-to-br ${p.color} border rounded-2xl p-4 text-center`}>
            <div className="text-3xl mb-1">{p.emoji}</div>
            <div className="text-white font-bold text-sm">{p.rank}</div>
            <div className="text-white/40 text-xs">{p.prize}</div>
          </div>
        ))}
      </div>

      {/* Top 3 highlight */}
      {leaderboard.length >= 3 && (
        <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/20 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-bold mb-4 text-sm">🔥 This Week&apos;s Leaders</h2>
          <div className="flex items-end justify-center gap-4">
            {/* 2nd */}
            <div className="text-center flex-1">
              <div className="text-3xl mb-1">🥈</div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-400 to-slate-400 flex items-center justify-center text-white font-bold mx-auto mb-1">
                {leaderboard[1].username[0]?.toUpperCase()}
              </div>
              <div className="text-white text-xs font-semibold truncate">@{leaderboard[1].username}</div>
              <div className="text-gray-300 font-black text-xl">{leaderboard[1].weekly_points}</div>
              <div className="text-white/30 text-xs">pts</div>
              <div className="bg-gray-500/20 h-16 rounded-t-xl mt-2" />
            </div>
            {/* 1st */}
            <div className="text-center flex-1">
              <div className="text-4xl mb-1">👑</div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center text-white font-bold mx-auto mb-1 text-lg">
                {leaderboard[0].username[0]?.toUpperCase()}
              </div>
              <div className="text-white text-sm font-bold truncate">@{leaderboard[0].username}</div>
              <div className="text-yellow-400 font-black text-2xl">{leaderboard[0].weekly_points}</div>
              <div className="text-white/30 text-xs">pts</div>
              <div className="bg-yellow-500/20 h-24 rounded-t-xl mt-2" />
            </div>
            {/* 3rd */}
            <div className="text-center flex-1">
              <div className="text-3xl mb-1">🥉</div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-700 to-amber-700 flex items-center justify-center text-white font-bold mx-auto mb-1">
                {leaderboard[2].username[0]?.toUpperCase()}
              </div>
              <div className="text-white text-xs font-semibold truncate">@{leaderboard[2].username}</div>
              <div className="text-orange-400 font-black text-xl">{leaderboard[2].weekly_points}</div>
              <div className="text-white/30 text-xs">pts</div>
              <div className="bg-orange-700/20 h-10 rounded-t-xl mt-2" />
            </div>
          </div>
        </div>
      )}

      {/* Full leaderboard */}
      <div className="space-y-2">
        <h2 className="text-white font-bold mb-3">Full Rankings</h2>
        {leaderboard.length === 0 && (
          <div className="text-center py-16 bg-[#111111] rounded-2xl border border-white/5">
            <p className="text-4xl mb-3">🏆</p>
            <p className="text-white/50 font-semibold mb-2">No competitors yet this week</p>
            <p className="text-white/30 text-sm">Play games and enter competitions to earn points</p>
            <a href="/games" className="inline-block mt-4 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl text-sm">
              Start Competing
            </a>
          </div>
        )}
        {leaderboard.map((player, i) => (
          <LeaderboardRow
            key={player.id}
            rank={i + 1}
            username={player.username}
            points={player.weekly_points}
            avatar_url={player.avatar_url}
          />
        ))}
      </div>

      {/* How to earn points */}
      <div className="mt-8 bg-[#111111] border border-white/5 rounded-2xl p-6">
        <h3 className="text-white font-bold mb-4">How to Earn Points</h3>
        <div className="space-y-2">
          {[
            { action: 'Win any mini-game', points: '+1 pt' },
            { action: 'Play 8 different games in a day', points: '+2 pts' },
            { action: 'Win Video Vote', points: '+2 pts' },
            { action: 'Win Funniest Post', points: '+2 pts' },
            { action: 'Win Caption This', points: '+2 pts' },
            { action: 'Win Hot Takes', points: '+2 pts' },
            { action: 'Win Daily Prediction', points: '+2 pts' },
          ].map(item => (
            <div key={item.action} className="flex justify-between items-center text-sm">
              <span className="text-white/60">{item.action}</span>
              <span className="text-purple-400 font-bold">{item.points}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
