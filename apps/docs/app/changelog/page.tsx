import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { resolveLocale } from '@slipstream-ui/i18n';
import { getChangelogUi } from '@/lib/changelog-i18n';
import { CodeBlock } from '@slipstream-ui/ai';
import { Navbar } from '@/components/site/navbar';
import { MobileNav } from '@/components/site/mobile-nav';
import { AI_COMPONENT_COUNT, COMPONENT_COUNT, CORE_COMPONENT_COUNT } from '@/lib/component-count';
import { Footer } from '@/components/site/footer';
import { JsonLd } from '@/components/site/json-ld';
import { withSeo } from '@/lib/seo';
import { articleSchema } from '@/lib/structured-data';

export const metadata: Metadata = withSeo('/changelog', {
  title: 'Changelog',
  description:
    'Release notes for Slipstream UI: new components, breaking changes, and migration notes for every version, following semver. Latest: 0.7.0.',
});

const releases = [
  {
    version: '0.7.0',
    date: 'November 10, 2026',
    tag: 'current',
    highlights: [
      'Marketplace card layer: DealCard, EntityCard (with a ProfileCard alias), TombstoneCard, DocumentCard and LoadMore - 109 components total (92 core + 17 AI)',
      'Deal access is stated with text badges; document downloads stay disabled unless the document is available; unavailable items keep their reason and status; LoadMore announces loading and end-of-list states',
      'WCAG 2.2 fixes found by the dark-mode audit: Separator only exposes aria-orientation when it has the separator role, Tabs only emits aria-controls when the referenced panel is rendered, Timeline muted items keep token colors instead of dimming with opacity',
      'RangeSlider inputs and the DatePicker, DateRangePicker and TimePicker clear buttons now meet the 24px target-size minimum',
      'SelectMenu exposes the select-only combobox role on its trigger and makes the scrollable listbox focusable, so the open state is valid ARIA',
      'Versioned packages: core and ai 0.7.0; themes, cli, registry, mcp-server and i18n are unchanged from the 0.6.x line',
    ],
  },
  {
    version: '0.6.1',
    date: 'November 8, 2026',
    tag: 'previous',
    highlights: [
      '@slipstream-ui/themes accepts Tailwind CSS v4 as a peer alongside v3.4, so apps on Tailwind 4 install without an unmet-peer warning',
      'Dialog and Drawer modal-layer cleanup captures the layer id instead of reading a ref during teardown, removing the React warning and keeping nested-close ordering correct',
      'Verified before publish: typecheck 17/17, lint 10/10, tests 13/13, build 12/12, manifest validation at 104 components, and axe at 26 page runs (13 routes, light and dark)',
    ],
  },
  {
    version: '0.6.0',
    date: 'November 8, 2026',
    tag: 'previous',
    highlights: [
      '104 components (87 core + 17 AI): dashboard filter layer (MultiSelect, FilterPanel, DateRangePicker, AppliedFilters), marketing blocks (Hero, StatBand, CTASection, ComparisonTable, LogoCloud, FeatureGrid, FeatureRow, Testimonial, ProcessSteps, ArticleCard, Newsletter, ContactStrip, AnnouncementBar), plus SegmentedControl, RangeSlider, FilterChips, LinkTabs and ThemeToggle',
      'Server-safe per-file subpath exports (@slipstream-ui/core/card) that preserve each file\'s use client directive, so server components no longer have to pull the client barrel',
      'Prebuilt stylesheets (styles.css, styles-full.css, themes/styles.css) and data-theme="dark" support alongside .dark, for apps that do not run Tailwind themselves',
      'React Hook Form and native change handlers: documented Controller recipe, Select option children, native attribute passthrough on the form controls',
      'Router-agnostic documentHead() helper, AuthLayout split/aside variant, AppShell viewport-height rail, sidebar prefix matching, footer active state',
      'New release gates: registry cache reload, per-file module and subpath verification, packaged-stylesheet smoke test, bundle-size budgets with gzip limits',
      'Versioned packages: core/ai/themes 0.6.0, cli 0.2.2, registry 0.2.2, mcp-server 0.3.1, i18n 0.3.1',
    ],
  },
  {
    version: '0.5.0',
    date: 'November 2026',
    tag: 'previous',
    highlights: [
      'Validation benchmark: 100 cases across 7 defect classes and 4 conditions, with a published baseline of 65.7% structural recall, 100% precision and 0 false positives on valid cases',
      'Tailwind CSS v4: a CSS-first theme contract in @slipstream-ui/themes plus a cross-platform compile fixture that verifies semantic utilities against the real component sources',
      'New @slipstream-ui/i18n 0.2.0: typed English/Arabic/Spanish catalogs, RTL direction, plural selection, Intl number/date formatters and a client-only React entry',
      'AI Chat Starter: streaming, reasoning, tool calls, human approvals, citations, local history and consent-gated analytics, fully localized in en/ar/es',
      'Localized labels for Button, Pagination, DataTable, Dialog, Drawer, Reasoning and ToolCall; no component is forced into a client boundary for i18n',
      'Manifest parity: 8 real TypeScript/manifest drifts fixed; a component coverage gate now verifies tests, examples, accessibility notes and docs for all 80 components',
      'Deterministic registry generation across Windows and Linux (sorted files, LF-normalized embedded content, no commit SHA) plus an LLM documentation audit',
      'MCP registry metadata: server.json, matching mcpName, and @slipstream-ui/mcp-server 0.3.0; registry payloads at 0.2.1',
      'Docs, dashboard and playground locale shells with a shared language switcher; compatibility matrix and Tailwind v4 migration guide',
      'Verified: typecheck 17/17, lint 10/10, tests 13/13, build 12/12, axe 26/26 page runs, and 7 installable package tarballs',
    ],
  },
  {
    version: '0.4.0',
    date: 'November 2026',
    tag: 'previous',
    highlights: [
      '15 new components — migration-readiness set: AppShell + Sidebar (responsive frame with mobile drawer), SelectMenu (custom listbox with rich options, groups and multi-select), TableCard (list-page table shell), EmptyState, PageHeader, MetricCard, PasswordInput, AuthLayout, FilterBar, DatePicker, TimePicker, Stepper, FileUpload and Timeline',
      'Imperative toasts: toast.success / error / warning / info, toast.dismiss and toast.clear with <Toaster position richColors> — fire from event handlers and data layers without a provider; the existing provider + useToast pair is unchanged',
      'Dialog: size presets (sm–2xl), footer and scrollable body, plus composed parts (DialogHeader/Title/Description/Body/Footer) that wire the aria ids automatically',
      'Select: optgroups, placeholder row and native multi-select with a string[] contract; Autocomplete: option objects with descriptions, debounced async loadOptions with stale-response guard, grouped headings, custom rows and a clear button',
      'Pagination: currentPage/totalPages aliases, pageCount derived from total + pageSize, and a "Showing 26–50 of 312 students" summary',
      'asChild on Card, Badge and MenuItem for router links; theming docs gain the z-index ladder (10 docked · 30 sticky · 40 chrome · 50 overlays · 60 toasts)',
      `Docs: 14 new component pages, nav and search index updated; registry + LLM docs regenerate to ${COMPONENT_COUNT} components (${CORE_COMPONENT_COUNT} core / ${AI_COMPONENT_COUNT} AI)`,
    ],
  },
  {
    version: '0.3.0',
    date: 'November 2026',
    tag: 'previous',
    highlights: [
      'New components: Form + FormLayout (validated composition with even tokenized spacing), Drawer (edge sheet with Dialog-grade modal semantics), InputGroup (flush left/right addons behind one outer outline), ButtonGroup (joined segments, single border), CheckboxGroup (multi-select counterpart of RadioGroup), RadioCard (whole clickable sections, native circle hidden, optional square corners)',
      'Optional overlay motion: Dialog animate (fade + zoom backdrop/panel) and Drawer animate (side-aware slide in/out) — opt-in, reduced-motion safe, exit window via usePresence with immediate focus restoration',
      'RadioGroup/CheckboxGroup: orientation (vertical/horizontal) and group-level error wired through a single fieldset (role=alert, one legend)',
      'Info color retuned from sky to teal in both themes — light-mode info now meets WCAG AA against its ink foreground (4.04 → 6.36); token updated across themes, CLI template, and docs',
      'Button success/warning/info semantic variants; Tabs rounded variant; Accordion borderless variant + gap; DataTable loadingRows with density-matched skeleton heights; Confirmation approveVariant/rejectVariant/showActions',
      'Gap props accept tokens or exact pixels across Flex, Grid, Form, FormLayout, and Accordion (shared GapValue)',
      'FormField: trailing slot now sits inline with the control at label-placements left; InputGroup forwards FormField id/aria wiring to the nested field so labels target the editable control',
      'Docs: brand banner in full for navbar/footer, On-This-Page TOC rescans per navigation, GitHub links fixed, Block moved to Layout, search index backfilled (Input/Button/Badge + new components)',
      'Release pipeline: CI and Release workflows moved to Node 22 (Next 16 requires ≥20.9), release workflow gains contents/PR write plus id-token for npm provenance',
    ],
  },
  {
    version: '0.2.0',
    date: 'November 2026',
    tag: 'previous',
    highlights: [
      'Axial-inspired design pivot: dark surface ladder (background < card < popover), crisp navy borders, light-blue primary with WCAG AA contrast in both themes, 6px radii',
      'Fixed invalid percent-hue success/warning/info tokens that silently dropped (status chips render correctly in both themes again)',
      'New components: Fieldset, FormField (label placement + tooltip + trailing slot), Text, Heading, Block, Flex/FlexItem, Grid/GridItem, List/ListItem',
      'DataTable: custom sort icons, sticky header, compact density, zebra rows, loading skeletons, row AND column click callbacks, server-side sort via onSortChange',
      'Search + Autocomplete: full combobox (portalled listbox, keyboard-complete) — constrained picks vs free-form type-ahead',
      'Tabs: underline variant (no strip background), sm/md/lg sizes, real Arrow/Home/End navigation with activation',
      'Dialog showClose, Breadcrumb onItemClick, Pagination showFirst/showLast/custom icons, Accordion custom icon slot + full-width headers, Confirmation color variants, Skeleton sizing props',
      'Tooltip portals with fixed positioning — overflowing a container no longer scrolls or clips the bubble',
      'Docs: browser-support table on every component page, grouped accordion sidebar, full-width shell with centered reading column, nine guides, interactive MCP playground, five live templates',
      'Every code example unified on CodeBlock with an AA-safe surface; per-page SEO metadata across all docs; codebase converted from interface to type',
      'Repo hygiene: kittyclaw references removed, legacy root build cluster (src/stories/storybook/vite/vitest configs) deleted, typecheck covers the build scripts (43 pre-existing errors fixed)',
    ],
  },
  {
    version: '0.1.0',
    date: 'October 2026',
    tag: 'previous',
    highlights: [
      '43 components across @slipstream-ui/core and @slipstream-ui/ai, each shipping a COMPONENT_MANIFEST',
      'Response: streaming-safe GFM markdown renderer with automatic repair of incomplete syntax',
      'CodeBlock: syntax highlighting with copy button (prism-react-renderer), theme-aware light/dark',
      'Confirmation: human-in-the-loop approval gate for agent actions',
      'Branch: message variant navigation; InlineCitation: hover citation chips',
      'Conversation: welcome/empty state, scroll-to-latest pill, transcript download, paginated history with scroll anchoring',
      'PromptInput: compound primitives, drag-and-drop + clipboard-paste attachments with constraints, dictation, status-aware submit control',
      'Message: error/retry card and edit-and-resubmit flow',
      'MCP server: list_components, get_component_manifest, get_usage_examples, validate_usage',
      'shadcn-compatible registry: npx shadcn add https://slipstreamui.com/registry/<id>.json',
      'jest-axe tested components; CI runs lint, typecheck, tests, builds, manifest validation',
      'Semantic status tokens: success, warning, info — components use theme-aware status colors, not hardcoded palette classes',
      'Full dark-mode support: every component re-themes via CSS variables; color-scheme set for native controls',
      'Theme presets: default, violet, zinc — each with paired dark variants',
      'Streaming indicator announces state to screen readers (role="status")',
    ],
  },
  {
    version: '0.1.0-beta',
    date: 'August 2026',
    tag: 'previous',
    highlights: [
      'Initial public beta: 43 components with manifests, MCP server, shadcn-compatible registry',
      'Core primitives: Button, Badge, Input, Select, Avatar, Dialog, Spinner, Toast',
      'AI components: Conversation, PromptInput, Response, Message, MessageActions, ToolCall, Confirmation, Reasoning, ChainThought, Sources, Suggestions, Branch, InlineCitation, StreamingIndicator, AttachmentList, CodeBlock, CommandPalette',
      'createTheme() with CSS variable emission and light/dark presets',
      'CLI: npx slipstream-ui init scaffolds config, theme variables, and component directory',
    ],
  },
];

