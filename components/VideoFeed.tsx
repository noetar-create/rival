'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface FeedVideo {
  id: number;
  title: string;
  description: string | null;
  file_url: string | null;
  thumbnail_url: string | null;
  likes: number;
  views: number;
  download_count: number;
  hashtags: string | null;
  username: string;
  verified: number;
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

function extractHashtags(text: string | null): string[] {
  if (!text) return [];
  const matches = text.match(/#[\w]+/g);
  return matches ? [...new Set(matches)] : [];
}

function formatNum(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

interface VideoSlideProps {
  video: FeedVideo;
  isActive: boolean;
}

function VideoSlide({ video, isActive }: VideoSlideProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video.likes);
  const [bookmarked, setBookmarked] = useState(false);
  const [toast, setToast] = useState('');

  const allHashtags = extractHashtags(video.hashtags || video.description);
  const gradient = gradients[video.id % gradients.length];

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [isActive]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const handleLike = async () => {
    try {
      const res = await fetch(`/api/videos/${video.id}/like`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json() as { liked: boolean };
        setLiked(data.liked);
        setLikeCount((prev) => (data.liked ? prev + 1 : prev - 1));
      } else if (res.status === 401) {
        window.location.href = '/login';
      }
    } catch {}
  };

  const handleBookmark = async () => {
    try {
      const res = await fetch(`/api/videos/${video.id}/bookmark`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json() as { bookmarked: boolean };
        setBookmarked(data.bookmarked);
        showToast(data.bookmarked ? 'Saved!' : 'Removed');
      } else if (res.status === 401) {
        window.location.href = '/login';
      }
    } catch {}
  };

  const handleShare = () => {
    const url = `${window.location.origin}/?v=${video.id}`;
    navigator.clipboard.writeText(url).then(() => showToast('Link copied!')).catch(() => showToast('Copy failed'));
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = `/api/videos/${video.id}/download`;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Downloading...');
  };

  return (
    <div className="relative w-full h-screen snap-start snap-always flex-shrink-0 overflow-hidden bg-black">
      {/* Video or gradient background */}
      {video.file_url ? (
        <video
          ref={videoRef}
          src={video.file_url}
          className="absolute inset-0 w-full h-full object-cover"
          loop
          muted
          playsInline
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <div className="text-center px-8">
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-white text-xl font-bold leading-snug max-w-sm">{video.title}</p>
          </div>
        </div>
      )}

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {/* Bottom overlay — username, title, hashtags */}
      <div className="absolute bottom-0 left-0 right-16 p-5 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white">
            {video.username[0]?.toUpperCase()}
          </div>
          <span className="text-white font-semibold text-sm">@{video.username}</span>
          {video.verified === 1 && (
            <span className="text-blue-400 text-xs font-bold bg-blue-400/20 px-1.5 py-0.5 rounded-full">✓</span>
          )}
        </div>
        <h3 className="text-white font-bold text-base leading-snug mb-2 line-clamp-2">{video.title}</h3>
        {allHashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {allHashtags.slice(0, 5).map((tag) => (
              <Link
                key={tag}
                href={`/hashtag/${tag.replace('#', '')}`}
                className="text-purple-300 text-sm font-medium hover:text-purple-200 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Right side action buttons */}
      <div className="absolute right-3 bottom-16 flex flex-col items-center gap-5">
        {/* Like */}
        <button onClick={handleLike} className="flex flex-col items-center gap-1">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${liked ? 'bg-pink-500/30' : 'bg-black/40'}`}>
            <svg className={`w-6 h-6 transition-colors ${liked ? 'text-pink-400' : 'text-white'}`} fill={liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <span className="text-white text-xs font-semibold">{formatNum(likeCount)}</span>
        </button>

        {/* Bookmark */}
        <button onClick={handleBookmark} className="flex flex-col items-center gap-1">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${bookmarked ? 'bg-purple-500/30' : 'bg-black/40'}`}>
            <svg className={`w-6 h-6 transition-colors ${bookmarked ? 'text-purple-400' : 'text-white'}`} fill={bookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <span className="text-white text-xs font-semibold">Save</span>
        </button>

        {/* Share */}
        <button onClick={handleShare} className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </div>
          <span className="text-white text-xs font-semibold">Share</span>
        </button>

        {/* Download */}
        <button onClick={handleDownload} className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          <span className="text-white text-xs font-semibold">Save</span>
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/90 text-black text-sm font-semibold px-4 py-2 rounded-full shadow-lg z-10 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}

interface VideoFeedProps {
  videos: FeedVideo[];
}

export default function VideoFeed({ videos }: VideoFeedProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const scrollTop = container.scrollTop;
    const height = container.clientHeight;
    const index = Math.round(scrollTop / height);
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (videos.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll"
      style={{
        scrollSnapType: 'y mandatory',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {videos.map((video, i) => (
        <VideoSlide key={video.id} video={video} isActive={i === activeIndex} />
      ))}
    </div>
  );
}
