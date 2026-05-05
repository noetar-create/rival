'use client';

import { useState, useEffect } from 'react';

interface Entry {
  id: number;
  content: string;
  votes: number;
  username: string;
}

export default function FunniestPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [voted, setVoted] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch('/api/competitions/funniest')
      .then(r => r.json())
      .then(d => { setEntries(d.entries || []); setLoading(false); });
  }, []);

  const submit = async () => {
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    const res = await fetch('/api/competitions/funniest/entry', {
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
    const res = await fetch('/api/competitions/funniest/vote', {
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
        <div className="inline-flex items-center gap-2 bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
          😂 FUNNIEST POST • WINNER GETS +2 PTS
        </div>
        <h1 className="text-3xl font-black text-white mb-2">Funniest Post</h1>
        <p className="text-white/50">Max 280 characters. Make the community laugh. Most votes by midnight wins +2 points.</p>
      </div>

      {!submitted && (
        <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-bold mb-4">Write Your Funniest Post</h2>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value.slice(0, 280))}
            placeholder="Make us laugh... 😂"
            className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 resize-none h-28 outline-none focus:border-pink-500/50 transition-colors text-sm"
          />
          <div className="flex justify-between items-center mt-3">
            <span className={`text-xs ${content.length > 250 ? 'text-red-400' : 'text-white/30'}`}>{content.length}/280</span>
            <button
              onClick={submit}
              disabled={!content.trim() || submitting}
              className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-40 transition-all text-sm"
            >
              {submitting ? 'Posting...' : 'Post It 😂'}
            </button>
          </div>
        </div>
      )}

      {submitted && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 mb-6 text-center">
          <p className="text-green-400 font-semibold">✓ Posted! Vote for others too!</p>
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-white font-bold">Today&apos;s Posts</h2>
        {loading && <p className="text-white/40 text-center py-8">Loading...</p>}
        {!loading && entries.length === 0 && (
          <div className="text-center py-12 bg-[#111111] rounded-2xl border border-white/5">
            <p className="text-5xl mb-3">😂</p>
            <p className="text-white/40">No posts yet — be the funniest!</p>
          </div>
        )}
        {entries.map((entry, i) => (
          <div key={entry.id} className={`p-5 rounded-2xl border transition-all ${i === 0 ? 'border-pink-500/30 bg-pink-500/5' : 'border-white/5 bg-[#111111]'}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-white/20 font-black text-sm">#{i + 1}</span>
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-xs font-bold text-white">
                {entry.username[0]?.toUpperCase()}
              </div>
              <span className="text-white/50 text-xs">@{entry.username}</span>
              {i === 0 && <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full font-semibold ml-auto">😂 Winning</span>}
            </div>
            <p className="text-white text-sm leading-relaxed mb-4">{entry.content}</p>
            <button
              onClick={() => vote(entry.id)}
              disabled={voted.has(entry.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                voted.has(entry.id)
                  ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                  : 'bg-white/5 text-white/50 border border-white/10 hover:border-pink-500/40 hover:text-pink-400'
              }`}
            >
              😂 {voted.has(entry.id) ? 'Voted!' : 'Funny!'} · {entry.votes}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
