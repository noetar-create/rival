'use client';

import { useState } from 'react';

interface VideoCardProps {
  id: number;
  title: string;
  description?: string;
  username: string;
  likes: number;
  views: number;
  thumbnail_url?: string | null;
  created_at: string;
}

const gradients = [
  'from-purple-600 via-pink-600 to-orange-500',
  'from-blue-600 via-purple-600 to-pink-500',
  'from-green-500 via-teal-500 to-blue-600',
  'from-orange-500 via-red-500 to-pink-600',
  'from-indigo-600 via-blue-500 to-cyan-500',
  'from-pink-500 via-rose-500 to-orange-500',
];

export default function VideoCard({ id, title, description, username, likes, views, thumbnail_url, created_at }: VideoCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [loading, setLoading] = useState(false);

  const gradientIndex = id % gradients.length;
  const gradient = gradients[gradientIndex];

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/videos/${id}/like`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setLiked(data.liked);
        setLikeCount(prev => data.liked ? prev + 1 : prev - 1);
      } else if (res.status === 401) {
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const formatNum = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (mins > 0) return `${mins}m ago`;
    return 'just now';
  };

  return (
    <div className="bg-[#111111] rounded-2xl overflow-hidden border border-white/5 hover:border-purple-500/30 transition-all duration-300 group">
      {/* Thumbnail */}
      <div className={`relative aspect-video bg-gradient-to-br ${gradient} flex items-center justify-center cursor-pointer overflow-hidden`}>
        {thumbnail_url ? (
          <img src={thumbnail_url} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-black/20 backdrop-blur flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <p className="text-white/80 text-sm font-medium px-4 text-center line-clamp-2">{title}</p>
          </div>
        )}
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
            <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
        {/* Views badge */}
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {formatNum(views)}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm leading-tight line-clamp-2 mb-1">{title}</h3>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
                {username[0]?.toUpperCase()}
              </div>
              <span className="text-white/50 text-xs">@{username}</span>
              <span className="text-white/30 text-xs">·</span>
              <span className="text-white/30 text-xs">{timeAgo(created_at)}</span>
            </div>
          </div>
        </div>

        {description && (
          <p className="text-white/40 text-xs mt-2 line-clamp-2">{description}</p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5">
          <button
            onClick={handleLike}
            disabled={loading}
            className={`flex items-center gap-1.5 text-sm font-medium transition-all duration-200 ${
              liked ? 'text-pink-400' : 'text-white/50 hover:text-pink-400'
            }`}
          >
            <svg className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {formatNum(likeCount)}
          </button>

          <button className="flex items-center gap-1.5 text-sm font-medium text-white/50 hover:text-blue-400 transition-colors duration-200">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Comment
          </button>

          <button className="flex items-center gap-1.5 text-sm font-medium text-white/50 hover:text-green-400 transition-colors duration-200 ml-auto">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
