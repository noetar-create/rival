'use client';

import { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  read: number;
  created_at: string;
  sender_username: string;
}

interface OtherUser {
  id: number;
  username: string;
  avatar_url: string | null;
}

function timeAgo(d: string) {
  const diff = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(d).toLocaleDateString();
}

export default function ChatPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const [messages, setMessages] = useState<Message[]>([]);
  const [other, setOther] = useState<OtherUser | null>(null);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [myUsername, setMyUsername] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    const res = await fetch(`/api/messages/${username}`);
    if (res.status === 401) { window.location.href = '/login'; return; }
    if (res.ok) {
      const d = await res.json() as { messages: Message[]; other: OtherUser };
      setMessages(d.messages);
      setOther(d.other);
      if (d.messages.length > 0) setMyUsername(d.messages[d.messages.length - 1].sender_username === username ? '' : d.messages[d.messages.length - 1].sender_username);
      fetch(`/api/messages/${username}/read`, { method: 'POST' }).catch(() => {});
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [username]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetch('/api/profile').then(r => r.json()).then((d: { username?: string }) => { if (d.username) setMyUsername(d.username); }).catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/messages/${username}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text.trim() }),
      });
      if (res.ok) { setText(''); load(); }
    } finally { setSending(false); }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-4 border-b border-white/10 bg-[#0a0a0a] sticky top-0 z-10">
        <Link href="/messages" className="text-white/50 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <Link href={`/profile/${username}`} className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-black text-white">
            {username[0]?.toUpperCase()}
          </div>
          <span className="text-white font-bold">@{username}</span>
        </Link>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-white/30 text-sm text-center py-12">No messages yet. Say hello!</p>
        )}
        {messages.map(m => {
          const isMe = m.sender_username === myUsername;
          return (
            <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                isMe
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-md'
                  : 'bg-white/10 text-white rounded-bl-md'
              }`}>
                <p>{m.content}</p>
                <p className={`text-[10px] mt-1 ${isMe ? 'text-white/60' : 'text-white/40'}`}>{timeAgo(m.created_at)}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-white/10 bg-[#0a0a0a] pb-safe">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Type a message..."
          className="flex-1 bg-white/10 text-white placeholder-white/30 text-sm rounded-full px-4 py-2.5 outline-none"
        />
        <button
          onClick={send}
          disabled={!text.trim() || sending}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center disabled:opacity-40 transition-opacity"
        >
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
