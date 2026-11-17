import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/site/navbar';
import { MobileNav } from '@/components/site/mobile-nav';
import { Footer } from '@/components/site/footer';
import { JsonLd } from '@/components/site/json-ld';
import { ARTICLES, articlePath } from '@/lib/articles';
import { webPageSchema } from '@/lib/structured-data';
import { withSeo } from '@/lib/seo';

const description =
  'Technical writing from the Slipstream UI project: validation benchmarks, agent workflows, machine-readable manifests, and honest notes on what static validation can and cannot catch.';

export const metadata: Metadata = withSeo('/articles', {
  title: 'Articles',
  description,
});

export default function ArticlesPage() {
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

          <div className="mt-10 space-y-5">
            {ARTICLES.map((article) => (
              <article key={article.slug} className="rounded-xl border border-border bg-card p-6">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <time dateTime={article.date}>{article.date}</time>
                  {article.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-border px-2 py-0.5">
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="mt-2 text-xl font-semibold tracking-tight">
                  <Link href={articlePath(article.slug)} className="hover:text-primary">
                    {article.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{article.description}</p>
                <Link
                  href={articlePath(article.slug)}
                  className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
                >
                  Read the article →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
