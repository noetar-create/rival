'use client';

export interface Promo {
  name: string;
  url: string;
  hook: string;
  tagline: string;
  gradient: string;
  cta: string;
}

export const PROMOS: Promo[] = [
  { name: 'Wordlio', url: 'https://wordlio.fun', hook: '4 daily puzzles. One global leaderboard.', tagline: 'Word · Number · Quiz · Speed', gradient: 'from-[#1a2e1a] via-[#0a1a0a] to-[#0d2d1a]', cta: 'Play Free Today' },
  { name: 'TypeBlitz', url: 'https://typeblitz.io', hook: 'How fast can you type?', tagline: 'Challenge your country. Beat the world.', gradient: 'from-[#0a1a2e] via-[#0a0a1a] to-[#0a2030]', cta: 'Test Your Speed' },
  { name: 'Sudokuzio', url: 'https://sudokuzio.io', hook: 'Build your daily Sudoku streak.', tagline: '5 difficulties · Fresh every day', gradient: 'from-[#1a0a2e] via-[#0a0a1a] to-[#200a2d]', cta: 'Start Streak' },
  { name: 'Blitzzio', url: 'https://blitzzio.xyz', hook: 'Chess. Country vs Country. Live.', tagline: 'Pick your nation. Play for glory.', gradient: 'from-[#1a1200] via-[#0a0a00] to-[#1a0e00]', cta: 'Play for Your Country' },
  { name: 'Promptzio', url: 'https://promptzio.com', hook: '150+ AI prompts that actually work.', tagline: 'Copy · Paste · Get results instantly', gradient: 'from-[#2d0a2d] via-[#1a0a1a] to-[#2d0a1a]', cta: 'Browse Free' },
  { name: 'Lifezio', url: 'https://lifezio.app', hook: 'Run your household like a command center.', tagline: 'Tasks · Calendar · Budget · Care', gradient: 'from-[#0a2d1a] via-[#0a1a0a] to-[#002d20]', cta: 'Try Free' },
];

// ── Visual previews ──────────────────────────────────────

function WordlioPreview() {
  const rows = [
    [{ l: 'C', c: 'gray' }, { l: 'R', c: 'gray' }, { l: 'A', c: 'yellow' }, { l: 'N', c: 'gray' }, { l: 'E', c: 'gray' }],
    [{ l: 'F', c: 'gray' }, { l: 'L', c: 'gray' }, { l: 'O', c: 'green' }, { l: 'A', c: 'yellow' }, { l: 'T', c: 'gray' }],
    [{ l: 'W', c: 'green' }, { l: 'O', c: 'green' }, { l: 'R', c: 'green' }, { l: 'L', c: 'green' }, { l: 'D', c: 'green' }],
  ];
  const bg: Record<string, string> = { green: 'bg-green-600', yellow: 'bg-yellow-500', gray: 'bg-[#3a3a3c]' };
  return (
    <div className="flex flex-col gap-1.5">
      {rows.map((row, r) => (
        <div key={r} className="flex gap-1.5 justify-center">
          {row.map((cell, c) => (
            <div key={c} className={`w-11 h-11 ${bg[cell.c]} rounded flex items-center justify-center text-white font-black text-base`}>{cell.l}</div>
          ))}
        </div>
      ))}
      {[0, 1, 2].map(r => (
        <div key={r} className="flex gap-1.5 justify-center">
          {[0, 1, 2, 3, 4].map(c => <div key={c} className="w-11 h-11 border border-white/15 rounded" />)}
        </div>
      ))}
    </div>
  );
}

function TypeBlitzPreview() {
  return (
    <div className="w-full max-w-xs bg-white/5 border border-white/15 rounded-2xl p-4 space-y-3">
      <div className="flex gap-4 justify-center">
        {[{ v: '94', l: 'WPM' }, { v: '98%', l: 'Accuracy' }, { v: '0:42', l: 'Time' }].map(s => (
          <div key={s.l} className="text-center">
            <div className="text-white font-black text-xl">{s.v}</div>
            <div className="text-white/40 text-[10px]">{s.l}</div>
          </div>
        ))}
      </div>
      <div className="bg-white/5 rounded-xl p-3 text-xs font-mono leading-relaxed">
        <span className="text-white/80">The quick brown fox jumps</span>
        <span className="text-white/80"> over the lazy</span>
        <span className="bg-blue-500 text-white px-0.5 rounded">d</span>
        <span className="text-white/30">og and the fence</span>
      </div>
      <div className="flex justify-center gap-2">
        {['🇺🇸', '🇬🇧', '🇨🇦', '🇦🇺', '🇿🇦'].map(f => <span key={f} className="text-lg">{f}</span>)}
      </div>
    </div>
  );
}

