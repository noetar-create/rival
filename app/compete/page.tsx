import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Compete on Rival — Games & Daily Competitions',
  description: 'Every day on Rival you have 12 ways to win points — 7 mini-games and 5 creative competitions. Top of the weekly leaderboard wins a prize.',
};

const GAMES = [
  {
    icon: '⌨️',
    title: 'Typing Speed',
    href: '/games',
    gradient: 'from-purple-500 to-indigo-500',
    description: '30 seconds. Type as many words as you can. 30+ WPM earns a point.',
    points: '+1 pt',
  },
  {
    icon: '🧠',
    title: 'Trivia Blitz',
    href: '/games',
    gradient: 'from-pink-500 to-rose-500',
    description: '10 multiple-choice questions in 60 seconds. Answer 6+ correctly.',
    points: '+1 pt',
  },
  {
    icon: '⚡',
    title: 'Reaction Time',
    href: '/games',
    gradient: 'from-green-500 to-emerald-500',
    description: 'Click when the box turns green. 3 attempts. Average under 350ms wins.',
    points: '+1 pt',
  },
  {
    icon: '🎯',
    title: 'Memory Flash',
    href: '/games',
    gradient: 'from-orange-500 to-amber-500',
    description: '9 items shown for 3 seconds. Remember and select 5+ from the grid.',
    points: '+1 pt',
  },
  {
    icon: '🤔',
    title: 'Emoji Decode',
    href: '/games',
    gradient: 'from-yellow-500 to-orange-500',
    description: 'Guess the movie or phrase from emoji clues. Decode 5+ to win.',
    points: '+1 pt',
  },
  {
    icon: '🔍',
    title: 'Spot the Difference',
    href: '/games',
    gradient: 'from-teal-500 to-cyan-500',
    description: 'Compare two images and find the differences. Spot 3+ in 60 seconds.',
    points: '+1 pt',
  },
  {
    icon: '♟️',
    title: 'Chess Puzzle',
    href: '/games',
    gradient: 'from-slate-500 to-gray-600',
    description: 'Find checkmate in one move. A classic test of tactical thinking.',
    points: '+1 pt',
  },
];

const COMPETITIONS = [
  {
    icon: '🎬',
    title: 'Video Vote',
    href: '/vote',
    gradient: 'from-purple-600 to-pink-600',
    description: 'Post a short video and the community votes on the best one. Winner gets bonus points.',
    points: '+2 pts',
  },
  {
    icon: '😂',
    title: 'Funniest Post',
    href: '/funniest',
    gradient: 'from-yellow-500 to-orange-500',
    description: 'Submit the funniest thing you\'ve seen today. Community upvotes decide the winner.',
    points: '+2 pts',
  },
  {
    icon: '💬',
    title: 'Caption Contest',
    href: '/caption',
    gradient: 'from-blue-500 to-cyan-500',
    description: 'Write the best caption for a daily image. Wittiest caption wins points.',
    points: '+2 pts',
  },
  {
    icon: '🔥',
    title: 'Hot Takes',
    href: '/hottakes',
    gradient: 'from-red-500 to-orange-500',
    description: 'Drop your most controversial opinion. The community rates how hot your take is.',
    points: '+2 pts',
  },
  {
    icon: '🔮',
    title: 'Predict',
    href: '/predict',
    gradient: 'from-violet-500 to-purple-600',
    description: 'Make daily predictions about anything. Correct predictions earn bonus points.',
    points: '+2 pts',
  },
];

const HOW_IT_WORKS = [
  { step: '1', text: 'Play any of the 7 daily games to earn +1 point each' },
  { step: '2', text: 'Enter creative competitions for +2 bonus points each' },
  { step: '3', text: 'Post videos to the feed — reactions and engagement boost your score' },
  { step: '4', text: 'Play all 7 games in one day to unlock the all-games bonus (+2 pts)' },
  { step: '5', text: 'Leaderboard resets every Monday. Top player wins the weekly prize' },
];

export default function CompetePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          🏆 12 WAYS TO WIN EVERY DAY
        </div>
        <h1 className="text-3xl font-black text-white mb-3">The Rival Network</h1>
        <p className="text-white/50 max-w-xl">
          Every day there are 7 mini-games and 5 community competitions. Win points in any of them. Top of the leaderboard every week wins a prize.
        </p>
      </div>

      {/* How it works */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10">
        <h2 className="text-white font-bold mb-4">How points work</h2>
        <div className="space-y-3">
          {HOW_IT_WORKS.map(h => (
            <div key={h.step} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-black shrink-0 mt-0.5">
                {h.step}
              </div>
              <p className="text-white/60 text-sm leading-relaxed">{h.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex gap-3 flex-wrap">
          <Link href="/games" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-xl hover:opacity-90 transition-opacity">
            Play Games Now →
          </Link>
          <Link href="/leaderboard" className="px-4 py-2 bg-white/10 text-white text-sm font-semibold rounded-xl hover:bg-white/15 transition-colors border border-white/10">
            View Leaderboard
          </Link>
        </div>
      </div>

      {/* Daily Games */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-lg">Daily Mini-Games</h2>
          <span className="text-white/40 text-sm">7 games · +1 pt each</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {GAMES.map(g => (
            <Link
              key={g.title}
              href={g.href}
              className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-4 py-4 hover:bg-white/8 hover:border-white/20 transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${g.gradient} flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform`}>
                {g.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white font-semibold text-sm">{g.title}</p>
                  <span className="text-green-400 text-xs font-bold bg-green-400/10 px-1.5 py-0.5 rounded-full shrink-0">{g.points}</span>
                </div>
                <p className="text-white/40 text-xs mt-0.5 leading-relaxed">{g.description}</p>
              </div>
            </Link>
          ))}
        </div>
        <p className="text-purple-400 text-xs mt-3 text-center">Complete all 7 in one day → unlock +2 all-games bonus</p>
      </div>

      {/* Daily Competitions */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-lg">Daily Competitions</h2>
          <span className="text-white/40 text-sm">5 contests · +2 pts each</span>
        </div>
        <div className="space-y-3">
          {COMPETITIONS.map(c => (
            <Link
              key={c.title}
              href={c.href}
              className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 hover:bg-white/8 hover:border-white/20 transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform`}>
                {c.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-white font-semibold text-sm">{c.title}</p>
                  <span className="text-purple-300 text-xs font-bold bg-purple-400/10 px-1.5 py-0.5 rounded-full shrink-0">{c.points}</span>
                </div>
                <p className="text-white/40 text-xs leading-relaxed">{c.description}</p>
              </div>
              <svg className="w-4 h-4 text-white/30 group-hover:text-white/60 shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* Trust footer */}
      <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/20 rounded-2xl p-6 text-center">
        <div className="text-3xl mb-3">🏆</div>
        <h3 className="text-white font-bold mb-2">Weekly Prize, Every Week</h3>
        <p className="text-white/50 text-sm max-w-sm mx-auto mb-4">
          The leaderboard resets every Monday. The player with the most points at the end of the week wins. No tricks, no algorithms — just points earned by showing up and competing.
        </p>
        <Link href="/rules" className="text-purple-400 hover:text-purple-300 text-sm font-semibold">
          Read the full rules →
        </Link>
      </div>
    </div>
  );
}
