import type { Metadata } from 'next';
import Link from 'next/link';
import { CORE_COMPONENT_COUNT, AI_COMPONENT_COUNT, COMPONENT_COUNT } from '@/lib/component-count';

export const metadata: Metadata = {
  title: 'Roadmap',
  description:
    'The 0.x to 1.0 roadmap for Slipstream UI: what shipped, what is next, the stability guarantees, and the promises that come with 1.0.',
};

const RELEASES: {
  version: string;
  window: string;
  focus: string;
  items: string[];
  state: 'shipped' | 'next' | 'planned';
}[] = [
  {
    version: '0.4.x',
    window: 'Shipped',
    state: 'shipped',
    focus: 'Complete surface: migration-readiness round one',
    items: [
      `${COMPONENT_COUNT} components at release, each with a COMPONENT_MANIFEST, tests and docs`,
      'Forms: Form, FormLayout, InputGroup, ButtonGroup, CheckboxGroup, RadioCard, Select optgroups/multi, async Autocomplete',
      'Overlays: Drawer with motion + custom widths, Dialog size presets and composed parts, imperative toasts (toast.* + <Toaster>)',
      'App patterns: AppShell/Sidebar, EmptyState, PageHeader, MetricCard, PasswordInput, AuthLayout, FilterBar, DatePicker/TimePicker, Stepper, FileUpload, Timeline',
      'Data: DataTable depth, TableCard, Pagination aliases + item summary, canonical z-index ladder',
      'Docs site launch checklist: per-route metadata, 1200×630 OG, favicon set + manifest, robots/sitemap, legal pages, consent-gated analytics, sticky mobile CTA',
    ],
  },
  {
    version: '0.5.0',
    window: 'Shipped · November 2026',
    state: 'shipped',
    focus: 'Migration-readiness round two — parity with shadcn/MUI-era apps',
    items: [
      `${COMPONENT_COUNT} components (${CORE_COMPONENT_COUNT} core + ${AI_COMPONENT_COUNT} AI)`,
      'Badge success/warning/info/primary/danger; Button primary/danger aliases + loading',
      'Link primitive with variants, asChild router support and safe external handling',
      'Sidebar nested groups + collapsible icon rail; AppShell mobile breakpoint',
      'DataTable row selection (indeterminate select-all, bulk actions) and server pagination (manualPagination/total/pageCount)',
      'Controlled Search, invalid-control styling, Select onValueChange, Switch form submission, Breadcrumb linkComponent',
      'Marketing/content chrome: SiteHeader, SiteFooter, Prose, TableOfContents + useScrollSpy, ConfirmDialog, SectionHeading',
      'Async CommandPalette (loadCommands/renderCommand)',
    ],
  },
  {
    version: '0.6.x',
    window: 'Shipped · November 2026',
    state: 'shipped',
    focus: 'Integration hardening: the filter, marketing and consumer-parity round',
    items: [
      `${COMPONENT_COUNT} components (${CORE_COMPONENT_COUNT} core + ${AI_COMPONENT_COUNT} AI), all with manifests, tests, examples and docs`,
      'Dashboard filter layer: MultiSelect, FilterPanel, DateRangePicker, AppliedFilters, SegmentedControl, RangeSlider, FilterChips, FilterBar wiring',
      'Marketing and content blocks: Hero, StatBand, CTASection, ComparisonTable, LogoCloud, FeatureGrid, FeatureRow, Testimonial, ProcessSteps, ArticleCard, Newsletter, ContactStrip, AnnouncementBar',
      'Server-safe per-file subpath exports (core/card) that preserve each file use client directive, alongside the client barrel',
      'Prebuilt stylesheets: styles.css, styles-full.css and themes/styles.css, with data-theme="dark" support next to .dark',
      'React Hook Form and native change handlers: documented Controller recipe, Select children, native attribute passthrough',
      'Router-agnostic documentHead() helper, AuthLayout split/aside variant, PageHeader, AppShell viewport rail and sidebar prefix matching',
      'Release gates: registry reload verification, module/subpath verification, packaged-stylesheet smoke test, bundle-size budgets, axe audit at 26 page runs',
      '0.6.1: Tailwind v4 accepted as a peer next to v3.4, and the Dialog/Drawer modal-layer cleanup no longer reads a ref during teardown',
    ],
  },
  {
    version: '0.7 - 0.9',
    window: 'Planned',
    state: 'planned',
    focus: 'Proof and starters',
    items: [
      'Public Storybook with visual-regression + a11y reports',
      'First-class starters: Vercel AI SDK, LangGraph, raw SSE',
      'Multi-thread workspace template and production app shells',
      'Bundle-size and tree-shaking measurements published',
      'validate_usage v2: actionable fix suggestions and whole-tree validation',
      'Rich DatePicker/TimePicker (calendar popover, 12-hour, minute steps) on top of the ISO/HH:MM contract',
      'Resizable Drawer (drag handle, min width) for wide detail panes',
      'Migration aliases: PageHeader.subtitle, EmptyState action object, AuthLayout subtitle/logo/maxWidth, Drawer onClose, MetricCard title/description, Accordion items',
      'MetricCard tone/loading, Badge size, mobile bottom-tab navigation',
    ],
  },
  {
    version: '1.0',
    window: 'Target: 2027',
    state: 'planned',
    focus: 'Stability promise',
    items: [
      'API freeze: breaking changes only in major versions after 1.0',
      'Semver guarantee for components, props, tokens and manifest schema',
      'Long-term support policy and codemods for majors',
    ],
  },
];

const stateStyles: Record<(typeof RELEASES)[number]['state'], string> = {
  shipped: 'border-success/40 bg-card text-success',
  next: 'border-primary/40 bg-primary/10 text-primary',
  planned: 'border-border bg-muted text-muted-foreground',
};

const stateLabels: Record<(typeof RELEASES)[number]['state'], string> = {
  shipped: 'Shipped',
  next: 'In release',
  planned: 'Planned',
};

export default function RoadmapPage() {
  return (
    <div>
      <h1 className="scroll-m-20 text-3xl font-bold tracking-tight sm:text-4xl">Roadmap</h1>
      <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">
        Slipstream UI follows semantic versioning through 0.x and freezes the API at 1.0. The library
        currently ships {COMPONENT_COUNT} components ({CORE_COMPONENT_COUNT} core + {AI_COMPONENT_COUNT} AI),
        each with a machine-readable manifest, tests and documentation.
      </p>

      <div className="mt-10 space-y-6">
        {RELEASES.map((release) => (
          <section key={release.version} className="rounded-xl border border-border bg-card p-6">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold">{release.version}</h2>
              <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${stateStyles[release.state]}`}>
                {stateLabels[release.state]}
              </span>
              <span className="text-sm text-muted-foreground">{release.window}</span>
            </div>
            <p className="mt-1 text-sm font-medium text-foreground">{release.focus}</p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
              {release.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-border bg-muted/30 p-6 text-sm text-muted-foreground">
        <p>
          Need something that is not on the list? Open a{' '}
          <a className="text-primary underline underline-offset-2 hover:text-primary/80" href="https://github.com/michaelmcshinsky/slipstream-ui/issues">
            GitHub issue
          </a>{' '}
          or read the{' '}
          <Link className="text-primary underline underline-offset-2 hover:text-primary/80" href="/changelog">
            changelog
          </Link>{' '}
          for what already shipped.
        </p>
      </div>
    </div>
  );
}
