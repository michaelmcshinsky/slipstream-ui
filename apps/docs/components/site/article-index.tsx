'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { ArticleSummary } from '@/lib/articles';

// lib/articles reads the filesystem at module load, so the path helper is
// inlined here for the client bundle.
function articleHref(slug: string): string {
  return `/articles/${slug}`;
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * Filterable list of article cards. Receives summaries only — the markdown
 * bodies stay on the server.
 */
export function ArticleIndex({ articles }: { articles: ArticleSummary[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const article of articles) {
      for (const tag of article.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [articles]);

  const visible = useMemo(
    () => (activeTag ? articles.filter((a) => a.tags.includes(activeTag)) : articles),
    [articles, activeTag]
  );

  return (
    <div>
      {tags.length > 1 && (
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter articles by tag">
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            aria-pressed={activeTag === null}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              activeTag === null
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
            }`}
          >
            All
          </button>
          {tags.map(([tag, count]) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              aria-pressed={activeTag === tag}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                activeTag === tag
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
              }`}
            >
              {tag}
              <span className="ml-1.5 opacity-70">{count}</span>
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">No articles with this tag yet.</p>
      ) : (
        <div className="mt-8 space-y-5">
          {visible.map((article) => (
            <article key={article.slug} className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-foreground/20">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <time dateTime={article.date}>{formatDate(article.date)}</time>
                <span aria-hidden="true">·</span>
                <span>{article.readingMinutes} min read</span>
                {article.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-border px-2 py-0.5">
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">
                <Link href={articleHref(article.slug)} className="hover:text-primary">
                  {article.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{article.description}</p>
              <Link
                href={articleHref(article.slug)}
                className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
              >
                Read the article →
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
