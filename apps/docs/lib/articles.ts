import metadata from '../content/articles.json';
import { ARTICLE_CONTENT } from './article-content.generated';

export type ArticleMeta = {
  slug: string;
  title: string;
  description: string;
  /** ISO 8601 publication date. */
  date: string;
  file: string;
  tags: string[];
};

export type Article = ArticleMeta & {
  /** Full markdown, including the title and byline. */
  content: string;
  /** Markdown without the leading H1 or published-byline, for the page body. */
  body: string;
  /** Approximate reading time at 200 wpm, minimum 1 minute. */
  readingMinutes: number;
};

/** Metadata safe to serialize into client components (no markdown bodies). */
export type ArticleSummary = ArticleMeta & { readingMinutes: number };

function load(meta: ArticleMeta): Article {
  // Markdown is inlined by scripts/generate-article-content.ts: the docs
  // deploy target is a Cloudflare Worker with no content/ directory, so a
  // runtime fs read would 500 every /articles route.
  const content = ARTICLE_CONTENT[meta.slug];
  if (content === undefined) {
    throw new Error(`No generated content for article "${meta.slug}" — run pnpm generate:article-content`);
  }
  const body = content
    .replace(/^#\s+.+\n+/, '')
    .replace(/^\*Published[^\n]*\*\n+/, '')
    .trimStart();
  const readingMinutes = Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 200));
  return { ...meta, content, body, readingMinutes };
}

const seen = new Set<string>();
for (const article of metadata as ArticleMeta[]) {
  if (seen.has(article.slug)) throw new Error(`Duplicate article slug: ${article.slug}`);
  seen.add(article.slug);
}

/** Newest first. The index page, sitemap and JSON-LD all read this order. */
export const ARTICLES: Article[] = (metadata as ArticleMeta[])
  .slice()
  .sort((a, b) => b.date.localeCompare(a.date))
  .map(load);

/** Strip an article down to the metadata safe for client components. */
export function toArticleSummary(article: Article): ArticleSummary {
  const { slug, title, description, date, file, tags, readingMinutes } = article;
  return { slug, title, description, date, file, tags, readingMinutes };
}

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}

export function articlePath(slug: string): string {
  return `/articles/${slug}`;
}

/** First heading in the markdown, used by a test to catch metadata drift. */
export function firstHeading(markdown: string): string | undefined {
  const match = /^#\s+(.+)$/m.exec(markdown);
  return match?.[1].trim();
}
