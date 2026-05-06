'use client';

import { useState, useEffect } from 'react';

export default function UploadPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [sound, setSound] = useState('');
  const [contentWarning, setContentWarning] = useState(false);
  const [duetOfId, setDuetOfId] = useState<number | null>(null);
  const [duetInfo, setDuetInfo] = useState<{ username: string; title: string } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const duetId = params.get('duet');
    if (duetId) {
      setDuetOfId(parseInt(duetId));
      fetch(`/api/videos/${duetId}/duet`, { method: 'POST' })
        .then(r => r.json())
        .then((d: { duet_of_username?: string; duet_of_title?: string }) => {
          if (d.duet_of_username) setDuetInfo({ username: d.duet_of_username, title: d.duet_of_title || '' });
        }).catch(() => {});
    }
  }, []);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required'); return; }
    setSubmitting(true);
    setError('');
    const res = await fetch('/api/videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, file_url: videoUrl, content_warning: contentWarning, duet_of_id: duetOfId, sound: sound.trim() || undefined }),
    });
    if (res.ok) {
      setSuccess(true);
    } else if (res.status === 401) {
      window.location.href = '/login';
    } else {
      const d = await res.json();
      setError(d.error || 'Failed to upload');
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🎬</div>
        <h2 className="text-2xl font-black text-white mb-3">Video Posted!</h2>
        <p className="text-white/50 mb-6">Your video is live on Rival. Don&apos;t forget to enter it in the Video Vote for a chance at +2 points!</p>
        <div className="flex gap-3 justify-center">
          <a href="/" className="px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity">
            View Feed
          </a>
          <a href="/vote" className="px-5 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/15 transition-colors">
            Video Vote →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
          ⬆️ UPLOAD
        </div>
        <h1 className="text-3xl font-black text-white mb-2">Upload a Video</h1>
        <p className="text-white/50">Share a short video with the Rival community. Enter it in Video Vote for a chance to win +2 points.</p>
      </div>

      {/* Duet context banner */}
      {duetInfo && (
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-4 mb-5 flex items-center gap-3">
          <span className="text-2xl">🎵</span>
          <div>
            <p className="text-purple-300 text-sm font-bold">Dueting @{duetInfo.username}</p>
            <p className="text-white/40 text-xs truncate">{duetInfo.title}</p>
          </div>
        </div>
      )}

      {/* Upload zone */}
      <div className="border-2 border-dashed border-white/10 hover:border-purple-500/40 rounded-2xl p-10 text-center mb-6 transition-colors group cursor-pointer bg-[#111111]">
        <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">🎬</div>
        <p className="text-white/60 font-semibold mb-1">Video upload coming soon</p>
        <p className="text-white/30 text-sm">For now, paste a video URL or describe your video below</p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-white/70 text-sm font-medium block mb-2">Video Title *</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Make it catchy..."
            maxLength={100}
            className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>

        <div>
          <label className="text-white/70 text-sm font-medium block mb-2">Video URL (optional)</label>
          <input
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
            placeholder="https://youtube.com/shorts/... or TikTok link"
            className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>

        <div>
          <label className="text-white/70 text-sm font-medium block mb-2">Sound / Music (optional)</label>
          <input
            value={sound}
            onChange={e => setSound(e.target.value.slice(0, 100))}
            placeholder="Artist – Song Title or 'Original Sound'"
            className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>

        <div>
          <label className="text-white/70 text-sm font-medium block mb-2">Description (optional)</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value.slice(0, 300))}
            placeholder="Tell us about your video..."
            className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 resize-none h-24 outline-none focus:border-purple-500/50 transition-colors text-sm"
          />
          <p className="text-white/30 text-xs mt-1 text-right">{description.length}/300</p>
        </div>

        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            onClick={() => setContentWarning(v => !v)}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0 ${contentWarning ? 'bg-orange-500 border-orange-500' : 'border-white/30 group-hover:border-white/50'}`}
          >
            {contentWarning && <span className="text-white text-xs font-bold">✓</span>}
          </div>
          <div>
            <span className="text-white/70 text-sm font-medium">Sensitive content warning</span>
            <p className="text-white/30 text-xs mt-0.5">Viewers must tap to reveal this video</p>
          </div>
        </label>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!title.trim() || submitting}
          className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl transition-all duration-200 disabled:opacity-40 hover:shadow-lg hover:shadow-purple-500/30"
        >
          {submitting ? 'Uploading...' : 'Post Video'}
        </button>
      </form>

      {/* Tips */}
      <div className="mt-8 bg-[#111111] border border-white/5 rounded-2xl p-5">
        <h3 className="text-white font-bold text-sm mb-3">Tips for viral videos on Rival</h3>
        <ul className="space-y-2 text-white/40 text-xs">
          <li>• 15–45 seconds is the optimal length for votes</li>
          <li>• Start with action in the first 3 seconds</li>
          <li>• One focused idea wins more votes than multiple</li>
          <li>• Authentic beats polished on Rival</li>
          <li>• Enter Video Vote for your chance at +2 points</li>
        </ul>
      </div>
    </div>
  );
}
