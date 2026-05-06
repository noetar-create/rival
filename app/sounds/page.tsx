'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SoundStat {
  sound: string;
  count: number;
}

function formatNum(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export default function SoundsPage() {
  const [sounds, setSounds] = useState<SoundStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sounds')
      .then(r => r.json())
      .then(d => setSounds(d as SoundStat[]))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-3xl">🎵</span>
        <div>
          <h1 className="text-2xl font-black text-white">Trending Sounds</h1>
          <p className="text-white/40 text-sm">Music and sounds used on Rival</p>
        </div>
      </div>

      {sounds.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <div className="text-4xl mb-3">🎵</div>
          <p>No sounds yet — add one when you upload a video</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sounds.map((s, i) => (
            <Link
              key={s.sound}
              href={`/sound/${encodeURIComponent(s.sound)}`}
              className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 hover:bg-white/8 hover:border-white/20 transition-all group"
            >
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/40 text-xs font-bold shrink-0">
                {i + 1}
              </div>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <span className="text-xl">🎵</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{s.sound}</p>
                <p className="text-white/40 text-xs mt-0.5">{formatNum(s.count)} {s.count === 1 ? 'video' : 'videos'}</p>
              </div>
              <svg className="w-4 h-4 text-white/30 group-hover:text-white/60 shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
