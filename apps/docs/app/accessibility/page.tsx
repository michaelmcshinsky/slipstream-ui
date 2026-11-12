import type { Metadata } from 'next';
import { MarketingPage } from '@/components/site/marketing-page';
import { MarketingSections } from '@/components/site/marketing-sections';
import { JsonLd } from '@/components/site/json-ld';
import { webPageSchema } from '@/lib/structured-data';
import { withSeo } from '@/lib/seo';
import { getServerLocale, marketingVars } from '@/lib/i18n-server';
import { getMarketingCopy } from '@/lib/marketing';

export const metadata: Metadata = withSeo('/accessibility', {
  title: 'Accessibility',
  description:
    'Slipstream UI accessibility statement: target standard, how components and this site are tested, known limitations, and how to report a barrier.',
  alternates: { canonical: '/accessibility' },
});

export default async function AccessibilityPage() {
  const locale = await getServerLocale();
  const copy = getMarketingCopy(locale).accessibility;

  return (
    <>
      <JsonLd
        data={webPageSchema({
          type: 'WebPage',
          name: 'Accessibility statement',
          description:
            'Slipstream UI accessibility statement: target standard, how components and this site are tested, known limitations, and how to report a barrier.',
          path: '/accessibility',
        })}
      />
      <MarketingPage title={copy.title} description={copy.description} updated={copy.updated}>
        <MarketingSections sections={copy.sections} vars={marketingVars()} />
      </MarketingPage>
    </>
  );
}
