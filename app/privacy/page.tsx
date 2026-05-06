import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Rival',
  description: 'Read the Rival privacy policy to understand how we collect, use, and protect your data.',
  openGraph: {
    title: 'Privacy Policy | Rival',
    description: 'Read the Rival privacy policy.',
    url: 'https://rivalapp.io/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black text-white mb-2">Privacy Policy</h1>
      <p className="text-white/40 text-sm mb-10">Last updated: May 2026</p>

      {[
        {
          title: '1. Information We Collect',
          content: `When you create an account on Rival (rivalapp.io), we collect your username, email address, and a securely hashed version of your password. We do not store your plain-text password. When you use Rival, we also collect usage data such as games played, competition entries, videos uploaded, votes cast, and points earned. This data is used solely to operate the platform and power the leaderboard.`,
        },
        {
          title: '2. How We Use Your Information',
          content: `We use your information to provide and improve the Rival platform, to operate the weekly leaderboard and prize system, to communicate with you about your account or prizes, and to prevent fraud and abuse. We do not sell your personal data to third parties. We do not use your data for targeted advertising without your consent.`,
        },
        {
          title: '3. Cookies',
          content: `Rival uses a single authentication cookie (rival_token) to keep you logged in. This cookie is HttpOnly and cannot be accessed by JavaScript. It expires after 30 days. We do not use third-party tracking cookies. If you use Google AdSense on this site, Google may set its own cookies subject to Google's privacy policy.`,
        },
        {
          title: '4. Data Sharing',
          content: `We share your data only with service providers necessary to operate the platform, including our hosting provider (Railway) and content delivery services. We may disclose your data if required by law or to protect the rights, safety, or property of Rival or its users.`,
        },
        {
          title: '5. Data Retention',
          content: `We retain your account data for as long as your account is active. If you delete your account, we will delete your personal data within 30 days. Game results, competition entries, and points history may be retained in anonymized form for platform analytics.`,
        },
        {
          title: '6. Your Rights',
          content: `You have the right to access, correct, or delete your personal data at any time. To request data access or deletion, contact us at privacy@rivalapp.io. We will respond within 30 days.`,
        },
        {
          title: '7. Children\'s Privacy',
          content: `Rival is not intended for users under the age of 13. We do not knowingly collect personal data from children under 13. If we become aware that we have collected such data, we will delete it immediately.`,
        },
        {
          title: '8. Security',
          content: `We use industry-standard security measures to protect your data, including HTTPS encryption, hashed passwords, and HttpOnly cookies. No system is 100% secure, but we take reasonable steps to protect your information from unauthorized access.`,
        },
        {
          title: '9. Changes to This Policy',
          content: `We may update this privacy policy from time to time. We will notify you of significant changes by posting a notice on the platform. Your continued use of Rival after changes constitutes acceptance of the updated policy.`,
        },
        {
          title: '10. Contact',
          content: `If you have any questions about this privacy policy, contact us at privacy@rivalapp.io.`,
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
