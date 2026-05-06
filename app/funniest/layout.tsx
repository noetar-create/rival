import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Funniest Post Contest — Daily Competition | Rival',
  description: 'Submit the funniest post of the day on Rival. Community votes pick the winner who earns +2 bonus points toward the weekly leaderboard prize.',
  openGraph: {
    title: 'Funniest Post Contest | Rival',
    description: 'Make the community laugh. Win daily bonus points on Rival.',
    url: 'https://rivalapp.io/funniest',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Rival Funniest Post' }],
  },
  twitter: { card: 'summary_large_image', title: 'Funniest Post | Rival', description: 'Submit the funniest post and win daily.' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
