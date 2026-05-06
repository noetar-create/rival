import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Rival — The Competitive Social Platform',
  description: 'Learn about Rival — the social platform where you compete daily in games, post videos, and win weekly prizes. Built for people who want more than passive scrolling.',
  openGraph: {
    title: 'About Rival — The Competitive Social Platform',
    description: 'Rival is where posting videos and playing games actually means something. Compete. Win. Repeat.',
    url: 'https://rivalapp.io/about',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'About Rival' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Rival',
    description: 'The social platform where you compete daily and win weekly prizes.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Rival',
  url: 'https://rivalapp.io',
  description: 'Rival is the competitive social platform where users post videos, play daily mini-games, and battle for weekly prizes on a live leaderboard.',
  foundingDate: '2026',
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto px-4 py-12">

        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
            Built for people who <span className="gradient-text">actually compete</span>
          </h1>
          <p className="text-white/50 text-xl max-w-2xl mx-auto">
            Rival is the social platform where posting and playing means something real — every week, someone wins.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {[
            {
              icon: '🎮',
              title: 'Daily Games',
              body: '7 different mini-games refresh every day. Typing speed, trivia, reaction time, memory, chess puzzles, emoji decode, and spot the difference. Each win earns you a point toward the weekly prize.',
            },
            {
              icon: '🏆',
              title: 'Weekly Leaderboard',
              body: 'Every Monday the leaderboard resets. Top performers over the week win real prizes. The more you play and the more competitions you enter, the higher you climb.',
            },
            {
              icon: '🎬',
              title: 'Video Competitions',
              body: 'Post your video and let the community vote. Daily winners get bonus points. It\'s not just about going viral — it\'s about winning the day.',
            },
            {
              icon: '😂',
              title: 'Creative Contests',
              body: 'Caption contests, hot takes, funniest posts, daily predictions — five different ways to compete with your words and creativity every single day.',
            },
          ].map((card) => (
            <div key={card.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-colors">
              <div className="text-4xl mb-4">{card.icon}</div>
              <h2 className="text-xl font-bold text-white mb-2">{card.title}</h2>
              <p className="text-white/50 leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/20 rounded-3xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-black text-white mb-4">Why we built Rival</h2>
          <div className="space-y-4 text-white/60 leading-relaxed">
            <p>
              Social media got boring. You scroll, you watch, you double tap, and nothing happens. No consequence, no reward, no real reason to come back tomorrow beyond habit.
            </p>
            <p>
              Rival is different. Every day you have real competitions to enter, real games to win, and a real leaderboard with your name on it. Every week, someone at the top of that leaderboard wins something.
            </p>
            <p>
              We built Rival for people who want more than passive entertainment — for people who want to show up, compete, and actually win something for their time.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-16 text-center">
          {[
            { value: '7', label: 'Games every day' },
            { value: '5', label: 'Daily competitions' },
            { value: 'Weekly', label: 'Prize resets' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="text-3xl font-black gradient-text mb-1">{stat.value}</div>
              <div className="text-white/40 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to compete?</h2>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/signup" className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity">
              Join Free
            </Link>
            <Link href="/games" className="px-8 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/15 transition-colors border border-white/10">
              See the Games
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
