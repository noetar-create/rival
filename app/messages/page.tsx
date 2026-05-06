'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Conversation {
  other_user_id: number;
  other_username: string;
  other_avatar: string | null;
  last_message: string;
  last_at: string;
  unread_count: number;
}

function timeAgo(d: string) {
  const diff = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState('');

  useEffect(() => {
    fetch('/api/messages')
      .then(r => { if (r.status === 401) { window.location.href = '/login'; return null; } return r.json(); })
      .then(d => { if (d) setConversations((d as { conversations: Conversation[] }).conversations); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-white">💬 Messages</h1>
      </div>

      {/* New message */}
      <div className="flex gap-2 mb-6">
        <input
          value={newUser}
          onChange={e => setNewUser(e.target.value)}
          placeholder="Message a user by @username..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm outline-none focus:border-purple-500/50"
        />
        <Link
          href={`/messages/${newUser.replace('@', '')}`}
          className={`px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-xl transition-opacity ${!newUser.trim() ? 'opacity-40 pointer-events-none' : 'hover:opacity-90'}`}
        >
          Go
        </Link>
      </div>

      {conversations.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <div className="text-4xl mb-3">💬</div>
          <p>No conversations yet. Message someone to start!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map(c => (
            <Link key={c.other_user_id} href={`/messages/${c.other_username}`} className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-colors">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg font-black text-white shrink-0">
                {c.other_username[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-white font-bold text-sm">@{c.other_username}</span>
                  <span className="text-white/30 text-xs">{timeAgo(c.last_at)}</span>
                </div>
                <p className="text-white/50 text-sm truncate">{c.last_message}</p>
              </div>
              {c.unread_count > 0 && (
                <span className="min-w-[22px] h-[22px] bg-purple-500 rounded-full text-white text-xs font-bold flex items-center justify-center px-1 shrink-0">
                  {c.unread_count}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
