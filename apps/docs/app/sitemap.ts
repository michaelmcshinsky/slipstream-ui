import type { MetadataRoute } from 'next';
import { FLAT_NAV } from '@/lib/nav';

const BASE_URL = 'https://slipstreamui.com';

/**
 * Sitemap priorities encode what the site wants indexed first. Everything is
 * listed with a stable, hand-bumped date; the alternative (build time) makes
 * every deploy look like a full-content change.
 */
const LAST_UPDATED = new Date('2026-11-10');

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly' }[] = [
  { path: '', priority: 1, changeFrequency: 'weekly' },
  { path: '/changelog', priority: 0.8, changeFrequency: 'weekly' },
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
