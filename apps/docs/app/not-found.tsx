import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/site/navbar';
import { Footer } from '@/components/site/footer';
import { getServerI18n } from '@/lib/i18n-server';

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'That page does not exist. Browse the Slipstream UI documentation or the component index instead.',
  robots: { index: false, follow: false },
};

export default async function NotFound() {
  const { t } = await getServerI18n();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <p className="mb-3 font-mono text-sm text-primary">404</p>
        <h1 className="text-4xl font-bold tracking-tight">{t('site.notFound.title')}</h1>
        <p className="mt-4 max-w-md text-muted-foreground">{t('site.notFound.description')}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t('site.notFound.home')}
          </Link>
          <Link
            href="/docs/components"
            className="inline-flex h-10 items-center rounded-md border border-border px-5 text-sm font-medium transition-colors hover:bg-accent"
          >
            {t('site.notFound.browse')}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
