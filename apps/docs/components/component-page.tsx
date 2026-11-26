'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CodeBlock } from '@slipstream-ui/ai';
import { useI18n } from '@slipstream-ui/i18n/react';
import { InstallBox } from './install-box';
import { PropsTable } from './props-table';
import { CopyForAi } from './copy-for-ai';
import { JsonLd } from './site/json-ld';
import { techArticleSchema } from '@/lib/structured-data';
import { getNeighbors, navItemLabel, FLAT_NAV } from '@/lib/nav';

export type ComponentPageProps = {
  /** Route/nav id, e.g. "sources": drives pagination and the URL. */
  id: string;
  /**
   * COMPONENT_MANIFEST id when it differs from the route id: drives the
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
 * A slice of the COMPONENT_MANIFEST served from /registry/<id>.json: only the
 * fields the human docs surface beyond the hand-written props table.
 */
type ManifestAntiPattern = { title?: string; explanation?: string; example?: string };
type ManifestCompositionRule = { component?: string; relationship?: string; example?: string };
type ManifestContentGuideline = {
  contentType?: string;
  guidelines?: string[];
  goodExamples?: string[];
  badExamples?: string[];
};
type RegistryManifest = {
  antiPatterns?: ManifestAntiPattern[];
  compositionRules?: ManifestCompositionRule[];
  relatedComponents?: string[];
  dependencies?: string[];
  registryDependencies?: string[];
  designIntent?: string;
  contentGuidelines?: ManifestContentGuideline[];
};

/** "MessageActions" / "InlineCitation" → route id used by /docs/components/<id>. */
function toComponentId(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

/** Doc routes that exist today: related-component links are gated on this. */
const COMPONENT_HREFS = new Set(
  FLAT_NAV.filter((item) => item.href.startsWith('/docs/components/')).map((item) => item.href)
);

/**
 * Fetches a component's manifest slice from /registry/<manifestId>.json.
 * Returns null while loading or when the file is absent: sections derived
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
        // Registry file absent: render without the manifest-derived sections.
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
  const { t } = useI18n();
  const { previous, next } = getNeighbors(`/docs/components/${id}`);
  const manifest = useRegistryManifest(manifestId ?? id);

  const antiPatterns = manifest?.antiPatterns ?? [];
  const compositionRules = manifest?.compositionRules ?? [];
  const contentGuidelines = manifest?.contentGuidelines ?? [];
  const designIntent = manifest?.designIntent;
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
      {/* BreadcrumbList JSON-LD comes from DocsBreadcrumbs in the docs
          layout; emitting it here too produced a duplicate on every page. */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="scroll-m-20 text-3xl font-bold tracking-tight">{title}</h1>
        {/* Two agent hand-offs: the canonical markdown page, and a compact
            instruction copied from the same registry payload validate_usage reads. */}
        <div className="flex flex-wrap items-start gap-2">
          <CopyForAi componentId={manifestId ?? id} />
          <a
            href={`/llm/components/${manifestId ?? id}.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1.5 inline-flex h-7 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title={t('site.page.markdownTitle', { href: `/llm/components/${manifestId ?? id}.md` })}
          ><span className="sr-only"> (opens in new tab)</span>
            <span aria-hidden="true">⧉</span> {t('site.page.markdownForAgents')}
          </a>
        </div>
      </div>
      <p className="mt-2 text-lg text-muted-foreground">{description}</p>

      {designIntent && (
        <section className="mt-6">
          <h2 id="design-intent" className="text-lg font-semibold">{t('site.page.designIntent')}</h2>
          <p className="mt-2 text-muted-foreground">{designIntent}</p>
        </section>
      )}

      <div className="mt-6">
        <InstallBox componentId={manifestId ?? id} npmPackages={npmPackages} />
      </div>

      <div className="mt-8 space-y-6">{children}</div>

      {propsRows && propsRows.length > 0 && (
        <section className="mt-10">
          <h2 id="props" className="mb-4 text-xl font-semibold">{t('site.props.title')}</h2>
          <PropsTable rows={propsRows} />
        </section>
      )}

      {antiPatterns.length > 0 && (
        <section className="mt-10">
          <h2 id="anti-patterns" className="mb-2 text-xl font-semibold">{t('site.page.antiPatterns')}</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">validate_usage</code>{' '}
            {t('site.page.antiPatternsDescription')}
          </p>
          <ul className="space-y-5">
            {antiPatterns.map((pattern, i) => (
              <li key={pattern.title ?? i} className="rounded-xl border border-border bg-card p-4">
                <p className="font-medium">{pattern.title ?? t('site.page.avoid')}</p>
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
          <h2 id="accessibility" className="mb-4 text-xl font-semibold">{t('site.page.accessibility')}</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm">
            {accessibility.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>
      )}

      {contentGuidelines.length > 0 && (
        <section className="mt-10">
          <h2 id="content-guidelines" className="mb-4 text-xl font-semibold">{t('site.page.contentGuidelines')}</h2>
          <div className="space-y-4">
            {contentGuidelines.map((group, index) => {
              const good = group.goodExamples ?? [];
              const bad = group.badExamples ?? [];
              return (
                <div key={group.contentType ?? index} className="rounded-xl border border-border bg-card p-4">
                  {group.contentType && <p className="font-medium">{group.contentType}</p>}
                  {group.guidelines && group.guidelines.length > 0 && (
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                      {group.guidelines.map((guideline) => (
                        <li key={guideline}>{guideline}</li>
                      ))}
                    </ul>
                  )}
                  {(good.length > 0 || bad.length > 0) && (
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {good.length > 0 && (
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-success">
                            {t('site.page.goodExamples')}
                          </p>
                          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                            {good.map((example) => (
                              <li key={example}>{example}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {bad.length > 0 && (
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-destructive">
                            {t('site.page.badExamples')}
                          </p>
                          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                            {bad.map((example) => (
                              <li key={example}>{example}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {(compositionRules.length > 0 || related.length > 0) && (
        <section className="mt-10">
          <h2 id="composition" className="mb-4 text-xl font-semibold">{t('site.page.composition')}</h2>
          <div className="space-y-4">
            {compositionRules.map((rule, i) => (
              <div key={`${rule.component}-${i}`} className="rounded-xl border border-border bg-card p-4">
                <p className="text-sm">
                  <span className="font-medium">
                    {t('site.page.composeWith', {
                      component: rule.component ?? t('site.page.sibling'),
                    })}
                  </span>
                  {rule.relationship && <span className="text-muted-foreground">: {rule.relationship}</span>}
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
                {t('site.page.related')}{' '}
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

      {((manifest?.dependencies ?? []).length > 0 || (manifest?.registryDependencies ?? []).length > 0) && (
        <section className="mt-10">
          <h2 id="dependencies" className="mb-2 text-xl font-semibold">Dependencies</h2>
          <p className="mb-3 text-sm text-muted-foreground">
            What the registry installs alongside this component. Package imports already include these.
          </p>
          {(manifest?.dependencies ?? []).length > 0 && (
            <div className="mb-3">
              <h3 id="dependencies-npm" className="text-sm font-medium">npm packages</h3>
              <ul className="mt-1 flex flex-wrap gap-1.5">
                {(manifest?.dependencies ?? []).map((dependency) => (
                  <li
                    key={dependency}
                    className="rounded border border-border bg-muted/50 px-2 py-0.5 font-mono text-xs"
                  >
                    {dependency}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {(manifest?.registryDependencies ?? []).length > 0 && (
            <div>
              <h3 id="dependencies-registry" className="text-sm font-medium">Registry items</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {(manifest?.registryDependencies ?? [])
                  .map((url) => url.slice(url.lastIndexOf('/') + 1).replace(/\.json$/, ''))
                  .join(', ')}
              </p>
            </div>
          )}
        </section>
      )}

      <section className="mt-10">
        <h2 id="browser-support" className="mb-4 text-xl font-semibold">{t('site.page.browserSupport')}</h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="p-3 text-left font-medium">{t('site.page.browser')}</th>
                <th className="p-3 text-left font-medium">{t('site.page.testedVersions')}</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Chrome', '111+ (Mar 2023)'],
                ['Edge', '111+ (Mar 2023)'],
                ['Firefox', '121+ (Dec 2023)'],
                ['Safari', '17.2+: macOS & iOS (Dec 2023)'],
              ].map(([browser, versions]) => (
                <tr key={browser} className="border-t border-border">
                  <td className="p-3 font-medium">{browser}</td>
                  <td className="p-3 text-muted-foreground">{versions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t('site.page.browserNote')}</p>
        {browserNotes && browserNotes.length > 0 && (
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
            {browserNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        )}
      </section>

      <nav aria-label={t('site.page.paginationAria')} className="mt-14 flex items-stretch justify-between gap-4 border-t border-border pt-6">
        {previous ? (
          <Link
            href={previous.href}
            className="group flex-1 rounded-lg border border-border p-4 transition-colors hover:bg-muted"
          >
            <span className="block text-xs text-muted-foreground">{t('site.page.previous')}</span>
            <span className="text-sm font-medium group-hover:text-primary">{navItemLabel(previous, t)}</span>
          </Link>
        ) : (
          <span className="flex-1" />
        )}
        {next ? (
          <Link
            href={next.href}
            className="group flex-1 rounded-lg border border-border p-4 text-right transition-colors hover:bg-muted"
          >
            <span className="block text-xs text-muted-foreground">{t('site.page.next')}</span>
            <span className="text-sm font-medium group-hover:text-primary">{navItemLabel(next, t)}</span>
          </Link>
        ) : (
          <span className="flex-1" />
        )}
      </nav>
    </article>
  );
}
