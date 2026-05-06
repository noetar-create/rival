'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface VideoStat {
  id: number;
  title: string;
  views: number;
  likes: number;
  download_count: number;
  created_at: string;
  avg_watch_seconds: number;
  watch_events: number;
  from_feed: number;
  from_direct: number;
  from_profile: number;
  from_search: number;
}

interface AnalyticsData {
  videos: VideoStat[];
  totalViews: number;
  totalLikes: number;
  followerCount: number;
  followingCount: number;
  recentViews: number;
  avgWatchSeconds: number;
  totalWatchEvents: number;
  sources: { feed: number; direct: number; profile: number; search: number };
}

function formatNum(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function formatSeconds(s: number) {
  if (s < 60) return `${Math.round(s)}s`;
  return `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then(r => {
        if (r.status === 401) { window.location.href = '/login'; return null; }
        return r.json();
      })
      .then(d => { if (d) setData(d as AnalyticsData); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!data) return null;

  const stats = [
    { label: 'Total Views', value: formatNum(data.totalViews), icon: '👁' },
    { label: 'Total Likes', value: formatNum(data.totalLikes), icon: '❤️' },
    { label: 'Followers', value: formatNum(data.followerCount), icon: '👥' },
    { label: 'Views this week', value: formatNum(data.recentViews), icon: '📈' },
    { label: 'Avg Watch Time', value: data.avgWatchSeconds > 0 ? formatSeconds(data.avgWatchSeconds) : '—', icon: '⏱' },
    { label: 'Watch Sessions', value: formatNum(data.totalWatchEvents), icon: '▶️' },
  ];

  const totalSourceEvents = data.sources.feed + data.sources.direct + data.sources.profile + data.sources.search;
  const sourceList = [
    { label: 'Feed', value: data.sources.feed, icon: '🏠' },
    { label: 'Direct link', value: data.sources.direct, icon: '🔗' },
    { label: 'Profile', value: data.sources.profile, icon: '👤' },
    { label: 'Search', value: data.sources.search, icon: '🔍' },
  ].filter(s => s.value > 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-3xl">📊</span>
        <div>
          <h1 className="text-2xl font-black text-white">Creator Analytics</h1>
          <p className="text-white/40 text-sm">Your content performance</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-black text-white">{s.value}</div>
            <div className="text-white/40 text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Traffic sources */}
      {totalSourceEvents > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8">
          <h2 className="text-white font-bold text-sm mb-4">Traffic Sources</h2>
          <div className="space-y-3">
            {sourceList.map(s => {
              const pct = totalSourceEvents > 0 ? Math.round((s.value / totalSourceEvents) * 100) : 0;
              return (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white/70 text-xs flex items-center gap-1.5"><span>{s.icon}</span>{s.label}</span>
                    <span className="text-white text-xs font-bold">{pct}% <span className="text-white/30">({formatNum(s.value)})</span></span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Videos table */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Your Videos ({data.videos.length})</h2>
        {data.videos.length === 0 ? (
          <div className="text-center py-16 text-white/30">
            <div className="text-4xl mb-3">🎬</div>
            <p>No videos yet — <Link href="/upload" className="text-purple-400 hover:text-purple-300">upload your first</Link></p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.videos.map((v, i) => (
              <div key={v.id} className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 flex items-center gap-4">
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/40 text-xs font-bold shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/video/${v.id}`} className="text-white font-semibold text-sm hover:text-purple-300 line-clamp-1">{v.title}</Link>
                  <p className="text-white/30 text-xs mt-0.5">{new Date(v.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-3 shrink-0 text-right">
                  <div>
                    <div className="text-white font-bold text-sm">{formatNum(v.views)}</div>
                    <div className="text-white/30 text-xs">views</div>
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{formatNum(v.likes)}</div>
                    <div className="text-white/30 text-xs">likes</div>
                  </div>
                  {v.watch_events > 0 && (
                    <div>
                      <div className="text-white font-bold text-sm">{formatSeconds(v.avg_watch_seconds)}</div>
                      <div className="text-white/30 text-xs">avg watch</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
