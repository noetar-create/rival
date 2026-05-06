'use client';

import { useState, useEffect } from 'react';

interface Story {
  id: number;
  user_id: number;
  content: string;
  bg_color: string;
  expires_at: string;
  created_at: string;
  username: string;
  viewed: number;
}

const BG_COLORS = ['#7c3aed', '#db2777', '#ea580c', '#2563eb', '#16a34a', '#dc2626', '#0891b2'];

function StoryViewer({ stories, startIndex, onClose }: { stories: Story[]; startIndex: number; onClose: () => void }) {
  const [index, setIndex] = useState(startIndex);
  const story = stories[index];

  useEffect(() => {
    if (story) {
      fetch(`/api/stories/${story.id}/view`, { method: 'POST' }).catch(() => {});
    }
  }, [story]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (index < stories.length - 1) setIndex(i => i + 1);
      else onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [index, stories.length, onClose]);

  if (!story) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center" onClick={onClose}>
      <div
        className="relative w-full max-w-sm h-[80vh] rounded-3xl flex flex-col items-center justify-center p-8 mx-4"
        style={{ background: story.bg_color }}
        onClick={e => e.stopPropagation()}
      >
        {/* Progress bar */}
        <div className="absolute top-4 left-4 right-4 flex gap-1">
          {stories.map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden">
              <div className={`h-full bg-white rounded-full ${i < index ? 'w-full' : i === index ? 'animate-story-progress' : 'w-0'}`} />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-8 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-sm font-black text-white">
              {story.username[0]?.toUpperCase()}
            </div>
            <span className="text-white text-sm font-bold">@{story.username}</span>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-xl">✕</button>
        </div>

        {/* Content */}
        <p className="text-white text-2xl font-bold text-center leading-relaxed">{story.content}</p>

        {/* Nav */}
        <div className="absolute inset-y-0 left-0 w-1/3" onClick={() => setIndex(i => Math.max(0, i - 1))} />
        <div className="absolute inset-y-0 right-0 w-1/3" onClick={() => setIndex(i => Math.min(stories.length - 1, i + 1))} />
      </div>
    </div>
  );
}

export default function StoriesBar() {
  const [stories, setStories] = useState<Story[]>([]);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [storyText, setStoryText] = useState('');
  const [selectedColor, setSelectedColor] = useState(BG_COLORS[0]);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetch('/api/stories').then(r => r.json()).then(d => setStories(d as Story[])).catch(() => {});
  }, []);

  const postStory = async () => {
    if (!storyText.trim() || posting) return;
    setPosting(true);
    const res = await fetch('/api/stories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: storyText.trim(), bg_color: selectedColor }),
    });
    setPosting(false);
    if (res.status === 401) { window.location.href = '/login'; return; }
    if (res.ok) {
      setStoryText('');
      setShowCreate(false);
      const fresh = await fetch('/api/stories');
      setStories(await fresh.json() as Story[]);
    }
  };

  // Group by username, pick first story per user
  const grouped = Object.values(
    stories.reduce<Record<string, Story>>((acc, s) => { if (!acc[s.username]) acc[s.username] = s; return acc; }, {})
  );

  if (grouped.length === 0 && !showCreate) return null;

  return (
    <>
      <div className="flex items-center gap-3 px-4 py-3 overflow-x-auto scrollbar-hide">
        {/* Add story button */}
        <button
          onClick={() => setShowCreate(true)}
          className="flex flex-col items-center gap-1 shrink-0"
        >
          <div className="w-14 h-14 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center text-white/60 hover:border-purple-400 hover:text-purple-400 transition-colors">
            <span className="text-2xl">+</span>
          </div>
          <span className="text-white/40 text-[10px] font-medium">Your story</span>
        </button>

        {grouped.map((s, i) => (
          <button key={s.id} onClick={() => setViewerIndex(stories.indexOf(s))} className="flex flex-col items-center gap-1 shrink-0">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-black text-white ring-2 ring-offset-2 ring-offset-[#0a0a0a] transition-all ${s.viewed ? 'ring-white/20' : 'ring-purple-500'}`} style={{ background: s.bg_color }}>
              {s.username[0]?.toUpperCase()}
            </div>
            <span className="text-white/60 text-[10px] font-medium max-w-[56px] truncate">{s.username}</span>
          </button>
        ))}
      </div>

      {/* Story viewer */}
      {viewerIndex !== null && (
        <StoryViewer stories={stories} startIndex={viewerIndex} onClose={() => setViewerIndex(null)} />
      )}

      {/* Create story modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center" onClick={() => setShowCreate(false)}>
          <div className="w-full max-w-sm bg-[#1a1a1a] rounded-t-3xl p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-bold text-lg mb-4 text-center">Create a Story</h3>
            <div className="rounded-2xl p-6 mb-4 flex items-center justify-center min-h-[120px]" style={{ background: selectedColor }}>
              <p className="text-white text-xl font-bold text-center">{storyText || 'Type your story...'}</p>
            </div>
            <textarea
              value={storyText}
              onChange={e => setStoryText(e.target.value.slice(0, 150))}
              placeholder="What's on your mind?"
              rows={2}
              autoFocus
              className="w-full bg-white/10 text-white placeholder-white/40 text-sm rounded-xl px-4 py-3 outline-none resize-none mb-4"
            />
            <div className="flex gap-2 mb-4">
              {BG_COLORS.map(c => (
                <button key={c} onClick={() => setSelectedColor(c)} className={`w-8 h-8 rounded-full border-2 transition-transform ${selectedColor === c ? 'border-white scale-110' : 'border-transparent'}`} style={{ background: c }} />
              ))}
            </div>
            <button
              onClick={postStory}
              disabled={!storyText.trim() || posting}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl disabled:opacity-40 transition-all"
            >
              {posting ? 'Posting...' : 'Share Story (24h)'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
