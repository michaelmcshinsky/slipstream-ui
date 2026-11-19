import fs from 'node:fs';
import path from 'node:path';
import metadata from '../content/articles.json';

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

/**
 * Resolve the content directory from either the docs app cwd (Next build,
 * vitest) or the repo root (scripts and ad-hoc Node runs).
 */
function contentDir(): string {
  const candidates = [
    path.join(process.cwd(), 'content', 'articles'),
    path.join(process.cwd(), 'apps', 'docs', 'content', 'articles'),
  ];
  const found = candidates.find((candidate) => fs.existsSync(candidate));
  if (!found) {
    throw new Error(`Article content directory not found. Tried:\n${candidates.join('\n')}`);
  }
  return found;
}

function load(meta: ArticleMeta): Article {
  const filePath = path.join(contentDir(), meta.file);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Article file missing for "${meta.slug}": ${filePath}`);
  }
  const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
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
