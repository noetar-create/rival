import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Rules & Guidelines',
  description: 'Rival platform rules: points system, game rules, competition rules, prize eligibility, content guidelines, download policy, and fair play standards.',
  openGraph: {
    title: 'Rival Rules & Guidelines',
    description: 'Everything you need to know about how Rival works — points, games, prizes, and community standards.',
    url: 'https://rivalapp.io/rules',
  },
};

const sections = [
  {
    id: 'points',
    icon: '⚡',
    title: 'Points System',
    color: 'from-purple-500/10 to-purple-600/5 border-purple-500/20',
    accent: 'text-purple-400',
    items: [
      { label: '+1 point', desc: 'Winning any game on Rival' },
      { label: '+2 points', desc: 'Playing 8 different games in one calendar day (daily diversity bonus)' },
      { label: '+2 points', desc: 'Winning a daily competition (video vote, funniest, caption, hot takes, predict)' },
      { label: '+5 points', desc: 'Referring a friend who creates an account using your referral link' },
      { label: '+5 points', desc: 'New user bonus when you sign up via a referral link' },
    ],
  },
  {
    id: 'games',
    icon: '🎮',
    title: 'Game Rules',
    color: 'from-pink-500/10 to-pink-600/5 border-pink-500/20',
    accent: 'text-pink-400',
    items: [
      { label: 'Reaction Test', desc: 'Click as fast as possible when the screen changes. Win condition: faster than the average opponent response time.' },
      { label: 'Memory Match', desc: 'Flip cards to find matching pairs. Win condition: complete the board in fewer moves than the target.' },
      { label: 'Trivia', desc: 'Answer 5 multiple-choice trivia questions. Win condition: score 4/5 or better.' },
      { label: 'Type Racer', desc: 'Type a given passage as fast and accurately as possible. Win condition: exceed 40 WPM with 95% accuracy.' },
      { label: 'Emoji Decode', desc: 'Decode what phrase or movie the emojis represent. Win condition: 3 correct answers in a row.' },
      { label: 'Word Scramble', desc: 'Unscramble the given letters into a valid word. Win condition: solve 3 words in under 30 seconds.' },
      { label: 'Number Guess', desc: 'Guess the secret number in fewest attempts. Win condition: guess correctly in 5 or fewer tries.' },
    ],
  },
  {
    id: 'competitions',
    icon: '🏆',
    title: 'Competition Rules',
    color: 'from-orange-500/10 to-orange-600/5 border-orange-500/20',
    accent: 'text-orange-400',
    items: [
      { label: 'One entry per day', desc: 'You may submit one entry per competition type per calendar day. Entries reset at midnight UTC.' },
      { label: 'One vote per entry', desc: 'Each user may vote once per entry. You cannot vote for your own entry.' },
      { label: 'Daily reset', desc: 'Competition entries and votes reset daily. Yesterday\'s submissions do not carry over.' },
      { label: 'Winning condition', desc: 'The entry with the most votes at end of day wins +2 points. Ties are split among tied entries.' },
      { label: 'Competition types', desc: 'Video Vote, Funniest Post, Caption This, Hot Takes, and Predict — five separate competitions daily.' },
    ],
  },
  {
    id: 'prizes',
    icon: '🎁',
    title: 'Prize Rules',
    color: 'from-green-500/10 to-green-600/5 border-green-500/20',
    accent: 'text-green-400',
    items: [
      { label: 'Weekly reset', desc: 'The leaderboard resets every Monday at 00:00 UTC. Points do not carry over between weeks.' },
      { label: 'Top 3 win', desc: 'The top 3 players by weekly points each week win prizes.' },
      { label: '1st Place', desc: 'Cash prize (amount varies, announced weekly) + Verified badge.' },
      { label: '2nd Place', desc: 'Gift card + Verified badge.' },
      { label: '3rd Place', desc: 'Rival merchandise + Verified badge.' },
      { label: 'Eligibility', desc: 'You must have posted at least 1 video to be eligible for prizes. Accounts created via VPN or duplicate accounts are disqualified.' },
      { label: 'Claiming prizes', desc: 'Winners are contacted via the email used at signup within 48 hours of Monday reset. Prize must be claimed within 7 days.' },
    ],
  },
  {
    id: 'content',
    icon: '📋',
    title: 'Content Rules',
    color: 'from-red-500/10 to-red-600/5 border-red-500/20',
    accent: 'text-red-400',
    items: [
      { label: 'No hate speech', desc: 'Content targeting people based on race, religion, gender, sexuality, or nationality is strictly prohibited.' },
      { label: 'No nudity or explicit content', desc: 'All content must be suitable for a general audience. Sexually explicit or graphic material is not allowed.' },
      { label: 'No spam', desc: 'Posting the same content multiple times, flooding competitions with identical entries, or mass-voting rings violates these rules.' },
      { label: 'No harassment', desc: 'Personal attacks, doxing, threats, or targeted abuse of other users will result in immediate account removal.' },
      { label: 'No illegal content', desc: 'Content promoting illegal activities, piracy, or dangerous behaviour is prohibited.' },
      { label: 'Violations', desc: 'Minor violations result in content removal. Repeated or serious violations result in permanent account ban with no appeal.' },
    ],
  },
  {
    id: 'downloads',
    icon: '⬇️',
    title: 'Download Policy',
    color: 'from-blue-500/10 to-blue-600/5 border-blue-500/20',
    accent: 'text-blue-400',
    items: [
      { label: 'Personal use allowed', desc: 'Any user may download any video on Rival for personal use — saving for offline viewing, sharing with friends, etc.' },
      { label: 'No commercial use', desc: 'Downloaded videos may not be used for commercial purposes, re-uploaded to other platforms for monetisation, or modified and reposted without credit.' },
      { label: 'Creator rights', desc: 'Original creators retain full rights to their content. By uploading to Rival, you grant Rival a non-exclusive licence to display your content on the platform.' },
      { label: 'Download counter', desc: 'Rival tracks download counts per video. This data may be used for analytics and ranking.' },
    ],
  },
  {
    id: 'fairplay',
    icon: '⚖️',
    title: 'Fair Play',
    color: 'from-indigo-500/10 to-indigo-600/5 border-indigo-500/20',
    accent: 'text-indigo-400',
    items: [
      { label: 'One account per person', desc: 'Creating multiple accounts to accumulate points or votes is prohibited. Duplicate accounts will be permanently banned.' },
      { label: 'No vote manipulation', desc: 'Coordinating with others to vote for specific entries, using bots to vote, or purchasing votes is strictly forbidden.' },
      { label: 'No bots or automation', desc: 'Automated tools, scripts, or AI agents that interact with Rival on your behalf are not permitted.' },
      { label: 'No exploits', desc: 'Intentionally exploiting bugs or glitches to gain unfair points is prohibited. Report bugs to us instead.' },
      { label: 'Enforcement', desc: 'Rival reserves the right to ban any account for any reason related to fair play at our sole discretion.' },
    ],
  },
];

