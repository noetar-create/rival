import { MetadataRoute } from 'next';

const BASE_URL = 'https://rivalapp.io';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE_URL, priority: 1.0, changeFrequency: 'daily' as const },
    { url: `${BASE_URL}/games`, priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${BASE_URL}/vote`, priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${BASE_URL}/funniest`, priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${BASE_URL}/caption`, priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${BASE_URL}/hottakes`, priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${BASE_URL}/predict`, priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${BASE_URL}/leaderboard`, priority: 0.8, changeFrequency: 'hourly' as const },
    { url: `${BASE_URL}/blog`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${BASE_URL}/upload`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${BASE_URL}/signup`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${BASE_URL}/login`, priority: 0.5, changeFrequency: 'monthly' as const },
  ];

  const blogSlugs = [
    'how-rival-is-changing-the-way-we-compete-online',
    'the-psychology-behind-why-we-cant-stop-competing',
    '10-tips-to-dominate-the-rival-weekly-leaderboard',
    'why-short-form-video-is-the-future-of-social-media',
    'the-rise-of-competitive-social-media',
    'how-daily-competitions-keep-you-sharp-the-science-of-brain-games',
    'from-viewer-to-winner-how-to-build-a-following-on-rival',
    'the-ultimate-guide-to-rivals-game-modes',
    'why-weekly-prizes-change-everything-about-social-media-engagement',
    'how-to-go-viral-on-rival-the-competition-advantage',
  ];

  const blogPages = blogSlugs.map(slug => ({
    url: `${BASE_URL}/blog/${slug}`,
    priority: 0.7,
    changeFrequency: 'monthly' as const,
  }));

  return [...staticPages, ...blogPages];
}
