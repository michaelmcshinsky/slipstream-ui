import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/site/navbar';
import { MobileNav } from '@/components/site/mobile-nav';
import { Footer } from '@/components/site/footer';
import { JsonLd } from '@/components/site/json-ld';
import { ArticleIndex } from '@/components/site/article-index';
import { ARTICLES, articlePath, toArticleSummary } from '@/lib/articles';
import { webPageSchema } from '@/lib/structured-data';
import { withSeo } from '@/lib/seo';

const description =
  'Technical writing from the Slipstream UI project: validation benchmarks, agent workflows, machine-readable manifests, and honest notes on what static validation can and cannot catch.';

export const metadata: Metadata = withSeo('/articles', {
  title: 'Articles',
  description,
});

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default function ArticlesPage() {
  const [featured, ...rest] = ARTICLES;
  const summaries = rest.map(toArticleSummary);

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={webPageSchema({
          type: 'CollectionPage',
          name: 'Slipstream UI articles',
          description,
          path: '/articles',
        })}
      />
      <Navbar />
      <div className="px-4">
        <MobileNav />
      </div>
      <main id="main" className="container mx-auto px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Writing</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">Articles</h1>
          <p className="mt-3 text-lg text-muted-foreground">{description}</p>

          {featured && (
            <Link
              href={articlePath(featured.slug)}
              className="group mt-10 block rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/50 sm:p-8"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">Latest</span>
                <time dateTime={featured.date}>{formatDate(featured.date)}</time>
                <span aria-hidden="true">·</span>
                <span>{featured.readingMinutes} min read</span>
              </div>
              <h2 className="mt-3 text-2xl font-bold tracking-tight group-hover:text-primary sm:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{featured.description}</p>
              <span className="mt-4 inline-flex text-sm font-medium text-primary">
                Read the article →
              </span>
            </Link>
          )}

          <ArticleIndex articles={summaries} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
