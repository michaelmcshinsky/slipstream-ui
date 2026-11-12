import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingPage } from '@/components/site/marketing-page';
import { withSeo } from '@/lib/seo';
import { getServerI18n } from '@/lib/i18n-server';

export const metadata: Metadata = withSeo('/thank-you', {
  title: 'Message received',
  description: 'Thanks — your message reached the Slipstream UI maintainers.',
  robots: { index: false, follow: false },
});

export default async function ThankYouPage() {
  const { t } = await getServerI18n();

  return (
    <MarketingPage title={t('site.thankYou.title')} description={t('site.thankYou.description')}>
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">{t('site.thankYou.nextHeading')}</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-6">
          <li>{t('site.thankYou.step1')}</li>
          <li>{t('site.thankYou.step2')}</li>
          <li>{t('site.thankYou.step3')}</li>
        </ol>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/docs"
          className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {t('site.thankYou.readDocs')}
        </Link>
        <Link
          href="/docs/components"
          className="inline-flex h-10 items-center rounded-md border border-border px-5 text-sm font-medium hover:bg-accent"
        >
          {t('site.thankYou.browse')}
        </Link>
        <Link
          href="/"
          className="inline-flex h-10 items-center rounded-md px-5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          {t('site.thankYou.backHome')}
        </Link>
      </div>
    </MarketingPage>
  );
}
