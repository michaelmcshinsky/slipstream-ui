import type { Metadata } from 'next';
import fs from 'node:fs';
import path from 'node:path';
import Link from 'next/link';
import { COMPONENT_COUNT } from '@/lib/component-count';
import { NAV_SECTIONS, type NavItem } from '@/lib/nav';

export const metadata: Metadata = {
  title: 'Components',
  description: `Browse all ${COMPONENT_COUNT} Slipstream UI components — core atoms and AI interaction molecules — with documentation, live demos, props, and accessibility notes.`,
};

type RegistryEntry = {
  tier?: string;
  description?: string;
};

/**
 * Registry index read at build/render time so cards can show tier +
 * description without shipping the whole registry to the client. Falls
 * back to name-only cards if the generated file is missing.
 */
function loadRegistryIndex(): Record<string, RegistryEntry> {
  try {
    const file = path.join(process.cwd(), 'public', 'registry', 'all.json');
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8')) as {
      components?: { id: string; tier?: string; description?: string }[];
    };
    return Object.fromEntries(
      (parsed.components ?? []).map((component) => [
        component.id,
        { tier: component.tier, description: component.description },
      ])
    );
  } catch {
    return {};
  }
}

function idFromHref(href: string): string {
  return href.slice(href.lastIndexOf('/') + 1);
}

export default function ComponentsOverviewPage() {
  const registry = loadRegistryIndex();
  const section = NAV_SECTIONS.find((s) => s.title === 'Components');
  const overview: NavItem | undefined = section?.items?.[0];
  const groups = section?.groups ?? [];

  const renderCard = (item: NavItem) => {
    const entry = registry[idFromHref(item.href)];
    return (
      <Link
        key={item.href}
        href={item.href}
        className="block rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm"
      >
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold">{item.label}</h3>
          {entry?.tier && (
            <span className="shrink-0 rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {entry.tier}
            </span>
          )}
        </div>
        {entry?.description && (
          <p className="mt-1 text-sm text-muted-foreground">{entry.description}</p>
        )}
      </Link>
    );
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-3">Components</h1>
      <p className="text-lg text-muted-foreground mb-2">
        All {COMPONENT_COUNT} components, grouped the same way as the sidebar. Every page carries a
        live playground, props table, anti-patterns pulled from the manifest, accessibility notes,
        and a browser-support table.
      </p>
      <p className="text-sm text-muted-foreground mb-8">
        Install any of them via{' '}
        <code className="bg-muted px-2 py-1 rounded">npx slipstream-ui add &lt;id&gt;</code> or the{' '}
        <Link href="/docs/installation" className="text-primary hover:underline">
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

      <div className="space-y-10">
        {groups.map((group) => (
          <section key={group.title}>
            <h2 className="text-2xl font-semibold mb-1">{group.title}</h2>
            <p className="text-sm text-muted-foreground mb-4">
              {group.items.length} component{group.items.length === 1 ? '' : 's'}
            </p>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{group.items.map(renderCard)}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
