import type { Metadata } from 'next';
import Link from 'next/link';
import { AI_COMPONENT_COUNT, COMPONENT_COUNT, CORE_COMPONENT_COUNT } from '@/lib/component-count';
import { VERSION } from '@/lib/version';
import { JsonLd } from '@/components/site/json-ld';
import { DocsProse, DocsProseInline } from '@/components/docs-prose';
import { techArticleSchema } from '@/lib/structured-data';
import { withSeo } from '@/lib/seo';
import { getServerLocale } from '@/lib/i18n-server';
import { getDocsPageCopy } from '@/lib/docs-copy';

export const metadata: Metadata = withSeo('/docs', {
  title: 'Documentation',
  description: `Slipstream UI documentation: the AI-first React component library where every one of ${COMPONENT_COUNT} components ships a machine-readable COMPONENT_MANIFEST, an MCP server, and a usage validator.`,
});

export default async function DocsPage() {
  const locale = await getServerLocale();
  const copy = getDocsPageCopy('introduction', locale);
  const vars = {
    componentCount: COMPONENT_COUNT,
    coreComponentCount: CORE_COMPONENT_COUNT,
    aiComponentCount: AI_COMPONENT_COUNT,
  };

  return (
    <div>
      <JsonLd
        data={techArticleSchema({
          title: 'Slipstream UI documentation',
          description: `Slipstream UI documentation: the AI-first React component library where every one of ${COMPONENT_COUNT} components ships a machine-readable COMPONENT_MANIFEST, an MCP server, and a usage validator.`,
          path: '/docs',
          section: 'Getting started',
        })}
      />
      <div className="mb-8 flex flex-wrap items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm">
        <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 font-mono text-xs font-medium text-primary">
          v{VERSION}
        </span>
        <span className="text-muted-foreground">
          <DocsProseInline parts={copy.banner ?? []} vars={vars} />
        </span>
        <Link
          href="/changelog"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
        >
          {copy.whatsNew}
        </Link>
      </div>
      <h1 className="scroll-m-20 text-3xl font-bold tracking-tight sm:text-4xl">{copy.title}</h1>
      <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
        <DocsProseInline parts={copy.lead} vars={vars} />
      </p>
      <DocsProse blocks={copy.blocks} vars={vars} />
    </div>
  );
}
