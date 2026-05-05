interface LeaderboardRowProps {
  rank: number;
  username: string;
  points: number;
  avatar_url?: string | null;
}

const rankStyles: Record<number, string> = {
  1: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30',
  2: 'bg-gradient-to-r from-gray-400/20 to-slate-400/20 border-gray-400/30',
  3: 'bg-gradient-to-r from-orange-700/20 to-amber-700/20 border-orange-700/30',
};

const rankEmoji: Record<number, string> = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

export default function LeaderboardRow({ rank, username, points, avatar_url }: LeaderboardRowProps) {
  const isTop3 = rank <= 3;

  return (
    <div
      className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-all duration-200 hover:scale-[1.01] ${
        isTop3
          ? rankStyles[rank]
          : 'bg-white/3 border-white/5 hover:border-white/10'
      }`}
    >
      {/* Rank */}
      <div className="w-8 text-center">
        {isTop3 ? (
          <span className="text-xl">{rankEmoji[rank]}</span>
        ) : (
          <span className="text-white/40 font-bold text-sm">#{rank}</span>
        )}
      </div>

      {/* Avatar */}
      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
        isTop3
          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
          : 'bg-white/10 text-white/70'
      }`}>
        {avatar_url ? (
          <img src={avatar_url} alt={username} className="w-full h-full rounded-full object-cover" />
        ) : (
          username[0]?.toUpperCase()
        )}
      </div>

      {/* Username */}
      <div className="flex-1 min-w-0">
        <p className={`font-semibold truncate ${isTop3 ? 'text-white' : 'text-white/80'}`}>
          @{username}
        </p>
      </div>

      {/* Points */}
      <div className="flex items-center gap-1.5">
        <span className={`text-lg font-black ${
          rank === 1 ? 'text-yellow-400' :
          rank === 2 ? 'text-gray-300' :
          rank === 3 ? 'text-orange-400' :
          'text-purple-400'
        }`}>
          {points}
        </span>
        <span className="text-white/30 text-xs">pts</span>
      </div>
    </div>
  );
}
