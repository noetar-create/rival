'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Profile {
  username: string;
  display_name: string | null;
  bio: string | null;
  website: string | null;
  email: string;
}

export default function EditProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetch('/api/profile')
      .then(r => { if (r.status === 401) { window.location.href = '/login'; return null; } return r.json(); })
      .then(d => {
        if (d) {
          const p = d as Profile;
          setProfile(p);
          setDisplayName(p.display_name || '');
          setBio(p.bio || '');
          setWebsite(p.website || '');
        }
      });
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ display_name: displayName, bio, website }),
    });
    setSaving(false);
    if (res.ok) { setToast('Profile saved!'); setTimeout(() => setToast(''), 2500); }
  };

  if (!profile) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Link href={`/profile/${profile.username}`} className="text-white/50 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-black text-white">Edit Profile</h1>
      </div>

      {/* Avatar placeholder */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-black text-white">
          {profile.username[0]?.toUpperCase()}
        </div>
        <div>
          <p className="text-white font-bold">@{profile.username}</p>
          <p className="text-white/40 text-xs mt-0.5">{profile.email}</p>
        </div>
      </div>

      <form onSubmit={save} className="space-y-5">
        <div>
          <label className="text-white/70 text-sm font-medium block mb-2">Display Name</label>
          <input
            value={displayName}
            onChange={e => setDisplayName(e.target.value.slice(0, 50))}
            placeholder={`@${profile.username}`}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-purple-500/50 transition-colors"
          />
          <p className="text-white/30 text-xs mt-1 text-right">{displayName.length}/50</p>
        </div>

        <div>
          <label className="text-white/70 text-sm font-medium block mb-2">Bio</label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value.slice(0, 200))}
            placeholder="Tell the world about yourself..."
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 resize-none outline-none focus:border-purple-500/50 transition-colors text-sm"
          />
          <p className="text-white/30 text-xs mt-1 text-right">{bio.length}/200</p>
        </div>

        <div>
          <label className="text-white/70 text-sm font-medium block mb-2">Website / Link in bio</label>
          <input
            value={website}
            onChange={e => setWebsite(e.target.value.slice(0, 100))}
            placeholder="https://yoursite.com"
            type="url"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>

        {toast && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-xl">
            {toast}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl transition-all disabled:opacity-40"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link href={`/profile/${profile.username}`} className="px-5 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/15 transition-colors text-center">
            Cancel
          </Link>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-white/10">
        <Link href="/settings" className="text-white/40 hover:text-white text-sm transition-colors">
          Account settings (password, privacy) →
        </Link>
      </div>
    </div>
  );
}
