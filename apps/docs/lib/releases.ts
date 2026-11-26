import { AI_COMPONENT_COUNT, COMPONENT_COUNT, CORE_COMPONENT_COUNT } from './component-count';

export type Release = {
  version: string;
  date: string;
  tag: 'current' | 'previous';
  highlights: string[];
};

export const RELEASES = [
  {
    version: '0.11.2',
    date: 'November 26, 2026',
    tag: 'current',
    highlights: [
      'EntityCard gains cardHref: opt-in stretched-link mode where the name link overlays the whole card — one target, one hover state, one focus ring — with footer actions staying clickable above the overlay',
      'Versioned packages: core 0.11.2 (patch); ai 0.11.0, themes 0.10.0, cli 0.3.1, registry 0.2.2, mcp-server and i18n 0.5.0 unchanged',
    ],
  },
  {
    version: '0.11.1',
    date: 'November 26, 2026',
    tag: 'previous',
    highlights: [
      'PageHeader description/subtitle and SectionHeading description accept ReactNode instead of only string, so ledes can contain links and inline markup without consumers re-implementing the heading block',
      'Versioned packages: core 0.11.1 (patch); ai 0.11.0, themes 0.10.0, cli 0.3.1, registry 0.2.2, mcp-server and i18n 0.5.0 unchanged',
    ],
  },
  {
    version: '0.11.0',
    date: 'November 26, 2026',
    tag: 'previous',
    highlights: [
      'Menu gains first-letter typeahead: typing cycles focus through items matching the pressed character',
      'ProcessSteps adds headingLevel (h2-h4, default h3) so step titles continue the page outline without skipping ranks',
      'LogoCloud adds linkHrefProp (\'href\' | \'to\') for react-router style link components, matching LinkTabs/SiteFooter/Pagination',
      'CodeBlock adds onCopied(code) so consumers can show real copy feedback or analytics after a successful clipboard write',
      'InlineCitation derives its tooltip id from useId(), so citing the same source twice no longer produces duplicate DOM ids',
      'LoadMore uses a typographic ellipsis in the default loadingLabel ("Loading…") for consistency with the rest of the library',
      'Versioned packages: core/ai 0.11.0; themes 0.10.0, cli 0.3.1, registry 0.2.2, mcp-server and i18n 0.5.0 unchanged',
    ],
  },
  {
    version: '0.10.2',
    date: 'November 25, 2026',
    tag: 'previous',
    highlights: [
      'WCAG AA contrast: text and icon roles on light surfaces use text-primary-ink with bg-primary/10 tints so links, eyebrows, active states and chips clear 4.5:1; the Tailwind v3 preset maps primary.ink',
      'FormField wiring reaches assistive tech: DatePickerPopover forwards aria-describedby and aria-invalid to its trigger',
      'Component fixes: Image restarts its src -> fallbackSrc -> fallback chain when URLs change, FileUpload distinguishes same-named files by File identity, FilterPanel section state no longer collides on duplicate titles, List size="compact" actually reduces density, the Reasoning toggle shows a chevron, and disabled RadioGroupItem labels dim via peer-disabled',
      'Docs accuracy: the Menu JSDoc no longer advertises unimplemented typeahead, and the Source/Sources manifest drops the phantom onSelect prop so registry, LLM docs and MCP responses stop advertising it',
      'Versioned packages: core/ai 0.10.2 (0.10.1 was versioned but never published); themes 0.10.0, cli 0.3.1, registry 0.2.2, mcp-server and i18n 0.5.0 unchanged',
    ],
  },
  {
    version: '0.10.0',
    date: 'November 20, 2026',
    tag: 'previous',
    highlights: [
      'Form-control contrast and overlay polish: createTheme() emits color-scheme so native chrome follows the theme, Checkbox/Radio use the brand accent, RangeSlider gets a visible thumb, and Tooltip gains an inverse variant',
      'New props: Select labelHidden, FilterChips size, density and surface options across Message, Conversation and PromptInput, and StreamingIndicator size/tone/dotCount/showLabel',
      'Visual fixes: Timeline connector rail, Drawer backdrop fade, and Accordion collapse animation',
      'Newsletter subscriptions with daily/weekly digests in the dashboard app',
      'Docs fixes: cookie consent expires after 180 days, runtime fs reads removed for the Cloudflare Worker, .dark restored as the theme source of truth, richer articles index, and a benchmark case-study article',
      'Versioned packages: core/ai/themes 0.10.0, cli 0.3.1; mcp-server and i18n remain 0.5.0, registry 0.2.2',
    ],
  },
  {
    version: '0.9.0',
    date: 'November 17, 2026',
    tag: 'previous',
    highlights: [
      'AI docs reliability: the edge HTML cache stores anonymous pages, the docs route smoke test renders all 135 routes, and every component page now resolves to its registry manifest (CheckboxGroup and Tooltip were repaired)',
      'New MCP tool recommend_components turns a goal into a coherent component set with reasons and docs URLs; the same 14 recipes publish at /registry/recommendations.json',
      'validate_usage now rejects icon-only controls without an accessible name and returns a concrete fix; the 100-case benchmark is re-verified at 65.7% recall, 100% precision and 0 false positives',
      'Image (src -> fallbackSrc -> fallback), nested SiteHeader menus, Popover placement/collision handling, Calendar + DatePickerPopover, and localized labels for Stepper, DataTable and Conversation',
      'Theme contract: primary-ink and success-ink tokens; dark-mode contrast, calendar outside-month text, modal focus restoration and target-size fixes found by the full axe/dark audits',
      'CLI add --dry-run prints every create/overwrite/skip decision and writes nothing',
      'Dependency refresh: Next 16.4.6, hono 4.13.16, @hono/node-server 2.1.6 and glob 14.0.3; check:audit allows only the documented unpatched picomatch advisory',
      'Versioned packages: core/ai/themes 0.9.0, mcp-server 0.5.0, i18n 0.5.0, cli 0.3.0; registry remains 0.2.2',
    ],
  },
  {
    version: '0.8.0',
    date: 'November 12, 2026',
    tag: 'previous',
    highlights: [
      'BottomNav - mobile bottom tab bar for 3-5 primary destinations, with aria-current on the active tab, count badges, disabled tabs, a router linkComponent, 44px minimum targets and safe-area padding',
      'Drawer resizable - left and right drawers get a focusable separator handle: drag it, or use Arrow keys (16px), Shift+Arrow (64px) and Home/End (bounds); minWidth, maxWidth, defaultWidth and onWidthChange persist the width',
      'Migration aliases: PageHeader subtitle, MetricCard title/description, AuthLayout subtitle/logo and Drawer onClose; the canonical prop wins when both forms are passed',
      'Prop gaps closed: EmptyState.action object, Accordion.items, AuthLayout.maxWidth, Badge.size and MetricCard tone/loading (aria-busy skeleton)',
      'Neutral graphite dark palette replaces the navy-tinted surface ladder; light-mode tokens are unchanged',
      '@slipstream-ui/mcp-server 0.4.0: validate_usage v2 adds concrete fix suggestions and whole-tree validation through files[] with per-file results',
      '@slipstream-ui/i18n 0.4.0: nav and marketing message namespaces across ar, en, es, ja, ko, ru and zh, with the locale switcher reading the active label from the catalog',
      'Versioned packages: core/ai/themes 0.8.0, mcp-server 0.4.0, i18n 0.4.0, cli 0.2.3; registry remains 0.2.2',
    ],
  },
  {
    version: '0.7.0',
    date: 'November 10, 2026',
    tag: 'previous',
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
      '15 new components, a migration-readiness set: AppShell + Sidebar (responsive frame with mobile drawer), SelectMenu (custom listbox with rich options, groups and multi-select), TableCard (list-page table shell), EmptyState, PageHeader, MetricCard, PasswordInput, AuthLayout, FilterBar, DatePicker, TimePicker, Stepper, FileUpload and Timeline',
      'Imperative toasts: toast.success / error / warning / info, toast.dismiss and toast.clear with <Toaster position richColors>. Fire them from event handlers and data layers without a provider; the existing provider + useToast pair is unchanged',
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
      'Optional overlay motion: Dialog animate (fade + zoom backdrop/panel) and Drawer animate (side-aware slide in/out), opt-in, reduced-motion safe, exit window via usePresence with immediate focus restoration',
      'RadioGroup/CheckboxGroup: orientation (vertical/horizontal) and group-level error wired through a single fieldset (role=alert, one legend)',
      'Info color retuned from sky to teal in both themes. Light-mode info now meets WCAG AA against its ink foreground (4.04 → 6.36); token updated across themes, CLI template, and docs',
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
      'Search + Autocomplete: full combobox (portalled listbox, keyboard-complete) for constrained picks vs free-form type-ahead',
      'Tabs: underline variant (no strip background), sm/md/lg sizes, real Arrow/Home/End navigation with activation',
      'Dialog showClose, Breadcrumb onItemClick, Pagination showFirst/showLast/custom icons, Accordion custom icon slot + full-width headers, Confirmation color variants, Skeleton sizing props',
      'Tooltip portals with fixed positioning; overflowing a container no longer scrolls or clips the bubble',
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
      'Semantic status tokens (success, warning, info): components use theme-aware status colors, not hardcoded palette classes',
      'Full dark-mode support: every component re-themes via CSS variables; color-scheme set for native controls',
      'Theme presets (default, violet, zinc), each with paired dark variants',
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

/** Newest release first; drives the changelog, SEO metadata and the release header. */
export const LATEST_RELEASE = RELEASES[0];

