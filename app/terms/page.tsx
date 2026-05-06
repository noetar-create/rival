import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Rival',
  description: 'Read the Rival terms of service before using the platform.',
  openGraph: {
    title: 'Terms of Service | Rival',
    description: 'Read the Rival terms of service.',
    url: 'https://rivalapp.io/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black text-white mb-2">Terms of Service</h1>
      <p className="text-white/40 text-sm mb-10">Last updated: May 2026</p>

      {[
        {
          title: '1. Acceptance of Terms',
          content: `By creating an account or using Rival (rivalapp.io), you agree to these Terms of Service. If you do not agree, do not use the platform. We reserve the right to update these terms at any time. Continued use after updates constitutes acceptance.`,
        },
        {
          title: '2. Eligibility',
          content: `You must be at least 13 years old to use Rival. By using the platform, you represent that you meet this age requirement. Rival is not responsible for misrepresentation of age.`,
        },
        {
          title: '3. Your Account',
          content: `You are responsible for maintaining the security of your account credentials. You must not share your password with others. You are responsible for all activity that occurs under your account. Rival reserves the right to terminate accounts that violate these terms.`,
        },
        {
          title: '4. User Content',
          content: `You retain ownership of content you post to Rival (videos, captions, hot takes, predictions, etc.). By posting content, you grant Rival a non-exclusive, royalty-free license to display, distribute, and promote your content on the platform. You must not post content that is illegal, harmful, harassing, defamatory, or violates any third-party rights.`,
        },
        {
          title: '5. Prohibited Conduct',
          content: `You must not: use bots or automated tools to earn points or manipulate competitions; create multiple accounts to gain unfair advantage; harass, threaten, or harm other users; post spam, malware, or malicious content; attempt to hack or exploit the platform; misrepresent your identity or impersonate others.`,
        },
        {
          title: '6. Competitions and Prizes',
          content: `Rival operates weekly competitions with prizes awarded to top leaderboard performers. Rival reserves the right to verify winner eligibility and disqualify accounts found to be cheating or violating these terms. Prize details, amounts, and delivery methods are determined by Rival at its sole discretion. Prizes are non-transferable. Rival reserves the right to modify or discontinue prizes at any time.`,
        },
        {
          title: '7. Points System',
          content: `Points earned on Rival are for use within the platform's leaderboard system only. Points have no monetary value outside the platform's prize system. Rival reserves the right to adjust, reset, or revoke points at any time for any reason, including suspected cheating or policy violations.`,
        },
        {
          title: '8. Intellectual Property',
          content: `All platform code, design, branding, games, and original content created by Rival are the intellectual property of Rival. You may not copy, reproduce, or distribute any part of the platform without written permission.`,
        },
        {
          title: '9. Disclaimers',
          content: `Rival is provided "as is" without warranties of any kind. We do not guarantee that the platform will be available at all times or that competitions will be error-free. We are not responsible for any loss of data, points, or prizes due to technical issues.`,
        },
        {
          title: '10. Limitation of Liability',
          content: `To the fullest extent permitted by law, Rival shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform.`,
        },
        {
          title: '11. Termination',
          content: `Rival reserves the right to suspend or terminate your account at any time for violation of these terms, without notice or liability.`,
        },
        {
          title: '12. Contact',
          content: `For questions about these terms, contact us at legal@rivalapp.io.`,
        },
      ].map((section) => (
        <div key={section.title} className="mb-8">
          <h2 className="text-xl font-bold text-white mb-3">{section.title}</h2>
          <p className="text-white/60 leading-relaxed">{section.content}</p>
        </div>
      ))}
    </div>
  );
}
