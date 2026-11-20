import type { Metadata } from 'next';
import HomePage from '@/components/site/home-page';
import { JsonLd } from '@/components/site/json-ld';
import { faqSchema, softwareApplicationSchema } from '@/lib/structured-data';
import { HOME_EXTRAS } from '@/lib/marketing/home-extras';
import { withSeo } from '@/lib/seo';
import { getServerLocale } from '@/lib/i18n-server';
import { getMarketingCopy } from '@/lib/marketing';

export const metadata: Metadata = withSeo('/', {
  // Absolute so the layout's "%s · Slipstream UI" template doesn't double the brand.
  title: { absolute: 'Slipstream UI: the AI-first React component library' },
  description:
    'AI-native React components with machine-readable specs, an MCP server, and a usage validator. Stateless, accessible, Tailwind-native: your AI writes correct UI the first time.',
  alternates: { canonical: '/' },
});

export default async function Page() {
  const locale = await getServerLocale();
  const copy = getMarketingCopy(locale).home;

  return (
    <>
      <JsonLd data={softwareApplicationSchema()} />
      <JsonLd data={faqSchema(HOME_EXTRAS.faq.items)} />
      <HomePage copy={copy} />
    </>
  );
}
