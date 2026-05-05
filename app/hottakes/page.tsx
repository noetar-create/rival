'use client';

import { useState, useEffect } from 'react';

interface Entry {
  id: number;
  content: string;
  votes: number;
  username: string;
}

export default function HotTakesPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [voted, setVoted] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch('/api/competitions/hottakes')
      .then(r => r.json())
      .then(d => { setEntries(d.entries || []); setLoading(false); });
  }, []);

  const submit = async () => {
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    const res = await fetch('/api/competitions/hottakes/entry', {
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
    const res = await fetch('/api/competitions/hottakes/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entry_id: entryId }),
    });
    if (res.ok) {
      setVoted(prev => new Set([...prev, entryId]));
      setEntries(prev => prev.map(e => e.id === entryId ? { ...e, votes: e.votes + 1 } : e).sort((a, b) => b.votes - a.votes));
    } else if (res.status === 401) window.location.href = '/login';
  };

  const hotTakeExamples = [
    "Pineapple on pizza is objectively better than plain cheese",
    "Mornings are overrated and night owls are more creative",
    "Reply-all emails should be a criminal offence",
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
          🔥 HOT TAKES • WINNER GETS +2 PTS
        </div>
        <h1 className="text-3xl font-black text-white mb-2">Hot Takes 🔥</h1>
        <p className="text-white/50">One sentence. One controversial opinion. Most votes by midnight wins +2 points.</p>
      </div>

      {/* Example takes */}
      <div className="bg-red-900/10 border border-red-500/20 rounded-2xl p-5 mb-6">
        <p className="text-red-300 text-xs font-semibold mb-3">💡 Examples of winning takes:</p>
        <div className="space-y-2">
          {hotTakeExamples.map((ex, i) => (
            <button
              key={i}
              onClick={() => !submitted && setContent(ex)}
              className="block w-full text-left text-white/60 text-sm italic hover:text-white/80 transition-colors cursor-pointer"
            >
              &quot;{ex}&quot;
            </button>
          ))}
        </div>
      </div>

      {!submitted && (
        <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-bold mb-4">Your Hot Take</h2>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value.slice(0, 280))}
            placeholder="Say something controversial but defensible..."
            className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 resize-none h-24 outline-none focus:border-red-500/50 transition-colors text-sm"
          />
          <div className="flex justify-between items-center mt-3">
            <span className={`text-xs ${content.length > 250 ? 'text-red-400' : 'text-white/30'}`}>{content.length}/280</span>
            <button
              onClick={submit}
              disabled={!content.trim() || submitting}
              className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-40 transition-all text-sm"
            >
              {submitting ? 'Posting...' : 'Drop the Take 🔥'}
            </button>
          </div>
        </div>
      )}

      {submitted && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 mb-6 text-center">
          <p className="text-green-400 font-semibold">✓ Hot take posted! Now vote for the spiciest.</p>
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-white font-bold">Today&apos;s Takes</h2>
        {loading && <p className="text-white/40 text-center py-8">Loading...</p>}
        {!loading && entries.length === 0 && (
          <div className="text-center py-12 bg-[#111111] rounded-2xl border border-white/5">
            <p className="text-5xl mb-3">🔥</p>
            <p className="text-white/40">No takes yet — drop yours first!</p>
          </div>
        )}
        {entries.map((entry, i) => (
          <div key={entry.id} className={`flex items-start gap-4 p-5 rounded-2xl border transition-all ${i === 0 ? 'border-red-500/30 bg-red-500/5' : 'border-white/5 bg-[#111111]'}`}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {i === 0 && <span className="text-lg">🔥</span>}
                <span className="text-white/30 font-black text-xs">#{i + 1}</span>
                <span className="text-white/50 text-xs">@{entry.username}</span>
                {i === 0 && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-semibold ml-auto">Hottest</span>}
              </div>
              <p className="text-white font-medium leading-relaxed">&quot;{entry.content}&quot;</p>
            </div>
            <button
              onClick={() => vote(entry.id)}
              disabled={voted.has(entry.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-2.5 rounded-xl transition-all flex-shrink-0 ${
                voted.has(entry.id)
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-white/5 text-white/50 border border-white/10 hover:border-red-500/40 hover:text-red-400'
              }`}
            >
              <span>🔥</span>
              <span className="font-bold text-xs">{entry.votes}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
