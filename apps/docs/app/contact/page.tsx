import type { Metadata } from 'next';
import { MarketingPage } from '@/components/site/marketing-page';
import { RichText } from '@/components/site/marketing-sections';
import { JsonLd } from '@/components/site/json-ld';
import { webPageSchema } from '@/lib/structured-data';
import { SITE } from '@/lib/site';
import { withSeo } from '@/lib/seo';
import { getServerLocale } from '@/lib/i18n-server';
import { getMarketingCopy } from '@/lib/marketing';

const description =
  'Reach the Slipstream UI maintainers on GitHub: bug reports, questions, and security reports each have a dedicated channel.';

export const metadata: Metadata = withSeo('/contact', {
  title: 'Contact',
  description,
  alternates: { canonical: '/contact' },
});

function resolve(text: string): string {
  return text.replaceAll('{repo}', SITE.repo);
}

export default async function ContactPage() {
  const locale = await getServerLocale();
  const copy = getMarketingCopy(locale).contact;

  return (
    <>
      <JsonLd
        data={webPageSchema({
          type: 'ContactPage',
          name: 'Contact Slipstream UI',
          description,
          path: '/contact',
        })}
      />
      <MarketingPage title={copy.title} description={copy.description}>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {copy.channels.map((channel) => (
            <section key={channel.heading} className="flex flex-col rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground">{channel.heading}</h2>
              <div className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                <RichText text={resolve(channel.body)} />
              </div>
              {channel.ctaLabel && channel.ctaHref && (
                <a
                  href={resolve(channel.ctaHref)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {channel.ctaLabel}
                </a>
              )}
            </section>
          ))}
        </div>
      </MarketingPage>
    </>
  );
}
