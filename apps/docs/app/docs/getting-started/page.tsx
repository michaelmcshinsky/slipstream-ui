import type { Metadata } from 'next';
import { DocsProse, DocsProseInline } from '@/components/docs-prose';
import { COMPONENT_COUNT } from '@/lib/component-count';
import { getDocsPageCopy } from '@/lib/docs-copy';
import { getServerLocale } from '@/lib/i18n-server';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/getting-started', {
  title: 'Quickstart',
  description:
    'Go from an empty React app to a themed Slipstream UI screen and a working agent loop in five steps: install, theme, compose, verify, and connect the manifest tools.',
});

export default async function GettingStartedPage() {
  const locale = await getServerLocale();
  const copy = getDocsPageCopy('gettingStarted', locale);

  return (
    <div>
      <h1 className="scroll-m-20 text-3xl font-bold tracking-tight sm:text-4xl">{copy.title}</h1>
      <p className="mt-3 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        <DocsProseInline parts={copy.lead} vars={{ componentCount: COMPONENT_COUNT }} />
      </p>
      <DocsProse blocks={copy.blocks} vars={{ componentCount: COMPONENT_COUNT }} />
    </div>
  );
}
