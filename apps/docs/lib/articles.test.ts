import { describe, expect, it } from 'vitest';
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
});
