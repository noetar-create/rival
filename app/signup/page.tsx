'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      window.location.href = '/';
    } else {
      setError(data.error || 'Signup failed');
    }
    setLoading(false);
  };

  const perks = [
    'Compete in 7 daily games',
    'Enter all 5 competition types',
    'Climb the weekly leaderboard',
    'Win weekly prizes',
    'Build your creator following',
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black gradient-text mb-1">RIVAL</h1>
          <p className="text-white/40 text-sm">Compete. Win. Repeat.</p>
        </div>

        {/* Perks */}
        <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/20 rounded-2xl p-4 mb-4">
          <p className="text-white/60 text-xs font-semibold mb-2">WHY JOIN?</p>
          <ul className="space-y-1.5">
            {perks.map(p => (
              <li key={p} className="flex items-center gap-2 text-white/70 text-sm">
                <span className="text-purple-400">⚡</span>{p}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#111111] border border-white/10 rounded-2xl p-6">
          <h2 className="text-white font-bold text-xl mb-6 text-center">Create your account</h2>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-white/60 text-sm font-medium block mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                placeholder="your_username"
                minLength={3}
                maxLength={20}
                required
                className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-purple-500/50 transition-colors"
              />
              <p className="text-white/25 text-xs mt-1">3–20 chars, letters/numbers/underscore</p>
            </div>

            <div>
              <label className="text-white/60 text-sm font-medium block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="text-white/60 text-sm font-medium block mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                required
                className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-purple-500/50 transition-colors"
              />
              <p className="text-white/25 text-xs mt-1">Minimum 6 characters</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl transition-all duration-200 disabled:opacity-50 hover:shadow-lg hover:shadow-purple-500/30"
            >
              {loading ? 'Creating account...' : 'Join Rival Free →'}
            </button>
          </form>

          <p className="text-center text-white/30 text-xs mt-4">
            By signing up you agree to our Terms of Service and Privacy Policy.
          </p>

          <p className="text-center text-white/40 text-sm mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
              Log in
            </Link>
          </p>
        </div>

        <p className="text-center mt-4">
          <Link href="/" className="text-white/30 hover:text-white/50 text-sm transition-colors">
            ← Back to Rival
          </Link>
        </p>
      </div>
    </div>
  );
}
