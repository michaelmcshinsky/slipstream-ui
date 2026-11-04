import type { MetadataRoute } from 'next';

// Private product surface: keep it out of search indexes.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', disallow: '/' },
  };
}
