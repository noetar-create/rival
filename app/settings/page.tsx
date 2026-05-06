'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SettingsPage() {
  const [isPrivate, setIsPrivate] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [privSaving, setPrivSaving] = useState(false);
  const [pwToast, setPwToast] = useState('');
  const [pwError, setPwError] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    fetch('/api/profile')
      .then(r => { if (r.status === 401) { window.location.href = '/login'; return null; } return r.json(); })
      .then((d: { username?: string; is_private?: number } | null) => {
        if (d) {
          setUsername(d.username || '');
          setIsPrivate(d.is_private === 1);
        }
      });
  }, []);

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    if (newPw !== confirmPw) { setPwError('Passwords do not match'); return; }
    if (newPw.length < 8) { setPwError('Password must be at least 8 characters'); return; }
    setPwSaving(true);
    const res = await fetch('/api/settings/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_password: currentPw, new_password: newPw }),
    });
    setPwSaving(false);
    const d = await res.json() as { error?: string };
    if (res.ok) { setPwToast('Password updated!'); setCurrentPw(''); setNewPw(''); setConfirmPw(''); setTimeout(() => setPwToast(''), 2500); }
    else { setPwError(d.error || 'Failed to update password'); }
  };

  const togglePrivacy = async () => {
    setPrivSaving(true);
    const next = !isPrivate;
    await fetch('/api/settings/privacy', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_private: next }),
    });
    setIsPrivate(next);
    setPrivSaving(false);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        {username && (
          <Link href={`/profile/${username}`} className="text-white/50 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        )}
        <h1 className="text-2xl font-black text-white">⚙️ Settings</h1>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <Link href="/edit-profile" className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 transition-colors">
          <div className="text-xl mb-1">✏️</div>
          <div className="text-white font-semibold text-sm">Edit Profile</div>
          <div className="text-white/40 text-xs">Name, bio, website</div>
        </Link>
        <Link href="/analytics" className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 transition-colors">
          <div className="text-xl mb-1">📈</div>
          <div className="text-white font-semibold text-sm">Analytics</div>
          <div className="text-white/40 text-xs">Video performance</div>
        </Link>
      </div>

      {/* Privacy */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
        <h2 className="text-white font-bold mb-4">Privacy</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-sm font-medium">Private Account</p>
            <p className="text-white/40 text-xs mt-0.5">Only approved followers see your videos</p>
          </div>
          <button
            onClick={togglePrivacy}
            disabled={privSaving}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${isPrivate ? 'bg-purple-500' : 'bg-white/20'}`}
          >
            <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${isPrivate ? 'translate-x-6' : ''}`} />
          </button>
        </div>
      </div>

      {/* Change password */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
        <h2 className="text-white font-bold mb-4">Change Password</h2>
        <form onSubmit={savePassword} className="space-y-3">
          <input
            type="password"
            value={currentPw}
            onChange={e => setCurrentPw(e.target.value)}
            placeholder="Current password"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm outline-none focus:border-purple-500/50"
          />
          <input
            type="password"
            value={newPw}
            onChange={e => setNewPw(e.target.value)}
            placeholder="New password (min 8 characters)"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm outline-none focus:border-purple-500/50"
          />
          <input
            type="password"
            value={confirmPw}
            onChange={e => setConfirmPw(e.target.value)}
            placeholder="Confirm new password"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm outline-none focus:border-purple-500/50"
          />
          {pwError && <p className="text-red-400 text-xs">{pwError}</p>}
          {pwToast && <p className="text-green-400 text-xs">{pwToast}</p>}
          <button
            type="submit"
            disabled={!currentPw || !newPw || !confirmPw || pwSaving}
            className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl text-sm disabled:opacity-40 transition-all"
          >
            {pwSaving ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Danger zone */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <h2 className="text-white font-bold mb-3">Account</h2>
        <a
          href="/api/auth/logout"
          className="block w-full text-center py-2.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl text-sm font-semibold transition-colors"
        >
          Sign Out
        </a>
      </div>
    </div>
  );
}