function SudokuzioPreview() {
  const grid = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ];
  const solved = [
    [0, 0, 4, 6, 0, 8, 9, 1, 2],
    [0, 7, 2, 0, 0, 0, 3, 4, 8],
    [1, 0, 0, 3, 4, 2, 5, 0, 7],
    [0, 5, 9, 7, 0, 1, 4, 2, 0],
    [0, 2, 6, 0, 5, 0, 7, 9, 0],
    [0, 1, 3, 9, 0, 4, 8, 5, 0],
    [9, 0, 1, 5, 3, 7, 0, 0, 4],
    [2, 8, 7, 0, 0, 0, 6, 3, 0],
    [3, 4, 5, 2, 0, 6, 1, 0, 0],
  ];
  return (
    <div className="border border-white/20 rounded overflow-hidden" style={{ width: 216, height: 216 }}>
      <div className="grid grid-cols-9 w-full h-full">
        {grid.map((row, r) => row.map((cell, c) => {
          const borderR = (r + 1) % 3 === 0 && r < 8 ? 'border-b border-b-white/40' : 'border-b border-b-white/10';
          const borderC = (c + 1) % 3 === 0 && c < 8 ? 'border-r border-r-white/40' : 'border-r border-r-white/10';
          const isGiven = cell !== 0;
          const val = isGiven ? cell : solved[r][c];
          return (
            <div key={`${r}-${c}`} className={`flex items-center justify-center ${borderR} ${borderC} ${isGiven ? 'bg-white/5 text-white font-black' : 'bg-transparent text-blue-400 font-semibold'}`} style={{ fontSize: 10 }}>
              {val || ''}
            </div>
          );
        }))}
      </div>
    </div>
  );
}

function BlitzzioPreview() {
  const board = [
    ['♜','♞','♝','♛','♚','♝','♞','♜'],
    ['♟','♟','♟','♟','♟','♟','♟','♟'],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['♙','♙','♙','♙','♙','♙','♙','♙'],
    ['♖','♘','♗','♕','♔','♗','♘','♖'],
  ];
  return (
    <div className="rounded overflow-hidden border border-amber-700/50" style={{ width: 216, height: 216 }}>
      <div className="grid grid-cols-8 w-full h-full">
        {board.map((row, r) => row.map((piece, c) => {
          const light = (r + c) % 2 === 0;
          return (
            <div key={`${r}-${c}`} className={`flex items-center justify-center ${light ? 'bg-amber-100' : 'bg-amber-800'}`} style={{ fontSize: 14 }}>
              <span className={r < 2 ? 'text-gray-900' : 'text-gray-100'} style={{ textShadow: r < 2 ? 'none' : '0 1px 2px rgba(0,0,0,0.8)' }}>{piece}</span>
            </div>
          );
        }))}
      </div>
    </div>
  );
}

function PromptzioPReview() {
  const prompts = [
    'Write a viral TikTok script about psychology...',
    'Create a cold email that gets 40% open rate...',
    'Generate 10 YouTube titles that get clicks...',
  ];
  return (
    <div className="w-full max-w-xs space-y-2">
      {prompts.map((p, i) => (
        <div key={i} className="bg-white/8 border border-white/10 rounded-xl px-3 py-2.5 flex items-center justify-between gap-2">
          <p className="text-white/80 text-[11px] leading-snug flex-1">{p}</p>
          <div className="shrink-0 bg-pink-500/30 border border-pink-500/40 rounded-lg px-2 py-1 text-pink-300 text-[10px] font-bold">Copy</div>
        </div>
      ))}
    </div>
  );
}

function LifezioPreview() {
  const tasks = [
    { done: true, label: 'Pay electricity bill' },
    { done: true, label: 'Schedule dentist appt' },
    { done: false, label: 'Buy groceries' },
    { done: false, label: 'Call mom back' },
  ];
  return (
    <div className="w-full max-w-xs bg-white/5 border border-white/15 rounded-2xl p-4 space-y-2.5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-white font-bold text-sm">Today's Tasks</span>
        <span className="text-teal-400 text-xs font-semibold">2/4 done</span>
      </div>
      {tasks.map((t, i) => (
        <div key={i} className="flex items-center gap-2.5">
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${t.done ? 'bg-teal-500 border-teal-500' : 'border-white/30'}`}>
            {t.done && <span className="text-white text-[10px]">✓</span>}
          </div>
          <span className={`text-sm ${t.done ? 'line-through text-white/40' : 'text-white/80'}`}>{t.label}</span>
        </div>
      ))}
    </div>
  );
}

const PREVIEWS: Record<string, React.ReactNode> = {
  Wordlio: <WordlioPreview />,
  TypeBlitz: <TypeBlitzPreview />,
  Sudokuzio: <SudokuzioPreview />,
  Blitzzio: <BlitzzioPreview />,
  Promptzio: <PromptzioPReview />,
  Lifezio: <LifezioPreview />,
};

// ── Main component ───────────────────────────────────────

interface PromoSlideProps {
  promo: Promo;
}

export default function PromoSlide({ promo }: PromoSlideProps) {
  const displayUrl = promo.url.replace('https://', '');
  const preview = PREVIEWS[promo.name];

  return (
    <div className="relative w-full h-screen snap-start snap-always flex-shrink-0 bg-black flex items-center justify-center overflow-hidden">
      <div className="relative h-full w-full max-w-[430px] overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${promo.gradient}`} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.04)_0%,_transparent_60%)]" />

        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 gap-4">
          {/* Network badge */}
          <div className="flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full px-3 py-1">
            <span className="text-white/70 text-[10px] font-black tracking-widest uppercase">From the Rival Network</span>
          </div>

          {/* Game preview */}
          <div className="flex items-center justify-center">
            {preview}
          </div>

          {/* Brand + copy */}
          <div className="text-center space-y-1">
            <h2 className="text-3xl font-black text-white tracking-tight">{promo.name}</h2>
            <p className="text-white font-semibold text-base leading-snug">{promo.hook}</p>
            <p className="text-white/50 text-xs">{promo.tagline}</p>
          </div>

          {/* CTA */}
          <a
            href={promo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-gray-900 font-black text-sm px-7 py-3.5 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-transform duration-200"
          >
            {promo.cta} →
          </a>

          <p className="text-white/25 text-xs">{displayUrl}</p>
        </div>
      </div>
    </div>
  );
}
