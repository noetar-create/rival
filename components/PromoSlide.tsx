'use client';

export interface Promo {
  name: string;
  url: string;
  icon: string;
  hook: string;
  tagline: string;
  gradient: string;
  cta: string;
}

export const PROMOS: Promo[] = [
  {
    name: 'Wordlio',
    url: 'https://wordlio.fun',
    icon: '🟩',
    hook: '4 daily puzzles. One global leaderboard.',
    tagline: 'Word · Number · Quiz · Speed — fresh every day',
    gradient: 'from-green-700 via-emerald-700 to-teal-700',
    cta: 'Play Free Today',
  },
  {
    name: 'TypeBlitz',
    url: 'https://typeblitz.io',
    icon: '⌨️',
    hook: 'How fast can you type?',
    tagline: 'Challenge your country. Beat the world.',
    gradient: 'from-blue-700 via-cyan-700 to-blue-800',
    cta: 'Test Your Speed',
  },
  {
    name: 'Sudokuzio',
    url: 'https://sudokuzio.io',
    icon: '🔢',
    hook: 'Build your daily Sudoku streak.',
    tagline: '5 difficulties · Daily puzzle · Track your stats',
    gradient: 'from-indigo-700 via-violet-700 to-purple-800',
    cta: 'Start Streak',
  },
  {
    name: 'Blitzzio',
    url: 'https://blitzzio.xyz',
    icon: '♟️',
    hook: 'Chess. Country vs Country. Live.',
    tagline: 'Pick your nation and play for glory',
    gradient: 'from-slate-800 via-gray-800 to-zinc-900',
    cta: 'Play for Your Country',
  },
  {
    name: 'Promptzio',
    url: 'https://promptzio.com',
    icon: '✨',
    hook: '150+ AI prompts that actually work.',
    tagline: 'Copy · Paste · Get results instantly',
    gradient: 'from-pink-700 via-fuchsia-700 to-purple-700',
    cta: 'Browse Free',
  },
  {
    name: 'Lifezio',
    url: 'https://lifezio.app',
    icon: '🏠',
    hook: 'Run your household like a command center.',
    tagline: 'Tasks · Calendar · Budget · Care — all in one',
    gradient: 'from-teal-700 via-emerald-700 to-green-800',
    cta: 'Try Free',
  },
];

interface PromoSlideProps {
  promo: Promo;
}

export default function PromoSlide({ promo }: PromoSlideProps) {
  const displayUrl = promo.url.replace('https://', '');

  return (
    <div className="relative w-full h-screen snap-start snap-always flex-shrink-0 bg-black flex items-center justify-center overflow-hidden">
      <div className="relative h-full w-full max-w-[430px] overflow-hidden">
        {/* Brand gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${promo.gradient}`} />

        {/* Dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.08)_0%,_transparent_70%)]" />

        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center gap-5">
          {/* Network badge */}
          <div className="flex items-center gap-1.5 bg-white/15 border border-white/20 rounded-full px-3 py-1">
            <span className="text-white/80 text-[10px] font-black tracking-widest uppercase">From the Rival Network</span>
          </div>

          {/* Icon */}
          <div className="text-8xl drop-shadow-2xl">{promo.icon}</div>

          {/* Name */}
          <div>
            <h2 className="text-5xl font-black text-white tracking-tight drop-shadow-lg">{promo.name}</h2>
          </div>

          {/* Hook */}
          <p className="text-white font-bold text-xl leading-snug max-w-xs">{promo.hook}</p>

          {/* Tagline */}
          <p className="text-white/60 text-sm">{promo.tagline}</p>

          {/* CTA */}
          <a
            href={promo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 bg-white text-gray-900 font-black text-base px-8 py-4 rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-transform duration-200"
          >
            {promo.cta} →
          </a>

          {/* URL */}
          <p className="text-white/30 text-xs">{displayUrl}</p>
        </div>
      </div>
    </div>
  );
}
