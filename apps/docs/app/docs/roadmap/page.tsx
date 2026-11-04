import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Roadmap',
  description:
    'The 0.x to 1.0 roadmap for Slipstream UI: stability guarantees, planned work per minor release, and the promises that come with 1.0.',
};

const RELEASES: {
  version: string;
  window: string;
  focus: string;
  items: string[];
  current?: boolean;
}[] = [
  {
    version: '0.1.x',
    window: 'Shipping now',
    current: true,
    focus: 'Foundation — the AI-first contract',
    items: [
      '48 components (31 core + 17 AI), each with a COMPONENT_MANIFEST',
      'MCP server: list/search/get tools + validate_usage',
      'shadcn-compatible registry, CLI (init/add/list/diff), /llm markdown + llms.txt',
      'Docs: grouped navigation, nine guides, interactive demos, browser-support tables',
      'jest-axe suites on every component; manifest schema + TS drift enforced in CI',
    ],
  },
  {
    version: '0.2',
    window: 'Target: Dec 2026',
    focus: 'AI surface depth + remaining core gaps',
    items: [
      'Multi-thread primitives (thread list + active-thread contract components)',
      'Attachments 2.0: previews, upload progress, multi-file constraints',
      'Model selector + queue/plan (todo) surfaces for agent UIs',
      'Generative-UI primitive: render agent-described component trees safely',
      'Core gaps: date/calendar input, richer Combobox patterns, toast position API',
      'validate_usage v2: actionable fix suggestions and whole-tree validation',
    ],
  },
  {
    version: '0.3',
    window: 'Target: Q1 2027',
    focus: 'Proof and starters',
    items: [
      'Public Storybook with visual-regression + a11y reports',
      'First-class starters: Vercel AI SDK, LangGraph, raw SSE',
      'Production app-shell templates (multi-thread workspace, settings)',
      'Bundle-size and tree-shaking measurements published',
      'Decision guides + honest comparison pages (vs shadcn AI Elements, vs assistant-ui)',
    ],
  },
  {
    version: '1.0',
    window: 'Target: Q2 2027',
    focus: 'Stability promise',
    items: [
      'API freeze: breaking changes only in major versions after 1.0',
      'Deprecation policy: announce in a minor, remove in the next major, migration note in the changelog every time',
      'Published migration guide 0.x → 1.0 with codemods where possible',
      'Long-term support statement for the 1.x line',
    ],
  },
];

const GUARANTEES = [
  {
    title: 'Semantic versioning, honestly',
    body: 'Patch = fixes only. Minor = new components/props (backward-compatible unless marked deprecated). Major = breaking, with migration notes. Until 1.0 the minor number may move breaking changes — always listed in the changelog first.',
  },
  {
    title: 'Specs ship with the code',
    body: 'Every component carries a versioned COMPONENT_MANIFEST; prop schemas, TypeScript types, and manifests are CI-checked for drift, so agents and humans see the same truth on every release.',
  },
  {
    title: 'Accessibility regressions are bugs',
    body: 'jest-axe suites run per package in CI. A release never knowingly ships an axe violation; reported a11y issues block the next patch.',
  },
  {
    title: 'Stateless stays stateless',
    body: 'No runtime lock-in will be introduced to core or ai components. Batteries-included conveniences live in optional packages, never in the primitives.',
  },
];

export default function RoadmapPage() {
  return (
    <div>
      <h1 className="scroll-m-20 text-3xl font-bold tracking-tight sm:text-4xl">Roadmap</h1>
      <p className="mt-3 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        Where Slipstream UI is today, what lands in each minor, and exactly what changes at 1.0.
        Dates are targets, not contracts — scope moves, the guarantees below do not.
      </p>

      <div className="mt-10 space-y-6">
        {RELEASES.map((release) => (
          <section
            key={release.version}
            className={`relative rounded-xl border p-6 ${
              release.current ? 'border-primary/40 bg-primary/5' : 'border-border bg-card'
            }`}
          >
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold">{release.version}</h2>
              <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 font-mono text-xs">
                {release.window}
              </span>
              {release.current && (
                <span className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  current
                </span>
              )}
            </div>
            <p className="mt-1 text-sm font-medium">{release.focus}</p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
              {release.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <h2 className="mt-14 scroll-m-20 text-2xl font-semibold tracking-tight">
        Stability guarantees
      </h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {GUARANTEES.map((guarantee) => (
          <div key={guarantee.title} className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold">{guarantee.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{guarantee.body}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-14 scroll-m-20 text-2xl font-semibold tracking-tight">
        How this stays honest
      </h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
        <li>
          Every release is written up in the{' '}
          <Link href="/changelog" className="font-medium text-primary hover:underline">changelog</Link> —
          breaking changes and migration steps included.
        </li>
        <li>Manifest versions bump with their component, so diffable specs track the API.</li>
        <li>
          Items move between releases when reality disagrees with the target window; the table above
          is updated in the same PR that moves the work.
        </li>
      </ul>

      <div className="mt-10 rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold">Shape the roadmap</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Missing something? Open an issue with the component or surface you need — the 0.2 list is
          ordered by what agent-builder demand has surfaced so far.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Link href="/docs" className="rounded-lg border border-border px-3 py-1.5 transition-colors hover:bg-muted">
            Versioning policy
          </Link>
          <a
            href="https://github.com/michaelmcshinsky/slipstream-ui/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-border px-3 py-1.5 transition-colors hover:bg-muted"
          >
            Request an item
          </a>
        </div>
      </div>
    </div>
  );
}
