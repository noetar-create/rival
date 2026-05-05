import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getBlogPost, getBlogPosts } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let post;
  try {
    post = getBlogPost(slug);
  } catch {}

  if (!post) return { title: 'Post Not Found' };

  return {
    title: `${post.title} — Rival Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}

export async function generateStaticParams() {
  try {
    const posts = getBlogPosts();
    return posts.map(p => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

function renderContent(content: string) {
  const lines = content.split('\n');
  const elements: ReactNode[] = [];
  let key = 0;

  for (const line of lines) {
    if (line.startsWith('# ')) {
      elements.push(<h1 key={key++} className="text-3xl md:text-4xl font-black text-white mt-8 mb-4 leading-tight">{line.slice(2)}</h1>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={key++} className="text-2xl font-black text-white mt-8 mb-3 leading-tight">{line.slice(3)}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={key++} className="text-xl font-bold text-white/90 mt-6 mb-2">{line.slice(4)}</h3>);
    } else if (line.startsWith('- ')) {
      elements.push(<li key={key++} className="text-white/70 leading-relaxed ml-4 mb-1 list-disc">{line.slice(2)}</li>);
    } else if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(<p key={key++} className="text-white font-semibold my-2">{line.slice(2, -2)}</p>);
    } else if (line.trim() === '') {
      elements.push(<div key={key++} className="h-2" />);
    } else if (line.trim().length > 0) {
      // Handle inline bold
      const parts = line.split(/\*\*(.+?)\*\*/g);
      if (parts.length > 1) {
        elements.push(
          <p key={key++} className="text-white/70 leading-relaxed my-2">
            {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-white">{part}</strong> : part)}
          </p>
        );
      } else {
        elements.push(<p key={key++} className="text-white/70 leading-relaxed my-2">{line}</p>);
      }
    }
  }

  return elements;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  let post;
  try {
    post = getBlogPost(slug);
  } catch {}

  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: { '@type': 'Organization', name: post.author },
    publisher: { '@type': 'Organization', name: 'Rival', url: 'https://rivalapp.io' },
    datePublished: post.created_at,
    url: `https://rivalapp.io/blog/${post.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm mb-6">
          ← Back to Blog
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs bg-purple-500/20 border border-purple-500/30 text-purple-300 px-3 py-1 rounded-full font-semibold">{post.author}</span>
            <span className="text-white/30 text-xs">{post.read_time} min read</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/30 text-xs">{new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Content */}
        <article className="prose-rival">
          {renderContent(post.content)}
        </article>

        {/* CTA */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/20 text-center">
          <h3 className="text-white font-black text-xl mb-2">Ready to compete?</h3>
          <p className="text-white/50 text-sm mb-4">Join Rival and start climbing the leaderboard today.</p>
          <Link
            href="/signup"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            Join Rival Free →
          </Link>
        </div>

        {/* Back to blog */}
        <div className="mt-8 text-center">
          <Link href="/blog" className="text-white/30 hover:text-white/50 text-sm transition-colors">
            ← More from the Rival Blog
          </Link>
        </div>
      </div>
    </>
  );
}
