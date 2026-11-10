/**
 * One implementation of the per-route SEO surface.
 *
 * Every page already declares its own `title` and `description`; this helper
 * fills in the parts that are easy to forget and expensive to get wrong:
 * a self-referencing canonical, a complete Open Graph and Twitter card that
 * does NOT inherit the home page's, a large-image robots directive, and the
 * machine-readable alternates (`llms.txt`, per-component markdown) that let
 * agents read the canonical text instead of guessing from HTML.
 *
 * Usage:
 *   export const metadata: Metadata = withSeo('/about', {
 *     title: 'About',
 *     description: '...',
 *   });
 */
import type { Metadata } from 'next';
import { SITE } from './site';

const BRAND = 'Slipstream UI';
const BRAND_TITLE = 'Slipstream UI - the AI-first React component library';
const DEFAULT_DESCRIPTION =
  'Your AI already knows your design system. Every component ships a machine-readable manifest so Claude, Cursor, and Copilot generate correct UI the first time.';

const OG_IMAGE = {
  url: '/og.png',
  width: 1200,
  height: 630,
  alt: 'Slipstream UI - the AI-first React component library',
};

/**
 * Shared discovery targets. Search engines ignore these, but agent runtimes
 * (and the humans configuring them) use them to find the canonical corpus.
 */
export const AGENT_ALTERNATES: Record<string, string> = {
  'text/plain': '/llms.txt',
  'text/markdown': '/llm/index.md',
  'application/json': '/registry/all.json',
};

const BASE_KEYWORDS = [
  'AI components',
  'React component library',
  'AI-first React',
  'COMPONENT_MANIFEST',
  'MCP server',
  'shadcn registry',
  'Tailwind CSS',
  'design system',
  'AI coding agents',
  'Claude',
  'Cursor',
  'Copilot',
];

function canonicalPath(path: string): string {
  if (!path) return '/';
  const withLeading = path.startsWith('/') ? path : `/${path}`;
  return withLeading.length > 1 ? withLeading.replace(/\/+$/, '') : withLeading;
}

function titleText(title: Metadata['title']): string {
  if (typeof title === 'string') return title;
  if (title && typeof title === 'object') {
    if ('absolute' in title && title.absolute) return title.absolute;
    if ('default' in title && title.default) return title.default;
  }
  return BRAND_TITLE;
}

function socialTitle(title: Metadata['title'], path: string): string {
  const text = titleText(title);
  if (path === '/' || text === BRAND_TITLE) return BRAND_TITLE;
  // The root layout adds the brand via its title template; social cards get no
  // template, so add it here.
  return text.includes(BRAND) ? text : `${text} · ${BRAND}`;
}

function keywordList(keywords: Metadata['keywords']): string[] {
  const extra = typeof keywords === 'string' ? [keywords] : (keywords ?? []);
  return Array.from(new Set([...BASE_KEYWORDS, ...extra]));
}

export function withSeo(path: string, meta: Metadata = {}): Metadata {
  const route = canonicalPath(path);
  const description = typeof meta.description === 'string' ? meta.description : DEFAULT_DESCRIPTION;
  const social = socialTitle(meta.title, route);

  const existingAlternates = meta.alternates ?? {};
  // Cast through a loose record: the OpenGraph union has no single shape.
  const existingOpenGraph = (meta.openGraph ?? {}) as Record<string, unknown>;
  const existingTwitter = (meta.twitter ?? {}) as Record<string, unknown>;

  return {
    ...meta,
    keywords: keywordList(meta.keywords),
    alternates: {
      ...existingAlternates,
      // Next resolves this against metadataBase, so the same value works in
      // every environment.
      canonical: existingAlternates.canonical ?? route,
      types: {
        ...AGENT_ALTERNATES,
        ...(existingAlternates.types ?? {}),
      },
    },
    openGraph: {
      type: 'website',
      siteName: SITE.name,
      locale: 'en_US',
      ...existingOpenGraph,
      url: existingOpenGraph.url ?? route,
      title: existingOpenGraph.title ?? social,
      description: existingOpenGraph.description ?? description,
      images: existingOpenGraph.images ?? [OG_IMAGE],
    } as Metadata['openGraph'],
    twitter: {
      card: 'summary_large_image',
      ...existingTwitter,
      title: existingTwitter.title ?? social,
      description: existingTwitter.description ?? description,
      images: existingTwitter.images ?? [OG_IMAGE.url],
    } as Metadata['twitter'],
    robots: meta.robots ?? {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  };
}

/** Absolute URL for a route - used by JSON-LD builders and tests. */
export function absoluteUrl(path: string): string {
  return new URL(canonicalPath(path), SITE.url).toString();
}
