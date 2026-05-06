'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import VideoCard from '@/components/VideoCard';

interface VideoResult {
  id: number;
  title: string;
  description: string | null;
  username: string;
  likes: number;
  views: number;
  thumbnail_url: string | null;
  created_at: string;
}

interface UserResult {
  id: number;
  username: string;
  verified: number;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState<VideoResult[]>([]);
  const [users, setUsers] = useState<UserResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) { setVideos([]); setUsers([]); return; }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json() as { videos: VideoResult[]; users: UserResult[] };
        setVideos(data.videos);
        setUsers(data.users);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black text-white mb-6">Search</h1>

      <div className="relative mb-8">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search videos, creators, hashtags..."
          className="w-full bg-white/10 border border-white/15 text-white placeholder-white/30 rounded-2xl pl-12 pr-4 py-3.5 text-sm outline-none focus:border-purple-500/60 transition-colors"
          autoFocus
        />
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {users.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Creators</h2>
          <div className="space-y-2">
            {users.map(u => (
              <Link key={u.id} href={`/profile/${u.username}`} className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-black text-white shrink-0">
                  {u.username[0]?.toUpperCase()}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-white font-semibold text-sm">@{u.username}</span>
                  {u.verified === 1 && <span className="text-blue-400 text-xs">✓</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {videos.length > 0 && (
        <div>
          <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Videos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {videos.map(v => (
              <VideoCard
                key={v.id}
                id={v.id}
                title={v.title}
                description={v.description ?? undefined}
                username={v.username}
                likes={v.likes}
                views={v.views}
                thumbnail_url={v.thumbnail_url}
                created_at={v.created_at}
              />
            ))}
          </div>
        </div>
      )}

      {query && !loading && videos.length === 0 && users.length === 0 && (
        <div className="text-center py-16 text-white/30">No results for &ldquo;{query}&rdquo;</div>
      )}

      {!query && (
        <div className="text-center py-16 text-white/30">Start typing to search</div>
      )}
    </div>
  );
}
