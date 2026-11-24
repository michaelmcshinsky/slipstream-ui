import type { Metadata } from 'next';
import Link from 'next/link';
import registryJson from '@/public/registry/all.json';
import { COMPONENT_COUNT } from '@/lib/component-count';
import { NAV_SECTIONS, navGroupLabel, type NavItem } from '@/lib/nav';
import { JsonLd } from '@/components/site/json-ld';
import { ComponentCatalog } from '@/components/component-catalog';
import type { CatalogGroup } from '@/lib/component-catalog';
import { componentCollectionSchema } from '@/lib/structured-data';
import { withSeo } from '@/lib/seo';
import { getServerI18n } from '@/lib/i18n-server';

export const metadata: Metadata = withSeo('/docs/components', {
  title: 'Components',
  description: `Browse all ${COMPONENT_COUNT} Slipstream UI components (core atoms and AI interaction molecules), with documentation, live demos, props, and accessibility notes.`,
});

type RegistryEntry = {
  tier?: string;
  description?: string;
};

/**
 * Registry index imported at build time so cards can show tier + description
 * without shipping the whole registry to the client. A static import (not a
 * runtime fs read) because the docs deploy target is a Cloudflare Worker with
 * no filesystem access to public/.
 */
const REGISTRY_INDEX: Record<string, RegistryEntry> = Object.fromEntries(
  (registryJson.components ?? []).map((component) => [
    component.id,
    { tier: component.tier, description: component.description },
  ])
);

function idFromHref(href: string): string {
  return href.slice(href.lastIndexOf('/') + 1);
}

export default async function ComponentsOverviewPage() {
  const { t } = await getServerI18n();
  const registry = REGISTRY_INDEX;
  const section = NAV_SECTIONS.find((s) => s.title === 'Components');
  const overview: NavItem | undefined = section?.items?.[0];
  const groups = section?.groups ?? [];

  const catalogGroups: CatalogGroup[] = groups.map((group) => ({
    title: navGroupLabel(group, t),
    items: group.items.map((item) => {
      const entry = registry[idFromHref(item.href)];
      return {
        label: item.label,
        href: item.href,
        tier: entry?.tier,
        description: entry?.description,
      };
    }),
  }));

  return (
    <div>
      <JsonLd
        data={componentCollectionSchema(
          groups.flatMap((group) => group.items.map((item) => ({ name: item.label, path: item.href })))
        )}
      />
      <h1 className="text-4xl font-bold mb-3">Components</h1>
      <p className="text-lg text-muted-foreground mb-2">
        All {COMPONENT_COUNT} components, grouped the same way as the sidebar. Pages pair a live
        playground with props tables, anti-patterns pulled from the manifest, accessibility notes
        and browser-support guidance where the manifest defines them.
      </p>
      <p className="mb-8 text-sm text-muted-foreground">
        Wiring a form? The{' '}
        <Link href="/docs/guides/react-hook-form" className="text-primary underline underline-offset-2">
          React Hook Form guide
        </Link>{' '}
        covers register(), Controller, and FormField error wiring.
      </p>
      <p className="text-sm text-muted-foreground mb-8">
        Install any of them via{' '}
        <code className="bg-muted px-2 py-1 rounded">npx @slipstream-ui/cli@latest add &lt;id&gt;</code> or the{' '}
        <Link href="/docs/installation" className="text-primary underline underline-offset-2 hover:text-primary/80">
          shadcn-compatible registry
        </Link>
        .
      </p>

      {overview && (
        <div className="mb-8">
          <Link
            href={overview.href}
            className="block rounded-lg border border-primary/40 bg-primary/5 p-4 transition-all hover:bg-primary/10"
          >
            <h2 className="font-semibold">{overview.label}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Gallery overview with install paths and tier notes for every group below.
            </p>
          </Link>
        </div>
      )}

      <ComponentCatalog groups={catalogGroups} total={COMPONENT_COUNT} />
    </div>
  );
}
