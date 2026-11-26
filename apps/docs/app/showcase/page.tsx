import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MarketingPage } from '@/components/site/marketing-page';
import { MarketingSections } from '@/components/site/marketing-sections';
import { JsonLd } from '@/components/site/json-ld';
import { webPageSchema } from '@/lib/structured-data';
import { withSeo } from '@/lib/seo';
import { getServerLocale, marketingVars } from '@/lib/i18n-server';
import { getShowcaseCopy } from '@/lib/marketing';

export const metadata: Metadata = withSeo('/showcase', {
  title: 'Showcase',
  description:
    'Production sites and apps running on @slipstream-ui components, themes, and the MCP server.',
  alternates: { canonical: '/showcase' },
});

export default async function ShowcasePage() {
  const locale = await getServerLocale();
  const copy = getShowcaseCopy(locale);
  if (!copy) notFound();

  return (
    <>
      <JsonLd
        data={webPageSchema({
          type: 'CollectionPage',
          name: 'Built with Slipstream',
          description:
            'Production sites and apps running on @slipstream-ui components, themes, and the MCP server.',
          path: '/showcase',
        })}
      />
      <MarketingPage title={copy.title} description={copy.description} updated={copy.updated}>
        <MarketingSections sections={copy.sections} vars={marketingVars()} />
      </MarketingPage>
    </>
  );
}
