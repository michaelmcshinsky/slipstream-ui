import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/site/navbar';
import { MobileNav } from '@/components/site/mobile-nav';
import { Footer } from '@/components/site/footer';
import { JsonLd } from '@/components/site/json-ld';
import { ARTICLES, articlePath, getArticle } from '@/lib/articles';
import { MarkdownContent } from '@/lib/markdown';
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

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

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
      <div className="px-4">
        <MobileNav />
      </div>
      <main id="main" className="container mx-auto px-4 py-12 sm:py-16">
        <article className="mx-auto max-w-3xl">
          <Link href="/articles" className="text-sm text-muted-foreground hover:text-foreground">
            ← All articles
          </Link>
          <header className="mt-6 border-b border-border pb-6">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <time dateTime={article.date}>{article.date}</time>
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
              >
                benchmarks/
              </a>{' '}
              and the methodology is in{' '}
              <a
                href="https://github.com/michaelmcshinsky/slipstream-ui/blob/main/docs/benchmarks.md"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                docs/benchmarks.md
              </a>
              .
            </p>
            <Link href="/docs/ai-first" className="mt-3 inline-flex text-sm font-medium text-primary hover:underline">
              How the manifest and validator work →
            </Link>
          </footer>
        </article>
      </main>
      <Footer />
    </div>
  );
}
