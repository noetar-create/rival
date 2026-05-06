'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface NotificationBellProps {
  className?: string;
}

export default function NotificationBell({ className = '' }: NotificationBellProps) {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await fetch('/api/notifications');
        if (res.ok) {
          const data = await res.json() as { unread: number };
          setUnread(data.unread);
        }
      } catch {}
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Link href="/notifications" className={`relative flex items-center justify-center w-9 h-9 rounded-xl hover:bg-white/5 transition-colors ${className}`}>
      <svg className="w-5 h-5 text-white/60 hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-pink-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center px-1">
          {unread > 99 ? '99+' : unread}
        </span>
      )}
    </Link>
  );
}