export default function RulesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          📋 Official Rules
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
          Rival <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Rules &amp; Guidelines</span>
        </h1>
        <p className="text-white/50 text-lg">
          Everything you need to know to compete, win, and play fair on Rival.
        </p>
      </div>

      {/* Quick nav */}
      <div className="flex flex-wrap gap-2 mb-10 p-4 rounded-2xl bg-white/5 border border-white/10">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="text-sm text-white/60 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all duration-200"
          >
            {s.icon} {s.title}
          </a>
        ))}
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {sections.map((section) => (
          <div
            key={section.id}
            id={section.id}
            className={`rounded-2xl border bg-gradient-to-br ${section.color} p-6 md:p-8`}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl">{section.icon}</span>
              <h2 className={`text-xl font-black ${section.accent}`}>{section.title}</h2>
            </div>
            <div className="space-y-4">
              {section.items.map((item) => (
                <div key={item.label} className="flex gap-4">
                  <div className={`${section.accent} font-bold text-sm min-w-[120px] shrink-0 pt-0.5`}>{item.label}</div>
                  <div className="text-white/60 text-sm leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="mt-12 text-center py-10 px-6 rounded-3xl bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/20">
        <h2 className="text-2xl font-black text-white mb-2">Ready to compete?</h2>
        <p className="text-white/50 mb-6">Now that you know the rules, go earn some points.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/signup" className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl transition-all duration-200 text-sm">
            Sign Up Free
          </Link>
          <Link href="/leaderboard" className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl transition-all duration-200 border border-white/10 text-sm">
            View Leaderboard
          </Link>
        </div>
      </div>
    </div>
  );
}
