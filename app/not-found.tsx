import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 — Page Not Found | Rival',
  description: 'This page does not exist on Rival. Go back and keep competing.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl font-black gradient-text mb-4">404</div>
      <h1 className="text-3xl font-bold text-white mb-3">Page Not Found</h1>
      <p className="text-white/50 max-w-md mb-8">
        Looks like this page went out of bounds. Head back and keep competing.
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <Link href="/" className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity">
          Go Home
        </Link>
        <Link href="/games" className="px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/15 transition-colors border border-white/10">
          Play Games
        </Link>
      </div>
    </div>
  );
}
