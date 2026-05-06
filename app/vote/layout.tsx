import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daily Video Vote — Compete & Win | Rival',
  description: 'Post your video and let the Rival community vote. Daily winner earns +2 bonus points toward the weekly prize leaderboard.',
  openGraph: {
    title: 'Daily Video Vote | Rival',
    description: 'Post a video, get votes, win bonus points daily on Rival.',
    url: 'https://rivalapp.io/vote',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Rival Video Vote' }],
  },
  twitter: { card: 'summary_large_image', title: 'Daily Video Vote | Rival', description: 'Post a video and win daily on Rival.' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
