'use client';

import { useState, useEffect } from 'react';

interface Entry {
  id: number;
  content: string;
  votes: number;
  username: string;
}

// Daily caption image — rotates by day of year
const CAPTION_IMAGES = [
  { emoji: '🐧', alt: 'A penguin in a business suit', description: 'Penguin in full corporate attire, briefcase in flipper, looking extremely serious' },
  { emoji: '🐶', alt: 'A dog wearing sunglasses', description: 'Golden retriever sporting giant aviator shades on a sunny beach' },
  { emoji: '🦦', alt: 'An otter doing yoga', description: 'Sea otter in perfect downward dog position on a tiny floating mat' },
  { emoji: '🐱', alt: 'A cat judging you', description: 'Tabby cat sitting upright, looking directly at camera with maximum contempt' },
  { emoji: '🦜', alt: 'A parrot at a business meeting', description: 'Parrot at the head of a conference table, PowerPoint clicker in talon' },
];

export default function CaptionPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [voted, setVoted] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  const todayImg = CAPTION_IMAGES[new Date().getDay() % CAPTION_IMAGES.length];

  useEffect(() => {
    fetch('/api/competitions/caption')
      .then(r => r.json())
      .then(d => { setEntries(d.entries || []); setLoading(false); });
  }, []);

  const submit = async () => {
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    const res = await fetch('/api/competitions/caption/entry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: content.trim() }),
    });
    if (res.ok) {
      setSubmitted(true);
      const data = await res.json();
      setEntries(prev => [{ id: data.id, content: content.trim(), votes: 0, username: 'you' }, ...prev]);
    } else if (res.status === 401) window.location.href = '/login';
    setSubmitting(false);
  };

  const vote = async (entryId: number) => {
    if (voted.has(entryId)) return;
    const res = await fetch('/api/competitions/caption/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entry_id: entryId }),
    });
    if (res.ok) {
      setVoted(prev => new Set([...prev, entryId]));
      setEntries(prev => prev.map(e => e.id === entryId ? { ...e, votes: e.votes + 1 } : e).sort((a, b) => b.votes - a.votes));
    } else if (res.status === 401) window.location.href = '/login';
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
          💬 CAPTION THIS • WINNER GETS +2 PTS
        </div>
        <h1 className="text-3xl font-black text-white mb-2">Caption This</h1>
        <p className="text-white/50">One image. Write the funniest caption. Community votes for the winner.</p>
      </div>

      {/* Today's Image */}
      <div className="bg-gradient-to-br from-orange-900/30 to-amber-900/30 border border-orange-500/20 rounded-2xl p-8 mb-6 text-center">
        <div className="text-8xl mb-4">{todayImg.emoji}</div>
        <p className="text-white/60 text-sm italic">&quot;{todayImg.description}&quot;</p>
        <p className="text-white/30 text-xs mt-2">Today&apos;s image prompt</p>
      </div>

      {!submitted && (
        <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-bold mb-4">Your Caption</h2>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value.slice(0, 200))}
            placeholder="Write the funniest caption for this image..."
            className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 resize-none h-24 outline-none focus:border-orange-500/50 transition-colors text-sm"
          />
          <div className="flex justify-between items-center mt-3">
            <span className="text-white/30 text-xs">{content.length}/200</span>
            <button
              onClick={submit}
              disabled={!content.trim() || submitting}
              className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-40 transition-all text-sm"
            >
              {submitting ? 'Submitting...' : 'Submit Caption'}
            </button>
          </div>
        </div>
      )}

      {submitted && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 mb-6 text-center">
          <p className="text-green-400 font-semibold">✓ Caption submitted! Vote for your favourites.</p>
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-white font-bold">Today&apos;s Captions</h2>
        {loading && <p className="text-white/40 text-center py-8">Loading...</p>}
        {!loading && entries.length === 0 && (
          <div className="text-center py-12 bg-[#111111] rounded-2xl border border-white/5">
            <p className="text-4xl mb-3">💬</p>
            <p className="text-white/40">No captions yet — submit yours!</p>
          </div>
        )}
        {entries.map((entry, i) => (
          <div key={entry.id} className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${i === 0 ? 'border-orange-500/30 bg-orange-500/5' : 'border-white/5 bg-[#111111]'}`}>
            <span className="text-white/20 font-black text-sm w-5 flex-shrink-0">#{i + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="text-white/50 text-xs mb-1">@{entry.username}</p>
              <p className="text-white text-sm italic">&quot;{entry.content}&quot;</p>
            </div>
            <button
              onClick={() => vote(entry.id)}
              disabled={voted.has(entry.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all flex-shrink-0 text-sm ${
                voted.has(entry.id)
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  : 'bg-white/5 text-white/50 border border-white/10 hover:border-orange-500/40 hover:text-orange-400'
              }`}
            >
              <span>👆</span>
              <span className="font-bold text-xs">{entry.votes}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
