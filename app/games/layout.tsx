import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daily Games — Earn Points & Win | Rival',
  description: 'Play 7 daily mini-games on Rival — typing speed, trivia, reaction time, memory, chess puzzles, emoji decode, and spot the difference. Win points toward the weekly prize.',
  keywords: ['daily games', 'mini games', 'typing speed game', 'trivia game', 'reaction time', 'competitive games', 'win prizes'],
  openGraph: {
    title: 'Daily Games — Earn Points & Win | Rival',
    description: 'Play 7 daily mini-games. Win points. Climb the weekly leaderboard.',
    url: 'https://rivalapp.io/games',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Rival Daily Games' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daily Games on Rival',
    description: 'Play 7 daily mini-games and win prizes every week.',
  },
};

export default function GamesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
