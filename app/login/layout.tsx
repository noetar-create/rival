import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Log In to Rival',
  description: 'Log in to your Rival account and get back to competing. Daily games, competitions, and weekly prizes are waiting.',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
