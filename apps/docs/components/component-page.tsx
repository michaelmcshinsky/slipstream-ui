'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CodeBlock } from '@slipstream-ui/ai';
import { InstallBox } from './install-box';
import { PropsTable } from './props-table';
import { JsonLd } from './site/json-ld';
import { techArticleSchema } from '@/lib/structured-data';
import { getNeighbors, FLAT_NAV } from '@/lib/nav';

export type ComponentPageProps = {
  /** Route/nav id, e.g. "sources" — drives pagination and the URL. */
  id: string;
  /**
   * COMPONENT_MANIFEST id when it differs from the route id — drives the
   * registry fetch, install commands, and /llm markdown link
   * (route "sources" -> manifest "source").
   */
  manifestId?: string;
  title: string;
  description: string;
  /** npm packages for the pnpm tab; defaults to core + ai. */
  npmPackages?: string;
  children: React.ReactNode;
  propsRows?: { name: string; type: string; defaultValue?: string; description: string }[];
  accessibility?: string[];
  /** Component-specific browser/progressive-enhancement notes. */
  browserNotes?: string[];
};

/**
 * A slice of the COMPONENT_MANIFEST served from /registry/<id>.json — only the
 * fields the human docs surface beyond the hand-written props table.
 */
type ManifestAntiPattern = { title?: string; explanation?: string; example?: string };
type ManifestCompositionRule = { component?: string; relationship?: string; example?: string };
type RegistryManifest = {
  antiPatterns?: ManifestAntiPattern[];
  compositionRules?: ManifestCompositionRule[];
  relatedComponents?: string[];
};

