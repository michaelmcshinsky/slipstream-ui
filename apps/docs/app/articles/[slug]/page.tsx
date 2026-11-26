import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/site/navbar';
import { MobileNav } from '@/components/site/mobile-nav';
import { Footer } from '@/components/site/footer';
import { ArticleEngagement } from '@/components/site/article-engagement';
import { JsonLd } from '@/components/site/json-ld';
import { ARTICLES, articlePath, getArticle } from '@/lib/articles';
import { MarkdownContent, parseMarkdown } from '@/lib/markdown';
import { articleSchema } from '@/lib/structured-data';
import { withSeo } from '@/lib/seo';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return withSeo('/articles', { title: 'Article not found' });
  return withSeo(articlePath(article.slug), {
    title: article.title,
    description: article.description,
    openGraph: {
      type: 'article',
      publishedTime: article.date,
      modifiedTime: article.date,
      tags: article.tags,
    },
  });
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const headings = parseMarkdown(article.body)
    .flatMap((block) =>
      block.type === 'heading' && (block.level === 2 || block.level === 3)
        ? [{ id: block.id, text: block.text, level: block.level }]
        : []
    );

  const index = ARTICLES.findIndex((a) => a.slug === article.slug);
  const newer = index > 0 ? ARTICLES[index - 1] : undefined;
  const older = index >= 0 && index < ARTICLES.length - 1 ? ARTICLES[index + 1] : undefined;

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={articleSchema({
          headline: article.title,
          description: article.description,
          path: articlePath(article.slug),
          dateModified: article.date,
        })}
      />
      <Navbar />
      <ArticleEngagement slug={article.slug} />
      <div className="px-4">
        <MobileNav />
      </div>
      <main id="main" className="container mx-auto px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-12">
          <article className="min-w-0 max-w-3xl">
            <Link href="/articles" className="text-sm text-muted-foreground hover:text-foreground">
              ← All articles
            </Link>
            <header className="mt-6 border-b border-border pb-6">
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
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{article.title}</h1>
              <p className="mt-3 text-lg text-muted-foreground">{article.description}</p>
            </header>
            <MarkdownContent markdown={article.body} className="mt-8" />
            <footer className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
              <p>
                Run the claims yourself: the benchmark harness is in{' '}
                <a
                  href="https://github.com/michaelmcshinsky/slipstream-ui/tree/main/benchmarks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                ><span className="sr-only"> (opens in new tab)</span>
                  benchmarks/
                </a>{' '}
                and the methodology is in{' '}
                <a
                  href="https://github.com/michaelmcshinsky/slipstream-ui/blob/main/docs/benchmarks.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                ><span className="sr-only"> (opens in new tab)</span>
                  docs/benchmarks.md
                </a>
                .
              </p>
              <Link href="/docs/ai-first" className="mt-3 inline-flex text-sm font-medium text-primary hover:underline">
                How the manifest and validator work →
              </Link>
            </footer>

            {(newer || older) && (
              <nav aria-label="More articles" className="mt-10 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
                {newer ? (
                  <Link href={articlePath(newer.slug)} className="group rounded-lg border border-border p-4 hover:border-primary/50">
                    <span className="text-xs text-muted-foreground">← Newer</span>
                    <span className="mt-1 block text-sm font-medium group-hover:text-primary">{newer.title}</span>
                  </Link>
                ) : (
                  <span />
                )}
                {older ? (
                  <Link href={articlePath(older.slug)} className="group rounded-lg border border-border p-4 text-right hover:border-primary/50 sm:col-start-2">
                    <span className="text-xs text-muted-foreground">Older →</span>
                    <span className="mt-1 block text-sm font-medium group-hover:text-primary">{older.title}</span>
                  </Link>
                ) : null}
              </nav>
            )}
          </article>

          {headings.length > 0 && (
            <aside className="mt-10 lg:mt-0">
              <details className="rounded-lg border border-border p-4 lg:hidden">
                <summary className="cursor-pointer text-sm font-medium">On this page</summary>
                <ul className="mt-3 space-y-2 text-sm">
                  {headings.map((h) => (
                    <li key={h.id} className={h.level === 3 ? 'pl-3' : ''}>
                      <a href={`#${h.id}`} className="text-muted-foreground hover:text-foreground">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
              <nav aria-label="Table of contents" className="sticky top-24 hidden lg:block">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">On this page</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {headings.map((h) => (
                    <li key={h.id} className={h.level === 3 ? 'pl-3' : ''}>
                      <a href={`#${h.id}`} className="text-muted-foreground hover:text-foreground">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
