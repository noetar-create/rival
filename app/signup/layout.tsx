import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join Rival Free — Start Competing Today',
  description: 'Create your free Rival account and start competing in daily games, video votes, caption contests, and more. Win real prizes every week.',
  openGraph: {
    title: 'Join Rival Free',
    description: 'Sign up and compete for weekly prizes on Rival.',
    url: 'https://rivalapp.io/signup',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Join Rival' }],
  },
  twitter: { card: 'summary_large_image', title: 'Join Rival Free', description: 'Sign up and start winning weekly prizes.' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
