import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import metadata from '../content/articles.json';
import { ARTICLE_CONTENT } from './article-content.generated';
import { ARTICLES, articlePath, firstHeading, getArticle } from './articles';

describe('article content', () => {
  it('ships the published article set with unique slugs and paths', () => {
    expect(ARTICLES.length).toBeGreaterThanOrEqual(2);
    const slugs = ARTICLES.map((article) => article.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const article of ARTICLES) {
      expect(articlePath(article.slug)).toBe(`/articles/${article.slug}`);
      expect(getArticle(article.slug)?.title).toBe(article.title);
    }
  });

  it('keeps metadata titles aligned with the markdown H1', () => {
    for (const article of ARTICLES) {
      expect(firstHeading(article.content)).toBe(article.title);
    }
  });

  it('strips the H1 and byline from the page body', () => {
    for (const article of ARTICLES) {
      expect(article.body.startsWith('#')).toBe(false);
      expect(article.body.startsWith('*Published')).toBe(false);
      expect(article.body.length).toBeGreaterThan(200);
    }
  });

  it('returns undefined for an unknown slug', () => {
    expect(getArticle('does-not-exist')).toBeUndefined();
  });

  it('keeps the generated content module in sync with the markdown files', () => {
    // The docs Worker has no filesystem, so lib/articles.ts reads the
    // generated module instead of content/articles/*.md. This test is the
    // drift gate: regenerate with `pnpm generate:article-content`.
    const dir = path.join(process.cwd(), 'content', 'articles');
    for (const meta of metadata as { slug: string; file: string }[]) {
      const onDisk = fs.readFileSync(path.join(dir, meta.file), 'utf8').replace(/\r\n/g, '\n');
      expect(ARTICLE_CONTENT[meta.slug], `stale generated content for ${meta.slug}`).toBe(onDisk);
    }
  });
});