/** "MessageActions" / "InlineCitation" → route id used by /docs/components/<id>. */
function toComponentId(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

/** Doc routes that exist today — related-component links are gated on this. */
const COMPONENT_HREFS = new Set(
  FLAT_NAV.filter((item) => item.href.startsWith('/docs/components/')).map((item) => item.href)
);

/**
 * Fetches a component's manifest slice from /registry/<manifestId>.json.
 * Returns null while loading or when the file is absent — sections derived
 * from it simply do not render (graceful degradation).
 */
function useRegistryManifest(manifestId: string): RegistryManifest | null {
  const [manifest, setManifest] = useState<RegistryManifest | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/registry/${manifestId}.json`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: RegistryManifest | null) => {
        if (!cancelled && data) setManifest(data);
      })
      .catch(() => {
        // Registry file absent — render without the manifest-derived sections.
      });
    return () => {
      cancelled = true;
    };
  }, [manifestId]);

  return manifest;
}

/**
 * Standardized component docs scaffold (elements.ai.sdk.dev pattern):
 * title → lede → installer box → demos (children: DemoCards) →
 * props table → anti-patterns → accessibility → composition → prev/next.
 *
 * Anti-patterns and composition are fetched from the component's manifest at
 * /registry/<id>.json so the human docs always show the exact same rules the
 * MCP `validate_usage` tool enforces. Sections render only when the manifest
 * carries them; a missing registry file degrades silently to the older layout.
 */
export function ComponentPage({
  id,
  manifestId,
  title,
  description,
  npmPackages,
  children,
  propsRows,
  accessibility,
  browserNotes,
}: ComponentPageProps) {
  const { previous, next } = getNeighbors(`/docs/components/${id}`);
  const manifest = useRegistryManifest(manifestId ?? id);

  const antiPatterns = manifest?.antiPatterns ?? [];
  const compositionRules = manifest?.compositionRules ?? [];
  const related = (manifest?.relatedComponents ?? []).filter((name) =>
    COMPONENT_HREFS.has(`/docs/components/${toComponentId(name)}`)
  );

  return (
    <article>
      <JsonLd
        data={techArticleSchema({
          title: `${title} component`,
          description,
          path: `/docs/components/${id}`,
          section: 'Components',
        })}
      />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="scroll-m-20 text-3xl font-bold tracking-tight">{title}</h1>
        {/* Canonical markdown for agents — mirrors assistant-ui's .md convention. */}
        <a
          href={`/llm/components/${manifestId ?? id}.md`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1.5 inline-flex h-7 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title={`Canonical markdown reference at /llm/components/${manifestId ?? id}.md`}
        >
          <span aria-hidden="true">⧉</span> Markdown for agents
        </a>
      </div>
      <p className="mt-2 text-lg text-muted-foreground">{description}</p>

      <div className="mt-6">
        <InstallBox componentId={manifestId ?? id} npmPackages={npmPackages} />
      </div>

      <div className="mt-8 space-y-6">{children}</div>

      {propsRows && propsRows.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">Props</h2>
          <PropsTable rows={propsRows} />
        </section>
      )}

      {antiPatterns.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-2 text-xl font-semibold">Anti-patterns</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            The mistakes the <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">validate_usage</code>{' '}
            MCP tool rejects — same list agents see over MCP and in the canonical markdown.
          </p>
          <ul className="space-y-5">
            {antiPatterns.map((pattern, i) => (
              <li key={pattern.title ?? i} className="rounded-xl border border-border bg-card p-4">
                <p className="font-medium">{pattern.title ?? 'Avoid'}</p>
                {pattern.explanation && (
                  <p className="mt-1 text-sm text-muted-foreground">{pattern.explanation}</p>
                )}
                {pattern.example && (
                  <div className="mt-3">
                    <CodeBlock language="tsx" code={pattern.example} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {accessibility && accessibility.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">Accessibility</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm">
            {accessibility.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>
      )}

      {(compositionRules.length > 0 || related.length > 0) && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">Composition</h2>
          <div className="space-y-4">
            {compositionRules.map((rule, i) => (
              <div key={`${rule.component}-${i}`} className="rounded-xl border border-border bg-card p-4">
                <p className="text-sm">
                  <span className="font-medium">Compose with {rule.component ?? 'a sibling component'}</span>
                  {rule.relationship && <span className="text-muted-foreground"> — {rule.relationship}</span>}
                </p>
                {rule.example && (
                  <div className="mt-2">
                    <CodeBlock language="tsx" code={rule.example} />
                  </div>
                )}
              </div>
            ))}
            {related.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Related components:{' '}
                {related.map((name, i) => (
                  <span key={name}>
                    {i > 0 && ', '}
                    <Link
                      href={`/docs/components/${toComponentId(name)}`}
                      className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
                    >
                      {name}
                    </Link>
                  </span>
                ))}
              </p>
            )}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">Browser support</h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="p-3 text-left font-medium">Browser</th>
                <th className="p-3 text-left font-medium">Tested versions</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Chrome', '111+ (Mar 2023)'],
                ['Edge', '111+ (Mar 2023)'],
                ['Firefox', '121+ (Dec 2023)'],
                ['Safari', '17.2+ — macOS & iOS (Dec 2023)'],
              ].map(([browser, versions]) => (
                <tr key={browser} className="border-t border-border">
                  <td className="p-3 font-medium">{browser}</td>
                  <td className="p-3 text-muted-foreground">{versions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Slipstream components rely only on CSS custom properties, Flexbox/Grid, and ARIA — the
          everyday baseline of the last two years of evergreen releases. Anything newer is
          progressive enhancement: unsupported browsers keep full functionality with static
          behavior instead of animations.
        </p>
        {browserNotes && browserNotes.length > 0 && (
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
            {browserNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        )}
      </section>

      <nav aria-label="Pagination" className="mt-14 flex items-stretch justify-between gap-4 border-t border-border pt-6">
        {previous ? (
          <Link
            href={previous.href}
            className="group flex-1 rounded-lg border border-border p-4 transition-colors hover:bg-muted"
          >
            <span className="block text-xs text-muted-foreground">← Previous</span>
            <span className="text-sm font-medium group-hover:text-primary">{previous.label}</span>
          </Link>
        ) : (
          <span className="flex-1" />
        )}
        {next ? (
          <Link
            href={next.href}
            className="group flex-1 rounded-lg border border-border p-4 text-right transition-colors hover:bg-muted"
          >
            <span className="block text-xs text-muted-foreground">Next →</span>
            <span className="text-sm font-medium group-hover:text-primary">{next.label}</span>
          </Link>
        ) : (
          <span className="flex-1" />
        )}
      </nav>
    </article>
  );
}
