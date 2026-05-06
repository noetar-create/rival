'use client';

import { useState, useEffect } from 'react';
import VideoCard from '@/components/VideoCard';

interface VideoData {
  id: number;
  title: string;
  description: string | null;
  username: string;
  likes: number;
  views: number;
  thumbnail_url: string | null;
  created_at: string;
}

interface Collection {
  id: number;
  name: string;
  item_count: number;
}

export default function SavedPage() {
  const [tab, setTab] = useState<'bookmarks' | 'collections'>('bookmarks');
  const [bookmarks, setBookmarks] = useState<VideoData[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collectionVideos, setCollectionVideos] = useState<Record<number, VideoData[]>>({});
  const [openCollection, setOpenCollection] = useState<number | null>(null);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const bmRes = await fetch('/api/bookmarks');
      if (bmRes.status === 401) { window.location.href = '/login'; return; }
      if (bmRes.ok) setBookmarks(await bmRes.json() as VideoData[]);
      const colRes = await fetch('/api/collections');
      if (colRes.ok) setCollections(await colRes.json() as Collection[]);
      setLoading(false);
    };
    load();
  }, []);

  const openCol = async (id: number) => {
    setOpenCollection(prev => prev === id ? null : id);
    if (!collectionVideos[id]) {
      const res = await fetch(`/api/collections/${id}`);
      if (res.ok) {
        const data = await res.json() as VideoData[];
        setCollectionVideos(prev => ({ ...prev, [id]: data }));
      }
    }
  };

  const createCollection = async () => {
    if (!newName.trim() || creating) return;
    setCreating(true);
    const res = await fetch('/api/collections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim() }),
    });
    setCreating(false);
    if (res.ok) {
      setNewName('');
      const fresh = await fetch('/api/collections');
      if (fresh.ok) setCollections(await fresh.json() as Collection[]);
    }
  };

  const deleteCollection = async (id: number) => {
    await fetch(`/api/collections/${id}`, { method: 'DELETE' });
    setCollections(prev => prev.filter(c => c.id !== id));
    if (openCollection === id) setOpenCollection(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black text-white mb-6">🔖 Saved</h1>

      <div className="flex gap-1 mb-8 bg-white/5 rounded-xl p-1 w-fit">
        {(['bookmarks', 'collections'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${tab === t ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
          >
            {t === 'bookmarks' ? `Bookmarks (${bookmarks.length})` : `Collections (${collections.length})`}
          </button>
        ))}
      </div>

      {tab === 'bookmarks' && (
        bookmarks.length === 0 ? (
          <div className="text-center py-20 text-white/30">
            <div className="text-4xl mb-3">🔖</div>
            <p>No saved videos yet. Tap the bookmark on any video in the feed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarks.map(v => (
              <VideoCard key={v.id} id={v.id} title={v.title} description={v.description ?? undefined} username={v.username} likes={v.likes} views={v.views} thumbnail_url={v.thumbnail_url} created_at={v.created_at} />
            ))}
          </div>
        )
      )}

      {tab === 'collections' && (
        <div>
          <div className="flex gap-2 mb-6">
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && createCollection()}
              placeholder="New collection name..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm outline-none focus:border-purple-500/50"
            />
            <button
              onClick={createCollection}
              disabled={!newName.trim() || creating}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-xl disabled:opacity-40"
            >
              + Create
            </button>
          </div>

          {collections.length === 0 ? (
            <div className="text-center py-16 text-white/30">
              <div className="text-4xl mb-3">📁</div>
              <p>No collections yet. Create one above to organize your saved videos.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {collections.map(col => (
                <div key={col.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  <div className="flex items-center px-5 py-4">
                    <button onClick={() => openCol(col.id)} className="flex items-center gap-3 flex-1 text-left">
                      <span className="text-2xl">📁</span>
                      <div>
                        <p className="text-white font-bold">{col.name}</p>
                        <p className="text-white/40 text-xs">{col.item_count} video{col.item_count !== 1 ? 's' : ''}</p>
                      </div>
                      <span className="ml-auto text-white/40 text-sm">{openCollection === col.id ? '▲' : '▼'}</span>
                    </button>
                    <button onClick={() => deleteCollection(col.id)} className="ml-3 text-white/20 hover:text-red-400 transition-colors text-sm px-2">✕</button>
                  </div>
                  {openCollection === col.id && (
                    <div className="px-4 pb-4 border-t border-white/10 pt-4">
                      {!collectionVideos[col.id] ? (
                        <div className="flex justify-center py-6"><div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>
                      ) : collectionVideos[col.id].length === 0 ? (
                        <p className="text-white/30 text-sm text-center py-6">Empty collection.</p>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {collectionVideos[col.id].map(v => (
                            <VideoCard key={v.id} id={v.id} title={v.title} description={v.description ?? undefined} username={v.username} likes={v.likes} views={v.views} thumbnail_url={v.thumbnail_url} created_at={v.created_at} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
