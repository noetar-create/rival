'use client';

import { useState, useEffect } from 'react';
import type { FeedGame } from '@/lib/db';

const CATEGORY_ICONS: Record<string, string> = {
  science: '🔬', history: '📜', geography: '🌍', nature: '🌿',
  space: '🚀', food: '🍕', animals: '🦁', body: '🧠',
  psychology: '💭', finance: '💰', default: '⚡',
};

interface GameSlideProps {
  game: FeedGame;
  isActive: boolean;
}

export default function GameSlide({ game, isActive }: GameSlideProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);

  const options = JSON.parse(game.options) as string[];
  const icon = CATEGORY_ICONS[game.category ?? ''] ?? CATEGORY_ICONS.default;

  useEffect(() => {
    if (!isActive) return;
    setSelected(null);
    setRevealed(false);
    setTimeLeft(15);
  }, [isActive]);

  useEffect(() => {
    if (!isActive || revealed) return;
    if (timeLeft <= 0) { setRevealed(true); return; }
    const t = setTimeout(() => setTimeLeft(n => n - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, isActive, revealed]);

  const handleSelect = (i: number) => {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
  };

  const buttonClass = (i: number) => {
    const base = 'rounded-2xl p-4 text-white text-sm font-bold text-center transition-all duration-300 border';
    if (!revealed) return `${base} bg-white/10 border-white/20 active:scale-95 hover:bg-white/20`;
    if (i === game.correct_index) return `${base} bg-green-500 border-green-400 scale-105`;
    if (i === selected) return `${base} bg-red-500/80 border-red-400`;
    return `${base} bg-white/5 border-white/10 opacity-40`;
  };

  const timerPct = (timeLeft / 15) * 100;

  return (
    <div className="relative w-full h-screen snap-start snap-always flex-shrink-0 bg-black flex items-center justify-center overflow-hidden">
      <div className="relative h-full w-full max-w-[430px] overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a2e] via-[#0a0a1a] to-[#2d0a2d]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-transparent" />

        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 gap-6">
          {/* Badge */}
          <div className="flex items-center gap-2 bg-purple-500/25 border border-purple-500/40 rounded-full px-4 py-1.5">
            <span className="text-base">{icon}</span>
            <span className="text-purple-300 text-xs font-black tracking-widest uppercase">Quick Game</span>
          </div>

          {/* Question */}
          <h2 className="text-white text-xl font-black text-center leading-snug max-w-xs">
            {game.question}
          </h2>

          {/* Timer bar */}
          {!revealed && (
            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${timerPct}%` }}
              />
            </div>
          )}

          {/* Answer grid */}
          <div className="grid grid-cols-2 gap-3 w-full">
            {options.map((opt, i) => (
              <button key={i} onClick={() => handleSelect(i)} className={buttonClass(i)}>
                {opt}
              </button>
            ))}
          </div>

          {/* Result */}
          {revealed ? (
            <div className="text-center space-y-2 px-4">
              <p className="text-white font-black text-xl">
                {selected === game.correct_index ? '🎉 Correct!' : selected === null ? '⏱ Time\'s up!' : '❌ Wrong!'}
              </p>
              {game.fun_fact && (
                <p className="text-white/60 text-sm leading-relaxed">{game.fun_fact}</p>
              )}
              <p className="text-purple-400 text-sm font-bold mt-2">Swipe up for next ↑</p>
            </div>
          ) : (
            <p className="text-white/30 text-xs">{timeLeft}s to answer</p>
          )}
        </div>
      </div>
    </div>
  );
}
