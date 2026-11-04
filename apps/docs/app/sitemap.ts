import type { MetadataRoute } from 'next';
import { FLAT_NAV } from '@/lib/nav';

const BASE_URL = 'https://slipstreamui.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const LAST_UPDATED = new Date('2026-11-04');
  const staticRoutes = ['', '/changelog', '/contact', '/privacy', '/terms', '/llm/index.md'].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: LAST_UPDATED,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : route === '/changelog' || route === '/contact' ? 0.7 : 0.4,
  }));

  const docsRoutes = FLAT_NAV.map((item) => ({
    url: `${BASE_URL}${item.href}`,
    lastModified: LAST_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: item.href.endsWith('/components') ? 0.8 : 0.5,
  }));

  return [...staticRoutes, ...docsRoutes];
}
