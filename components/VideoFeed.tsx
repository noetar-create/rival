'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import GameSlide from './GameSlide';
import PromoSlide, { PROMOS } from './PromoSlide';
import type { FeedGame } from '@/lib/db';

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

interface CommentItem {
  id: number;
  username: string;
  content: string;
  created_at: string;
  verified: number;
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

function timeAgo(date: string) {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

// ── Comment Drawer ───────────────────────────────────────

function CommentDrawer({ videoId, onClose }: { videoId: number; onClose: () => void }) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [text, setText] = useState('');
  const [posting, setPosting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`/api/videos/${videoId}/comments`)
      .then(r => r.json())
      .then(data => setComments(data as CommentItem[]))
      .catch(() => {});
    setTimeout(() => inputRef.current?.focus(), 300);
  }, [videoId]);

  const post = async () => {
    if (!text.trim() || posting) return;
    setPosting(true);
    try {
      const res = await fetch(`/api/videos/${videoId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text.trim() }),
      });
      if (res.status === 401) { window.location.href = '/login'; return; }
      if (res.ok) {
        setText('');
        const fresh = await fetch(`/api/videos/${videoId}/comments`);
        setComments(await fresh.json() as CommentItem[]);
      }
    } finally { setPosting(false); }
  };

  return (
    <>
      <div className="absolute inset-0 bg-black/50 z-20" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-[#1a1a1a] rounded-t-3xl z-30 flex flex-col max-h-[70%]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <span className="text-white font-bold text-sm">Comments ({comments.length})</span>
          <button onClick={onClose} className="text-white/50 hover:text-white text-lg">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-4 min-h-0">
          {comments.length === 0 ? (
            <p className="text-white/30 text-sm text-center py-8">No comments yet — be the first!</p>
          ) : comments.map(c => (
            <div key={c.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-black text-white shrink-0">
                {c.username[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Link href={`/profile/${c.username}`} className="text-white text-xs font-bold hover:text-purple-300">@{c.username}</Link>
                  {c.verified === 1 && <span className="text-blue-400 text-[10px]">✓</span>}
                  <span className="text-white/30 text-[10px]">{timeAgo(c.created_at)}</span>
                </div>
                <p className="text-white/80 text-sm leading-snug">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 px-4 py-3 border-t border-white/10">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && post()}
            placeholder="Add a comment..."
            className="flex-1 bg-white/10 text-white placeholder-white/30 text-sm rounded-full px-4 py-2.5 outline-none"
          />
          <button onClick={post} disabled={!text.trim() || posting} className="text-purple-400 font-bold text-sm disabled:opacity-30">
            Post
          </button>
        </div>
      </div>
    </>
  );
}

// ── Report Menu ──────────────────────────────────────────

const REPORT_REASONS = ['Spam', 'Inappropriate content', 'Hate speech', 'Misinformation', 'Other'];

function ReportMenu({ videoId, username, onClose }: { videoId: number; username: string; onClose: () => void }) {
  const [step, setStep] = useState<'menu' | 'report'>('menu');
  const [toast, setToast] = useState('');

  const report = async (reason: string) => {
    const res = await fetch(`/api/videos/${videoId}/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    if (res.status === 401) { window.location.href = '/login'; return; }
    setToast('Reported. Thank you.');
    setTimeout(onClose, 1500);
  };

  const block = async () => {
    const res = await fetch(`/api/users/${username}/block`, { method: 'POST' });
    if (res.status === 401) { window.location.href = '/login'; return; }
    setToast(`@${username} blocked.`);
    setTimeout(onClose, 1500);
  };

  return (
    <>
      <div className="absolute inset-0 bg-black/60 z-20" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-[#1a1a1a] rounded-t-3xl z-30 pb-6">
        {toast ? (
          <div className="p-8 text-center text-white font-semibold">{toast}</div>
        ) : step === 'menu' ? (
          <>
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mt-3 mb-4" />
            <button onClick={() => setStep('report')} className="w-full text-left px-6 py-4 text-white font-semibold hover:bg-white/5 transition-colors flex items-center gap-3">
              <span className="text-xl">🚩</span> Report video
            </button>
            <button onClick={block} className="w-full text-left px-6 py-4 text-red-400 font-semibold hover:bg-white/5 transition-colors flex items-center gap-3">
              <span className="text-xl">🚫</span> Block @{username}
            </button>
            <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/video/${videoId}`); onClose(); }} className="w-full text-left px-6 py-4 text-white font-semibold hover:bg-white/5 transition-colors flex items-center gap-3">
              <span className="text-xl">🔗</span> Copy link to video
            </button>
          </>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-white/10">
              <button onClick={() => setStep('menu')} className="text-white/50 text-sm mb-1">← Back</button>
              <p className="text-white font-bold">Why are you reporting this?</p>
            </div>
            {REPORT_REASONS.map(r => (
              <button key={r} onClick={() => report(r)} className="w-full text-left px-6 py-3.5 text-white/80 hover:bg-white/5 transition-colors text-sm">
                {r}
              </button>
            ))}
          </>
        )}
      </div>
    </>
  );
}

// ── VideoSlide ───────────────────────────────────────────

interface VideoSlideProps {
  video: FeedVideo;
  isActive: boolean;
  muted: boolean;
  setMuted: (m: boolean) => void;
}

function VideoSlide({ video, isActive, muted, setMuted }: VideoSlideProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video.likes);
  const [bookmarked, setBookmarked] = useState(false);
  const [toast, setToast] = useState('');
  const [playing, setPlaying] = useState(true);
  const [showPauseIcon, setShowPauseIcon] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [following, setFollowing] = useState(false);
  const pauseIconTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const viewTracked = useRef(false);

  const allHashtags = extractHashtags(video.hashtags || video.description);
  const gradient = gradients[video.id % gradients.length];

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) {
      setPlaying(true);
      v.muted = true;
      v.play().then(() => { v.muted = muted; }).catch(() => {});
      if (!viewTracked.current) {
        viewTracked.current = true;
        fetch(`/api/videos/${video.id}/view`, { method: 'POST' }).catch(() => {});
      }
    } else {
      v.pause();
      setShowComments(false);
      setShowMenu(false);
    }
  }, [isActive]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !isActive) return;
    if (playing) { v.play().catch(() => {}); } else { v.pause(); }
  }, [playing, isActive]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const handleVideoClick = () => {
    const next = !playing;
    setPlaying(next);
    if (!next) {
      setShowPauseIcon(true);
      if (pauseIconTimer.current) clearTimeout(pauseIconTimer.current);
      pauseIconTimer.current = setTimeout(() => setShowPauseIcon(false), 800);
    } else {
      setShowPauseIcon(false);
    }
  };

  const handleLike = async () => {
    try {
      const res = await fetch(`/api/videos/${video.id}/like`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json() as { liked: boolean };
        setLiked(data.liked);
        setLikeCount(prev => data.liked ? prev + 1 : prev - 1);
      } else if (res.status === 401) { window.location.href = '/login'; }
    } catch {}
  };

  const handleBookmark = async () => {
    try {
      const res = await fetch(`/api/videos/${video.id}/bookmark`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json() as { bookmarked: boolean };
        setBookmarked(data.bookmarked);
        showToast(data.bookmarked ? 'Saved!' : 'Removed');
      } else if (res.status === 401) { window.location.href = '/login'; }
    } catch {}
  };

  const handleShare = () => {
    const url = `${window.location.origin}/video/${video.id}`;
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

  const handleFollow = async () => {
    try {
      const res = await fetch(`/api/users/${video.username}/follow`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json() as { following: boolean };
        setFollowing(data.following);
        showToast(data.following ? `Following @${video.username}` : 'Unfollowed');
      } else if (res.status === 401) { window.location.href = '/login'; }
    } catch {}
  };

  return (
    <div className="relative w-full h-screen snap-start snap-always flex-shrink-0 bg-black flex items-center justify-center overflow-hidden">
      <div className="relative h-full w-full max-w-[430px] overflow-hidden">
        {video.file_url ? (
          <video ref={videoRef} src={video.file_url} className="absolute inset-0 w-full h-full object-cover" loop playsInline onClick={handleVideoClick} />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center`} onClick={handleVideoClick}>
            <div className="text-center px-8">
              <div className="text-6xl mb-4">🎬</div>
              <p className="text-white text-xl font-bold leading-snug max-w-sm">{video.title}</p>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

        {/* Pause flash */}
        {showPauseIcon && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="w-16 h-16 rounded-full bg-black/60 flex items-center justify-center animate-ping-once">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            </div>
          </div>
        )}

        {/* ⋯ menu button */}
        <button
          onClick={() => setShowMenu(true)}
          className="absolute top-4 left-4 z-10 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white/70 hover:text-white"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
          </svg>
        </button>

        {/* Mute button */}
        {video.file_url && muted && (
          <button onClick={() => setMuted(false)} className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/60 text-white text-xs font-semibold px-3 py-1.5 rounded-full z-10 hover:bg-black/80 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
            Tap for sound
          </button>
        )}

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-16 p-5 pb-6 pointer-events-none">
          <div className="flex items-center gap-2 mb-2 pointer-events-auto flex-wrap">
            <Link href={`/profile/${video.username}`} className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
              {video.username[0]?.toUpperCase()}
            </Link>
            <Link href={`/profile/${video.username}`} className="text-white font-semibold text-sm hover:text-purple-300">@{video.username}</Link>
            {video.verified === 1 && <span className="text-blue-400 text-xs font-bold bg-blue-400/20 px-1.5 py-0.5 rounded-full">✓</span>}
            <button onClick={handleFollow} className={`text-xs font-bold px-2.5 py-1 rounded-full border transition-colors ${following ? 'border-white/30 text-white/60' : 'border-purple-400 text-purple-400 hover:bg-purple-400/10'}`}>
              {following ? 'Following' : '+ Follow'}
            </button>
          </div>
          <h3 className="text-white font-bold text-base leading-snug mb-2 line-clamp-2">{video.title}</h3>
          {allHashtags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pointer-events-auto">
              {allHashtags.slice(0, 5).map(tag => (
                <Link key={tag} href={`/hashtag/${tag.replace('#', '')}`} className="text-purple-300 text-sm font-medium hover:text-purple-200">
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="absolute right-3 bottom-16 flex flex-col items-center gap-5">
          <button onClick={handleLike} className="flex flex-col items-center gap-1">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${liked ? 'bg-pink-500/30' : 'bg-black/40'}`}>
              <svg className={`w-6 h-6 ${liked ? 'text-pink-400' : 'text-white'}`} fill={liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="text-white text-xs font-semibold">{formatNum(likeCount)}</span>
          </button>

          <button onClick={() => setShowComments(true)} className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="text-white text-xs font-semibold">Comment</span>
          </button>

          <button onClick={handleShare} className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <span className="text-white text-xs font-semibold">Share</span>
          </button>

          <button onClick={handleBookmark} className="flex flex-col items-center gap-1">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${bookmarked ? 'bg-purple-500/30' : 'bg-black/40'}`}>
              <svg className={`w-6 h-6 ${bookmarked ? 'text-purple-400' : 'text-white'}`} fill={bookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <span className="text-white text-xs font-semibold">Save</span>
          </button>

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
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/90 text-black text-sm font-semibold px-4 py-2 rounded-full shadow-lg z-10 whitespace-nowrap">
            {toast}
          </div>
        )}

        {showComments && <CommentDrawer videoId={video.id} onClose={() => setShowComments(false)} />}
        {showMenu && <ReportMenu videoId={video.id} username={video.username} onClose={() => setShowMenu(false)} />}
      </div>
    </div>
  );
}

// ── Feed Tabs ────────────────────────────────────────────

type TabType = 'foryou' | 'following' | 'trending';

const TABS: { key: TabType; label: string }[] = [
  { key: 'foryou', label: 'For You' },
  { key: 'following', label: 'Following' },
  { key: 'trending', label: '🔥 Trending' },
];

type FeedItem =
  | { type: 'video'; data: FeedVideo }
  | { type: 'game' }
  | { type: 'promo'; data: typeof PROMOS[0] };

interface VideoFeedProps {
  videos: FeedVideo[];
  games: FeedGame[];
}

export default function VideoFeed({ videos: initialVideos, games }: VideoFeedProps) {
  const [activeTab, setActiveTab] = useState<TabType>('foryou');
  const [videos, setVideos] = useState<FeedVideo[]>(initialVideos);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const switchTab = async (tab: TabType) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setLoading(true);
    setActiveIndex(0);
    if (containerRef.current) containerRef.current.scrollTop = 0;
    try {
      const res = await fetch(`/api/feed?type=${tab}`);
      const data = await res.json() as FeedVideo[];
      setVideos(data.length > 0 ? data : initialVideos);
    } catch {
      setVideos(initialVideos);
    } finally {
      setLoading(false);
    }
  };

  const feedItems: FeedItem[] = [];
  let promoIdx = 0;
  for (let i = 0; i < videos.length; i++) {
    feedItems.push({ type: 'video', data: videos[i] });
    const pos = i + 1;
    if (pos % 10 === 5 && games.length > 0) {
      feedItems.push({ type: 'game' });
    } else if (pos % 10 === 0) {
      feedItems.push({ type: 'promo', data: PROMOS[promoIdx % PROMOS.length] });
      promoIdx++;
    }
  }

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const index = Math.round(container.scrollTop / container.clientHeight);
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (feedItems.length === 0) return null;

  return (
    <div className="relative">
      {/* Tab switcher — overlaid at top like TikTok */}
      <div className="fixed top-0 left-0 right-0 z-40 flex justify-center pt-3 pb-2 pointer-events-none md:left-64">
        <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-full px-1.5 py-1 pointer-events-auto">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => switchTab(tab.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-white text-black'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 pointer-events-none">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Feed */}
      <div
        ref={containerRef}
        className="h-screen overflow-y-scroll"
        style={{ scrollSnapType: 'y mandatory', WebkitOverflowScrolling: 'touch' }}
      >
        {feedItems.map((item, i) =>
          item.type === 'video' ? (
            <VideoSlide key={`v-${item.data.id}-${activeTab}`} video={item.data} isActive={i === activeIndex} muted={muted} setMuted={setMuted} />
          ) : item.type === 'game' ? (
            <GameSlide key={`g-${i}`} games={games} isActive={i === activeIndex} />
          ) : (
            <PromoSlide key={`p-${item.data.name}`} promo={item.data} />
          )
        )}
      </div>
    </div>
  );
}
