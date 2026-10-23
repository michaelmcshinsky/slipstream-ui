import type { MetadataRoute } from 'next';
import { FLAT_NAV } from '@/lib/nav';

const BASE_URL = 'https://slipstreamui.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/changelog'].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.6,
  }));

  const docsRoutes = FLAT_NAV.map((item) => ({
    url: `${BASE_URL}${item.href}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: item.href.endsWith('/components') ? 0.8 : 0.5,
  }));

  return [...staticRoutes, ...docsRoutes];
}
