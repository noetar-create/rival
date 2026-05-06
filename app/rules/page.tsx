import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Official Rules & Competition Guidelines — Rival',
  description: 'Rival official competition rules: no purchase necessary, skill-based contests, prize eligibility, IRS disclosure, eligibility requirements, and community guidelines.',
  openGraph: {
    title: 'Official Rules — Rival',
    description: 'No purchase necessary to enter or win. Skill-based competitions. Full official rules, prize terms, and community guidelines.',
    url: 'https://rivalapp.io/rules',
  },
};

export default function RulesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          📋 Official Rules — Last updated May 2026
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
          Rival <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Official Rules</span>
        </h1>
        <p className="text-white/50 text-lg">
          Full official rules for all Rival competitions, prize terms, eligibility, and community guidelines.
        </p>
      </div>

      {/* NO PURCHASE NECESSARY — must be prominent */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 mb-8">
        <p className="text-green-300 font-black text-lg mb-1">NO PURCHASE NECESSARY TO ENTER OR WIN.</p>
        <p className="text-white/70 text-sm leading-relaxed">
          A purchase does not improve your chances of winning. Rival competitions are free to enter. Void where prohibited by law.
        </p>
      </div>

      {/* Quick nav */}
      <div className="flex flex-wrap gap-2 mb-10 p-4 rounded-2xl bg-white/5 border border-white/10 text-sm text-white/60">
        {[
          ['#legal', '⚖️ Legal Notice'],
          ['#eligibility', '✅ Eligibility'],
          ['#how-to-enter', '🎮 How to Enter'],
          ['#prizes', '🎁 Prizes & Tax'],
          ['#odds', '📊 Odds'],
          ['#points', '⚡ Points'],
          ['#competitions', '🏆 Competitions'],
          ['#content', '📋 Content Rules'],
          ['#fairplay', '🛡️ Fair Play'],
          ['#downloads', '⬇️ Downloads'],
        ].map(([href, label]) => (
          <a key={href} href={href} className="hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all duration-200">
            {label}
          </a>
        ))}
      </div>

      <div className="space-y-8">

        {/* ── LEGAL NOTICE ─────────────────────────────── */}
        <section id="legal" className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-purple-600/5 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-3xl">⚖️</span>
            <h2 className="text-xl font-black text-purple-400">Legal Notice & Sponsor</h2>
          </div>
          <div className="space-y-4 text-sm text-white/60 leading-relaxed">
            <p>
              <span className="text-white font-semibold">Sponsor:</span> Rival (&ldquo;Rival,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;), rivalapp.io. Contact: support@rivalapp.io.
            </p>
            <p>
              <span className="text-white font-semibold">Nature of competitions:</span> All Rival competitions are <strong className="text-white">skill-based contests</strong>, not lotteries or games of chance. Winners are determined by skill (game performance, typing speed, trivia accuracy, reaction time, memory, puzzle-solving) or by community vote on creative merit. No element of random chance determines the winner.
            </p>
            <p>
              <span className="text-white font-semibold">Free method of entry:</span> Entry into all Rival competitions is free. Users may earn points and compete in all games and creative competitions at no cost. No payment, subscription, or purchase is required or gives any competitive advantage.
            </p>
            <p>
              <span className="text-white font-semibold">Governing law:</span> These rules are governed by applicable federal and state laws. Rival competitions comply with applicable U.S. contest and sweepstakes regulations. These rules do not constitute an offer where prohibited.
            </p>
            <p>
              <span className="text-white font-semibold">Modification / cancellation:</span> Rival reserves the right to modify, suspend, or cancel any competition at any time if fraud, technical failure, or any event beyond Rival&apos;s control undermines the integrity of the competition. In such cases, prizes may be awarded to participants not implicated in the disqualifying event, at Rival&apos;s sole discretion.
            </p>
            <p>
              <span className="text-white font-semibold">Disputes:</span> All disputes regarding these rules or any competition result shall be resolved by Rival in its sole discretion. Rival&apos;s decisions are final and binding. By participating, you agree to release Rival and its agents from any and all liability related to participation.
            </p>
            <p className="text-white/40 text-xs">
              This information is provided for transparency and is not a substitute for legal advice. If you have questions about your specific circumstances, consult a qualified attorney.
            </p>
          </div>
        </section>

        {/* ── ELIGIBILITY ─────────────────────────────── */}
        <section id="eligibility" className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-blue-600/5 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-3xl">✅</span>
            <h2 className="text-xl font-black text-blue-400">Eligibility Requirements</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                label: 'Age',
                desc: 'You must be 18 years of age or older at the time of participation. By creating an account you confirm you meet this requirement.',
              },
              {
                label: 'Residence (for prize claims)',
                desc: 'Prize awards to residents of certain U.S. states and jurisdictions may be subject to additional legal requirements. Residents of states where prize competitions of this type are prohibited by law are not eligible to claim prizes. Prize winners in Florida and New York for prizes exceeding $5,000 may be subject to additional registration requirements. Rival reserves the right to withhold prize delivery pending verification of eligibility.',
              },
              {
                label: 'Geographic scope',
                desc: 'Rival is open to participants worldwide for playing games and earning points. Prize eligibility for cash or physical prizes may be restricted by jurisdiction. Void where prohibited by applicable law.',
              },
              {
                label: 'One account per person',
                desc: 'Each individual may maintain only one Rival account. Operating multiple accounts to accumulate points or compete against yourself is prohibited and results in permanent disqualification.',
              },
              {
                label: 'Employees excluded from prizes',
                desc: 'Employees, contractors, and immediate family members of Rival are not eligible for weekly prizes.',
              },
              {
                label: 'Active account requirement',
                desc: 'Prize winners must have posted at least one video to the Rival feed during the prize week. Accounts created solely to collect prizes or with no genuine engagement will be disqualified.',
              },
            ].map(item => (
              <div key={item.label} className="flex gap-4">
                <div className="text-blue-400 font-bold text-sm min-w-[160px] shrink-0 pt-0.5">{item.label}</div>
                <div className="text-white/60 text-sm leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW TO ENTER ─────────────────────────────── */}
        <section id="how-to-enter" className="rounded-2xl border border-pink-500/20 bg-gradient-to-br from-pink-500/10 to-pink-600/5 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-3xl">🎮</span>
            <h2 className="text-xl font-black text-pink-400">How to Enter & How Winners Are Determined</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                label: 'Free entry',
                desc: 'Create a free Rival account at rivalapp.io. No credit card or payment is required. This is the only method of entry.',
              },
              {
                label: 'Skill-based games',
                desc: 'Points are earned by demonstrating skill in timed challenges: typing speed (words per minute), trivia accuracy, reaction time (milliseconds), memory recall, emoji puzzle-solving, spot-the-difference, and chess tactics. Each game has a defined pass threshold. Points are awarded only to participants who meet the threshold through their own skill.',
              },
              {
                label: 'Creative competitions',
                desc: 'Five daily creative competitions (Video Vote, Funniest Post, Caption Contest, Hot Takes, Predict) are judged by community vote among eligible users. Winner is the entry with the highest vote total at end of the competition day (midnight UTC). In the event of a tie, points are awarded to all tied entries.',
              },
              {
                label: 'Weekly leaderboard',
                desc: 'The participant with the highest cumulative point total across all games and competitions during the calendar week (Monday 00:00 UTC through Sunday 23:59 UTC) is the weekly winner. Second and third place prizes are awarded to the next two highest point totals.',
              },
              {
                label: 'Winner determination',
                desc: 'Winners are determined solely by their point total, which reflects their skill performance and community engagement over the week. No element of random selection is used.',
              },
            ].map(item => (
              <div key={item.label} className="flex gap-4">
                <div className="text-pink-400 font-bold text-sm min-w-[160px] shrink-0 pt-0.5">{item.label}</div>
                <div className="text-white/60 text-sm leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PRIZES & TAX ─────────────────────────────── */}
        <section id="prizes" className="rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-600/5 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-3xl">🎁</span>
            <h2 className="text-xl font-black text-green-400">Prizes, Taxes & Claiming</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                label: 'Weekly prizes',
                desc: '1st Place: Cash prize (amount announced weekly on the leaderboard page) + Verified badge. 2nd Place: Gift card + Verified badge. 3rd Place: Rival merchandise + Verified badge.',
              },
              {
                label: 'Prize notification',
                desc: 'Winners are notified via the email address on their Rival account within 48 hours of the Monday 00:00 UTC reset. If a winner does not respond within 7 calendar days, the prize is forfeited and may be awarded to the next eligible participant.',
              },
              {
                label: 'Verification required',
                desc: 'Winners may be required to complete an Affidavit of Eligibility and a Liability/Publicity Release as a condition of receiving their prize. Failure to complete and return these documents within the required time forfeits the prize.',
              },
              {
                label: 'Tax responsibility — prizes under $600',
                desc: 'Winners are solely responsible for all applicable federal, state, and local taxes on prizes received.',
              },
              {
                label: 'Tax reporting — prizes $600 or more (IRS)',
                desc: 'For prizes with a fair market value of $600 or more, Rival is required by U.S. law (IRC §74) to report the prize to the Internal Revenue Service (IRS). Winners of such prizes must provide a completed IRS Form W-9 (for U.S. residents) or IRS Form W-8BEN (for non-U.S. residents) before the prize can be delivered. Rival will issue an IRS Form 1099-MISC or equivalent where required. Failure to provide tax documentation forfeits the prize.',
              },
              {
                label: 'No substitution',
                desc: 'Prizes are non-transferable, non-assignable, and may not be redeemed for cash (except where the prize is already cash). Rival reserves the right to substitute a prize of equal or greater value if the announced prize is unavailable.',
              },
              {
                label: 'Disqualification',
                desc: 'Any winner found to have violated these rules, operated multiple accounts, or engaged in vote manipulation will be disqualified and the prize forfeited.',
              },
            ].map(item => (
              <div key={item.label} className="flex gap-4">
                <div className="text-green-400 font-bold text-sm min-w-[160px] shrink-0 pt-0.5">{item.label}</div>
                <div className="text-white/60 text-sm leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── ODDS ─────────────────────────────── */}
        <section id="odds" className="rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-3xl">📊</span>
            <h2 className="text-xl font-black text-yellow-400">Odds of Winning</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                label: 'Individual games',
                desc: 'The odds of earning a point in any individual game depend entirely on the skill of the participant. Each game has a defined skill threshold (e.g., 30+ WPM for typing). Any participant who meets the threshold earns a point. There is no cap on the number of point-earners per game.',
              },
              {
                label: 'Weekly prize',
                desc: 'The odds of winning the weekly prize depend on the total number of active participants in that week and their relative point totals. Odds cannot be predetermined. Generally: the more games you play, the more competitions you enter, and the better your scores, the higher your position on the leaderboard.',
              },
              {
                label: 'Improving your odds',
                desc: 'Playing all 7 daily games, entering all 5 creative competitions, and posting videos consistently gives you the maximum possible points per day. Participants who engage daily have a significantly higher chance of placing in the top 3 than those who participate once.',
              },
            ].map(item => (
              <div key={item.label} className="flex gap-4">
                <div className="text-yellow-400 font-bold text-sm min-w-[160px] shrink-0 pt-0.5">{item.label}</div>
                <div className="text-white/60 text-sm leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── POINTS SYSTEM ─────────────────────────────── */}
        <section id="points" className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-purple-600/5 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-3xl">⚡</span>
            <h2 className="text-xl font-black text-purple-400">Points System</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: '+1 point', desc: 'Meeting the skill threshold in any of the 7 daily mini-games.' },
              { label: '+2 points', desc: 'Playing all 7 different games in one calendar day (daily diversity bonus).' },
              { label: '+2 points', desc: 'Winning a daily creative competition (Video Vote, Funniest, Caption, Hot Takes, Predict).' },
              { label: '+5 points', desc: 'Referring a new user who creates a verified account via your referral link.' },
              { label: '+5 points', desc: 'New user signup bonus when joining via a valid referral link.' },
              { label: 'Weekly reset', desc: 'Points reset every Monday at 00:00 UTC. Points from prior weeks do not carry over.' },
            ].map(item => (
              <div key={item.label} className="flex gap-4">
                <div className="text-purple-400 font-bold text-sm min-w-[120px] shrink-0 pt-0.5">{item.label}</div>
                <div className="text-white/60 text-sm leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── COMPETITION RULES ─────────────────────────────── */}
        <section id="competitions" className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-orange-600/5 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-3xl">🏆</span>
            <h2 className="text-xl font-black text-orange-400">Daily Competition Rules</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: 'One entry per day', desc: 'One entry per competition type per calendar day. Entries reset at midnight UTC.' },
              { label: 'One vote per entry', desc: 'Each user may vote once per entry. You cannot vote for your own submission.' },
              { label: 'Community voting', desc: 'Creative competition winners are determined by community vote. Rival does not curate or influence vote rankings. The entry with the most votes at end of day wins. This is a judgment of creative merit by the community, not a random draw.' },
              { label: 'Rival discretion', desc: 'Rival reserves the right to remove entries that violate content rules before or after voting closes. If the top-voted entry is removed for violations, the prize is awarded to the next eligible entry.' },
              { label: 'Competition types', desc: 'Video Vote, Funniest Post, Caption Contest, Hot Takes, and Predict — five separate competitions run daily.' },
            ].map(item => (
              <div key={item.label} className="flex gap-4">
                <div className="text-orange-400 font-bold text-sm min-w-[160px] shrink-0 pt-0.5">{item.label}</div>
                <div className="text-white/60 text-sm leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CONTENT RULES ─────────────────────────────── */}
        <section id="content" className="rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/10 to-red-600/5 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-3xl">📋</span>
            <h2 className="text-xl font-black text-red-400">Content Rules</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: 'No hate speech', desc: 'Content targeting people based on race, religion, gender, sexuality, or nationality is strictly prohibited.' },
              { label: 'No explicit content', desc: 'All content must be suitable for a general audience. Sexually explicit or graphic material is not allowed.' },
              { label: 'No spam', desc: 'Posting the same content multiple times, flooding competitions with identical entries, or mass-voting rings violates these rules.' },
              { label: 'No harassment', desc: 'Personal attacks, doxing, threats, or targeted abuse of other users will result in immediate account removal.' },
              { label: 'No illegal content', desc: 'Content promoting illegal activities, piracy, or dangerous behaviour is prohibited.' },
              { label: 'Violations', desc: 'Minor violations result in content removal. Repeated or serious violations result in permanent account ban with no appeal.' },
            ].map(item => (
              <div key={item.label} className="flex gap-4">
                <div className="text-red-400 font-bold text-sm min-w-[160px] shrink-0 pt-0.5">{item.label}</div>
                <div className="text-white/60 text-sm leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAIR PLAY ─────────────────────────────── */}
        <section id="fairplay" className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-3xl">🛡️</span>
            <h2 className="text-xl font-black text-indigo-400">Fair Play</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: 'One account per person', desc: 'Creating multiple accounts to accumulate points or votes is prohibited. Duplicate accounts will be permanently banned and any associated prizes forfeited.' },
              { label: 'No vote manipulation', desc: 'Coordinating with others to vote for specific entries, using bots to vote, or purchasing votes is strictly forbidden and results in immediate disqualification.' },
              { label: 'No automation', desc: 'Automated tools, scripts, or AI agents that interact with Rival on your behalf are not permitted.' },
              { label: 'No exploits', desc: 'Intentionally exploiting bugs or glitches to gain unfair points is prohibited. Report bugs to us at support@rivalapp.io instead.' },
              { label: 'Enforcement', desc: 'Rival reserves the right to disqualify any account for any fair play violation at our sole discretion. Disqualified accounts forfeit all accumulated points and prizes.' },
            ].map(item => (
              <div key={item.label} className="flex gap-4">
                <div className="text-indigo-400 font-bold text-sm min-w-[160px] shrink-0 pt-0.5">{item.label}</div>
                <div className="text-white/60 text-sm leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── DOWNLOADS ─────────────────────────────── */}
        <section id="downloads" className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-blue-600/5 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-3xl">⬇️</span>
            <h2 className="text-xl font-black text-blue-400">Download Policy</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Personal use allowed', desc: 'Any user may download any video on Rival for personal use — saving for offline viewing, sharing with friends, etc.' },
              { label: 'No commercial use', desc: 'Downloaded videos may not be used for commercial purposes, re-uploaded to other platforms for monetisation, or modified and reposted without credit.' },
              { label: 'Creator rights', desc: 'Original creators retain full rights to their content. By uploading to Rival, you grant Rival a non-exclusive licence to display your content on the platform.' },
              { label: 'Download counter', desc: 'Rival tracks download counts per video. This data may be used for analytics and ranking.' },
            ].map(item => (
              <div key={item.label} className="flex gap-4">
                <div className="text-blue-400 font-bold text-sm min-w-[160px] shrink-0 pt-0.5">{item.label}</div>
                <div className="text-white/60 text-sm leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Legal footer */}
      <div className="mt-10 p-6 rounded-2xl bg-white/3 border border-white/10 text-white/30 text-xs leading-relaxed space-y-2">
        <p>
          <strong className="text-white/50">LEGAL DISCLAIMER:</strong> Rival competitions are skill-based contests. No purchase is necessary to enter or win. Void where prohibited by law. Open to participants 18 years of age or older. Prize eligibility may be subject to geographic restrictions and additional legal requirements depending on your jurisdiction.
        </p>
        <p>
          For prizes valued at $600 USD or more, Rival is required by U.S. law to collect IRS Form W-9 (or W-8BEN for non-U.S. residents) and issue a 1099-MISC or equivalent. Winners are solely responsible for all applicable taxes.
        </p>
        <p>
          These rules were last updated in May 2026. Rival reserves the right to update these rules at any time. Continued participation constitutes acceptance of the then-current rules. For questions, contact support@rivalapp.io.
        </p>
        <p>
          This document does not constitute legal advice. Consult a qualified attorney for jurisdiction-specific guidance.
        </p>
      </div>

      {/* Footer CTA */}
      <div className="mt-8 text-center py-10 px-6 rounded-3xl bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/20">
        <p className="text-green-400 font-bold text-sm mb-2">NO PURCHASE NECESSARY · FREE TO ENTER · SKILL-BASED</p>
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
