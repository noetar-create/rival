import type { Metadata } from 'next';
import { getBlogPosts } from '@/lib/db';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog — Rival',
  description: 'Insights on competitive social media, brain games, creator strategy, and the psychology behind competition. The Rival blog.',
};

const gradients = [
  'from-purple-600 to-indigo-600',
  'from-pink-600 to-rose-600',
  'from-orange-500 to-amber-500',
  'from-red-600 to-orange-600',
  'from-blue-600 to-cyan-600',
  'from-green-500 to-teal-500',
  'from-violet-600 to-purple-600',
  'from-fuchsia-600 to-pink-600',
  'from-teal-500 to-cyan-500',
  'from-indigo-600 to-blue-600',
];

export default function BlogPage() {
  let posts: { id: number; slug: string; title: string; excerpt: string; author: string; read_time: number; created_at: string }[] = [];
  try {
    posts = getBlogPosts();
  } catch {}

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
          📝 RIVAL BLOG
        </div>
        <h1 className="text-3xl font-black text-white mb-2">The Rival Blog</h1>
        <p className="text-white/50">Strategy, psychology, and insights to help you compete smarter.</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 bg-[#111111] rounded-2xl border border-white/5">
          <p className="text-4xl mb-3">📝</p>
          <p className="text-white/50 mb-2">Blog posts loading...</p>
          <p className="text-white/30 text-sm">Run the seed script to populate blog posts</p>
        </div>
      ) : (
        <>
          {/* Featured post */}
          <div className="mb-8">
            <Link
              href={`/blog/${posts[0].slug}`}
              className="group block rounded-3xl overflow-hidden border border-white/10 hover:border-purple-500/30 transition-all duration-300 bg-[#111111]"
            >
              <div className={`h-48 bg-gradient-to-br ${gradients[0]} relative`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-4 left-6">
                  <span className="bg-white/20 backdrop-blur text-white text-xs font-semibold px-3 py-1 rounded-full">Featured</span>
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-white text-xl font-black mb-2 group-hover:text-purple-300 transition-colors">{posts[0].title}</h2>
                <p className="text-white/50 text-sm mb-4 line-clamp-2">{posts[0].excerpt}</p>
                <div className="flex items-center gap-3 text-white/30 text-xs">
                  <span>{posts[0].author}</span>
                  <span>·</span>
                  <span>{posts[0].read_time} min read</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.slice(1).map((post, i) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block rounded-2xl overflow-hidden border border-white/5 hover:border-purple-500/30 transition-all duration-300 bg-[#111111]"
              >
                <div className={`h-28 bg-gradient-to-br ${gradients[(i + 1) % gradients.length]}`}>
                  <div className="w-full h-full bg-black/10 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                    <span className="text-4xl opacity-70">📝</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-bold text-sm mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors leading-tight">{post.title}</h3>
                  <p className="text-white/40 text-xs mb-3 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-2 text-white/25 text-xs">
                    <span>{post.author}</span>
                    <span>·</span>
                    <span>{post.read_time} min</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
