import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hot Takes — Daily Opinion Battle | Rival',
  description: 'Drop your hottest take of the day on Rival. The community votes on the boldest opinion. Daily winner earns +2 bonus points toward the weekly prize.',
  openGraph: {
    title: 'Hot Takes | Rival',
    description: 'Post your boldest opinion. Win daily bonus points on Rival.',
    url: 'https://rivalapp.io/hottakes',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Rival Hot Takes' }],
  },
  twitter: { card: 'summary_large_image', title: 'Hot Takes | Rival', description: 'Post your hottest take and win.' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
