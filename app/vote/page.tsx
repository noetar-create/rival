'use client';

import { useState, useEffect } from 'react';

interface Entry {
  id: number;
  user_id: number;
  content: string;
  votes: number;
  username: string;
}

export default function VotePage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [voting, setVoting] = useState<number | null>(null);
  const [voted, setVoted] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch('/api/competitions/vote')
      .then(r => r.json())
      .then(d => { setEntries(d.entries || []); setLoading(false); });
  }, []);

  const submit = async () => {
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    const res = await fetch('/api/competitions/vote/entry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: content.trim() }),
    });
    if (res.ok) {
      setSubmitted(true);
      const data = await res.json();
      setEntries(prev => [{ id: data.id, user_id: 0, content: content.trim(), votes: 0, username: 'you' }, ...prev]);
    } else if (res.status === 401) {
      window.location.href = '/login';
    }
    setSubmitting(false);
  };

  const vote = async (entryId: number) => {
    if (voting || voted.has(entryId)) return;
    setVoting(entryId);
    const res = await fetch('/api/competitions/vote/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entry_id: entryId }),
    });
    if (res.ok) {
      setVoted(prev => new Set([...prev, entryId]));
      setEntries(prev => prev.map(e => e.id === entryId ? { ...e, votes: e.votes + 1 } : e).sort((a, b) => b.votes - a.votes));
    } else if (res.status === 401) {
      window.location.href = '/login';
    }
    setVoting(null);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
          🎬 DAILY VIDEO VOTE • WINNER GETS +2 PTS
        </div>
        <h1 className="text-3xl font-black text-white mb-2">Video Vote</h1>
        <p className="text-white/50">Submit your video URL or title. The community votes. Most votes by midnight wins +2 points.</p>
      </div>

      {/* Submit */}
      {!submitted && (
        <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-bold mb-4">Submit Your Video</h2>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value.slice(0, 280))}
            placeholder="Paste your video link or describe your video in a few words..."
            className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 resize-none h-24 outline-none focus:border-purple-500/50 transition-colors text-sm"
          />
          <div className="flex justify-between items-center mt-3">
            <span className="text-white/30 text-xs">{content.length}/280</span>
            <button
              onClick={submit}
              disabled={!content.trim() || submitting}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-40 transition-all text-sm"
            >
              {submitting ? 'Submitting...' : 'Submit Entry'}
            </button>
          </div>
        </div>
      )}

      {submitted && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 mb-6 text-center">
          <p className="text-green-400 font-semibold">✓ Submitted! Now vote for others to support the community.</p>
        </div>
      )}

      {/* Legal notice */}
      <div className="bg-white/3 border border-white/8 rounded-xl px-4 py-3 mb-6 flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="text-green-400 text-xs font-bold">NO PURCHASE NECESSARY</span>
        <span className="text-white/30 text-xs">Free to enter · 18+ · Void where prohibited</span>
        <span className="text-white/30 text-xs">Winner = most community votes (creative merit). <a href="/rules" className="text-purple-400 hover:text-purple-300 underline">Full rules</a></span>
      </div>

      {/* Entries */}
      <div className="space-y-3">
        <h2 className="text-white font-bold">Today&apos;s Entries</h2>
        {loading && <p className="text-white/40 text-center py-8">Loading...</p>}
        {!loading && entries.length === 0 && (
          <div className="text-center py-12 bg-[#111111] rounded-2xl border border-white/5">
            <p className="text-4xl mb-3">🎬</p>
            <p className="text-white/40">No entries yet — be the first!</p>
          </div>
        )}
        {entries.map((entry, i) => (
          <div key={entry.id} className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${i === 0 ? 'border-purple-500/30 bg-purple-500/5' : 'border-white/5 bg-[#111111]'}`}>
            <div className="text-xl font-black text-white/20 w-6 text-center flex-shrink-0">#{i + 1}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {entry.username[0]?.toUpperCase()}
                </div>
                <span className="text-white/50 text-xs">@{entry.username}</span>
                {i === 0 && <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full font-semibold">Leading</span>}
              </div>
              <p className="text-white text-sm">{entry.content}</p>
            </div>
            <button
              onClick={() => vote(entry.id)}
              disabled={voted.has(entry.id) || voting === entry.id}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all flex-shrink-0 ${
                voted.has(entry.id)
                  ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                  : 'bg-white/5 text-white/50 border border-white/10 hover:border-pink-500/40 hover:text-pink-400'
              }`}
            >
              <span className="text-lg">❤️</span>
              <span className="text-xs font-bold">{entry.votes}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
