'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const mobileItems = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/search', label: 'Search', icon: '🔍' },
  { href: '/upload', label: 'Upload', icon: '⬆️' },
  { href: '/messages', label: 'DMs', icon: '💬' },
  { href: '/dashboard', label: 'Me', icon: '👤' },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#111111] border-t border-white/10">
      <div className="flex items-center justify-around px-2 py-2 safe-area-bottom">
        {mobileItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[60px] ${
                active ? 'text-white' : 'text-white/40'
              }`}
            >
              {item.href === '/upload' ? (
                <span className={`text-2xl flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 -mt-6 shadow-lg shadow-purple-500/30 ${active ? 'scale-110' : ''} transition-transform`}>
                  {item.icon}
                </span>
              ) : (
                <span className={`text-xl transition-transform ${active ? 'scale-110' : ''}`}>{item.icon}</span>
              )}
              <span className={`text-xs font-medium ${active ? 'text-purple-400' : ''} ${item.href === '/upload' ? 'mt-1' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