export default async function ChangelogPage() {
  const locale = resolveLocale((await cookies()).get('slipstream-locale')?.value);
  const ui = getChangelogUi(locale);
  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={articleSchema({
          headline: 'Slipstream UI changelog',
          description:
            'Release notes for Slipstream UI: new components, breaking changes, and migration notes for every version, following semver. Latest: 0.7.0.',
          path: '/changelog',
          dateModified: '2026-11-10',
        })}
      />
      <Navbar />
      {/* px-4 absorbs the pills bar's -mx-4 bleed so the page never scrolls horizontally. */}
      <div className="px-4">
        <MobileNav />
      </div>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">{ui.title}</h1>
        <p className="text-lg text-muted-foreground mb-10">
          {ui.intro}
        </p>

        {releases.map((release) => {
          const isCurrent = release.tag === 'current';
          const highlights = release.version === '0.5.0' ? ui.release05 : release.highlights;
          const date = release.version === '0.5.0' ? ui.date05 : release.date;
          return (
            <section key={release.version} className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-2xl font-semibold">{release.version}</h2>
                <span className="text-sm text-muted-foreground">{date}</span>
                {isCurrent && (
                  <span className="text-xs px-2 py-0.5 rounded-full border border-primary/40 bg-primary/10 text-primary font-medium">
                    {ui.current}
                  </span>
                )}
              </div>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                {highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </section>
          );
        })}

        {locale !== 'en' && (
          <p className="mb-10 text-sm text-muted-foreground">{ui.archiveNote}</p>
        )}

        <h2 className="text-2xl font-semibold mb-4">{ui.installHeading}</h2>
        <CodeBlock
          language="bash"
          code={`# Packages
pnpm add @slipstream-ui/core @slipstream-ui/ai

# Or install source copies via the shadcn-compatible registry
npx shadcn@latest add https://slipstreamui.com/registry/message.json`}
        />
      </div>
      <Footer />
    </div>
  );
}
