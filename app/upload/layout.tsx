import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Upload a Video | Rival',
  description: 'Upload your video to Rival and compete in the daily video vote. Win bonus points and build your presence on the most competitive social platform.',
  openGraph: {
    title: 'Upload a Video | Rival',
    description: 'Upload your video and compete for daily votes and weekly prizes.',
    url: 'https://rivalapp.io/upload',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Upload to Rival' }],
  },
  twitter: { card: 'summary_large_image', title: 'Upload to Rival', description: 'Upload and compete for weekly prizes.' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
