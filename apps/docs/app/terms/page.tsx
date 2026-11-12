import type { Metadata } from 'next';
import { MarketingPage } from '@/components/site/marketing-page';
import { MarketingSections } from '@/components/site/marketing-sections';
import { JsonLd } from '@/components/site/json-ld';
import { webPageSchema } from '@/lib/structured-data';
import { withSeo } from '@/lib/seo';
import { getServerLocale, marketingVars } from '@/lib/i18n-server';
import { getMarketingCopy } from '@/lib/marketing';

export const metadata: Metadata = withSeo('/terms', {
  title: 'Terms of use',
  description:
    'Terms for using the Slipstream UI website and packages: MIT license, no warranty, acceptable use, and how to contact us.',
  alternates: { canonical: '/terms' },
});

export default async function TermsPage() {
  const locale = await getServerLocale();
  const copy = getMarketingCopy(locale).terms;

  return (
    <>
      <JsonLd
        data={webPageSchema({
          type: 'TermsOfService',
          name: 'Terms of use',
          description:
            'Terms for using the Slipstream UI website and packages: MIT license, no warranty, acceptable use, and how to contact us.',
          path: '/terms',
        })}
      />
      <MarketingPage title={copy.title} description={copy.description} updated={copy.updated}>
        <MarketingSections sections={copy.sections} vars={marketingVars()} />
      </MarketingPage>
    </>
  );
}
