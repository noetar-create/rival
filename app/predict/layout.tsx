import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daily Prediction Contest | Rival',
  description: 'Make your boldest prediction of the day on Rival. Community votes on the most compelling call. Daily winner earns +2 bonus points toward the weekly prize.',
  openGraph: {
    title: 'Daily Prediction | Rival',
    description: 'Make your prediction. Win daily bonus points on Rival.',
    url: 'https://rivalapp.io/predict',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Rival Prediction Contest' }],
  },
  twitter: { card: 'summary_large_image', title: 'Daily Prediction | Rival', description: 'Predict the future. Win daily.' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
