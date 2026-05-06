import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Caption This — Daily Caption Contest | Rival',
  description: 'Write the funniest caption for today\'s image on Rival. The community votes and the winner earns +2 bonus points toward the weekly prize.',
  openGraph: {
    title: 'Caption This | Rival',
    description: 'Write the best caption. Win daily bonus points on Rival.',
    url: 'https://rivalapp.io/caption',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Rival Caption Contest' }],
  },
  twitter: { card: 'summary_large_image', title: 'Caption Contest | Rival', description: 'Caption the image and win daily.' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
