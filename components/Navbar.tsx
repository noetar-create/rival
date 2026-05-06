'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NotificationBell from './NotificationBell';

const navItems = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/games', label: 'Games', icon: '🎮' },
  { href: '/vote', label: 'Video Vote', icon: '🎬' },
  { href: '/funniest', label: 'Funniest', icon: '😂' },
  { href: '/caption', label: 'Caption', icon: '💬' },
  { href: '/hottakes', label: 'Hot Takes', icon: '🔥' },
  { href: '/predict', label: 'Predict', icon: '🔮' },
  { href: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  { href: '/upload', label: 'Upload', icon: '⬆️' },
  { href: '/blog', label: 'Blog', icon: '📝' },
  { href: '/rules', label: 'Rules', icon: '📋' },
  { href: '/search', label: 'Search', icon: '🔍' },
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/saved', label: 'Saved', icon: '🔖' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-[#111111] border-r border-white/5 z-40">
      {/* Logo */}
      <div className="p-6 pb-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
            RIVAL
          </span>
          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-semibold">BETA</span>
        </Link>
        <NotificationBell />
      </div>
      <p className="text-xs text-white/40 px-6 -mt-2 mb-2">Compete. Win. Repeat.</p>

      {/* Nav */}
      <nav className="flex-1 px-3 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  active
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-400" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom auth links */}
      <div className="p-4 border-t border-white/5 space-y-1">
        <Link href="/signup" className="block w-full text-center py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-sm font-semibold rounded-xl transition-all duration-200">
          Sign Up Free
        </Link>
        <Link href="/login" className="block w-full text-center py-2 px-4 text-white/60 hover:text-white text-sm transition-colors duration-200">
          Log In
        </Link>
        <div className="flex justify-center gap-3 pt-2">
          <Link href="/about" className="text-white/30 hover:text-white/60 text-xs transition-colors">About</Link>
          <Link href="/privacy" className="text-white/30 hover:text-white/60 text-xs transition-colors">Privacy</Link>
          <Link href="/terms" className="text-white/30 hover:text-white/60 text-xs transition-colors">Terms</Link>
        </div>
      </div>
    </aside>
  );
}
