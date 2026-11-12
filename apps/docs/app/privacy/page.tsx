import type { Metadata } from 'next';
import { MarketingPage } from '@/components/site/marketing-page';
import { MarketingSections } from '@/components/site/marketing-sections';
import { JsonLd } from '@/components/site/json-ld';
import { webPageSchema } from '@/lib/structured-data';
import { withSeo } from '@/lib/seo';
import { getServerLocale, marketingVars } from '@/lib/i18n-server';
import { getMarketingCopy } from '@/lib/marketing';

export const metadata: Metadata = withSeo('/privacy', {
  title: 'Privacy policy',
  description:
    'What Slipstream UI stores on your device, what analytics we use (only with consent), how contact messages are handled, and how to exercise your privacy rights.',
  alternates: { canonical: '/privacy' },
});

export default async function PrivacyPage() {
  const locale = await getServerLocale();
  const copy = getMarketingCopy(locale).privacy;

  return (
    <>
      <JsonLd
        data={webPageSchema({
          type: 'PrivacyPolicy',
          name: 'Privacy policy',
          description:
            'What Slipstream UI stores on your device, what analytics we use (only with consent), how contact messages are handled, and how to exercise your privacy rights.',
          path: '/privacy',
        })}
      />
      <MarketingPage title={copy.title} description={copy.description} updated={copy.updated}>
        <MarketingSections sections={copy.sections} vars={marketingVars()} />
      </MarketingPage>
    </>
  );
}
