'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'rival_welcomed';

const slides = [
  {
    emoji: '🏆',
    title: 'Welcome to Rival',
    body: (
      <>
        <p className="text-white/70 text-base leading-relaxed">
          Rival is the <span className="text-purple-400 font-semibold">competitive social platform</span> built for people who play to win.
        </p>
        <ul className="mt-4 space-y-2 text-sm text-white/60">
          {[
            '🎬 Watch and post short videos',
            '🎮 Play 8 daily mini-games to earn points',
            '🔥 Enter competitions and get voted on',
            '⬇️ Download any video on the platform',
            '🏅 Climb the leaderboard, win weekly prizes',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span>{item.slice(0, 2)}</span>
              <span>{item.slice(2)}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    emoji: '⚡',
    title: 'How to Compete',
    body: (
      <>
        <p className="text-white/70 text-base leading-relaxed mb-4">
          Every action earns you <span className="text-pink-400 font-semibold">Rival Points</span>. Stack them all week.
        </p>
        <div className="space-y-3">
          {[
            { pts: '+1 pt', label: 'Win any game', color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30' },
            { pts: '+2 pts', label: 'Play 8 different games in one day', color: 'from-pink-500/20 to-pink-600/10 border-pink-500/30' },
            { pts: '+2 pts', label: 'Win a daily competition', color: 'from-orange-500/20 to-orange-600/10 border-orange-500/30' },
            { pts: '+5 pts', label: 'Refer a friend who signs up', color: 'from-green-500/20 to-green-600/10 border-green-500/30' },
          ].map((row) => (
            <div key={row.label} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r ${row.color} border`}>
              <span className="text-white font-black text-lg min-w-[60px]">{row.pts}</span>
              <span className="text-white/70 text-sm">{row.label}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    emoji: '🎁',
    title: 'Win Every Week',
    body: (
      <>
        <p className="text-white/70 text-base leading-relaxed mb-4">
          The leaderboard resets every <span className="text-purple-400 font-semibold">Monday</span>. The top 3 players earn prizes and the coveted Rival{' '}
          <span className="text-blue-400 font-semibold">Verified ✓</span> badge.
        </p>
        <div className="space-y-2 mb-5">
          {[
            { rank: '🥇 1st Place', prize: 'Cash prize + Verified badge' },
            { rank: '🥈 2nd Place', prize: 'Gift card + Verified badge' },
            { rank: '🥉 3rd Place', prize: 'Rival merch + Verified badge' },
          ].map((row) => (
            <div key={row.rank} className="flex items-center justify-between px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-white font-semibold text-sm">{row.rank}</span>
              <span className="text-white/50 text-xs">{row.prize}</span>
            </div>
          ))}
        </div>
        <p className="text-white/40 text-xs">Winners are contacted via the email used at signup. Must have posted at least 1 video to be eligible.</p>
      </>
    ),
  },
];

export default function WelcomeModal() {
  const [visible, setVisible] = useState(false);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const welcomed = localStorage.getItem(STORAGE_KEY);
      if (!welcomed) {
        setVisible(true);
      }
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  if (!visible) return null;

  const current = slides[slide];
  const isLast = slide === slides.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={dismiss}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#111111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-purple-900/30">
        {/* Gradient top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400" />

        <div className="p-8">
          {/* Emoji */}
          <div className="flex justify-center mb-5">
            <span className="text-5xl">{current.emoji}</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-black text-white text-center mb-5 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {current.title}
          </h2>

          {/* Content */}
          <div className="min-h-[200px]">
            {current.body}
          </div>

          {/* Slide dots */}
          <div className="flex justify-center gap-2 my-6">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === slide
                    ? 'w-8 bg-gradient-to-r from-purple-400 to-pink-400'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {isLast ? (
              <>
                <Link
                  href="/rules"
                  onClick={dismiss}
                  className="flex-1 py-3 px-4 text-center rounded-xl border border-purple-500/40 text-purple-300 hover:bg-purple-500/10 text-sm font-semibold transition-all duration-200"
                >
                  View Rules
                </Link>
                <button
                  onClick={dismiss}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm transition-all duration-200 shadow-lg shadow-purple-900/40"
                >
                  Start Watching →
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={dismiss}
                  className="flex-1 py-3 px-4 text-center rounded-xl border border-white/10 text-white/40 hover:text-white/60 text-sm font-medium transition-all duration-200"
                >
                  Skip
                </button>
                <button
                  onClick={() => setSlide((s) => Math.min(s + 1, slides.length - 1))}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm transition-all duration-200 shadow-lg shadow-purple-900/40"
                >
                  Next →
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
