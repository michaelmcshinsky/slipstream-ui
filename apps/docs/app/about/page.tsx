import type { Metadata } from 'next';
import { MarketingPage } from '@/components/site/marketing-page';
import { MarketingSections } from '@/components/site/marketing-sections';
import { JsonLd } from '@/components/site/json-ld';
import { webPageSchema } from '@/lib/structured-data';
import { withSeo } from '@/lib/seo';
import { getServerLocale, marketingVars } from '@/lib/i18n-server';
import { getMarketingCopy } from '@/lib/marketing';

export const metadata: Metadata = withSeo('/about', {
  title: 'About',
  description:
    'Who builds Slipstream UI, why it exists, and the engineering principles behind manifests, the MCP server, and the usage validator.',
  alternates: { canonical: '/about' },
});

export default async function AboutPage() {
  const locale = await getServerLocale();
  const copy = getMarketingCopy(locale).about;

  return (
    <>
      <JsonLd
        data={webPageSchema({
          type: 'AboutPage',
          name: 'About Slipstream UI',
          description:
            'Who builds Slipstream UI, why it exists, and the engineering principles behind manifests, the MCP server, and the usage validator.',
          path: '/about',
        })}
      />
      <MarketingPage title={copy.title} description={copy.description} updated={copy.updated}>
        <MarketingSections sections={copy.sections} vars={marketingVars()} />
      </MarketingPage>
    </>
  );
}
