import type { MetadataRoute } from 'next';
import { FLAT_NAV } from '@/lib/nav';
import { RELEASE } from '@/lib/release';

const BASE_URL = 'https://slipstreamui.com';

/**
 * Sitemap priorities encode what the site wants indexed first. `lastModified`
 * comes from release.json so every surface describes the same release instead
 * of every deploy looking like a full-content change.
 */
const LAST_UPDATED = new Date(RELEASE.releaseDate);

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly' }[] = [
  { path: '', priority: 1, changeFrequency: 'weekly' },
  { path: '/changelog', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/playground', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/accessibility', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
];

function priorityFor(href: string): number {
  if (href === '/docs') return 0.9;
  if (href === '/docs/getting-started' || href === '/docs/installation') return 0.85;
  if (href === '/docs/components') return 0.8;
  if (href.startsWith('/docs/components/')) return 0.6;
  if (href.startsWith('/docs/guides/')) return 0.7;
  return 0.6;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const seen = new Set<string>();

  const staticRoutes = STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: LAST_UPDATED,
    changeFrequency,
    priority,
  }));

  const docsRoutes = FLAT_NAV.filter((item) => {
    if (seen.has(item.href)) return false;
    seen.add(item.href);
    return item.href.startsWith('/');
  }).map((item) => ({
    url: `${BASE_URL}${item.href}`,
    lastModified: LAST_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: priorityFor(item.href),
  }));

  return [...staticRoutes, ...docsRoutes];
}
