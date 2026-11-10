# @slipstream-ui/core

## 0.7.0

### Minor Changes

- [#84](https://github.com/michaelmcshinsky/slipstream-ui/pull/84) [`db0e184`](https://github.com/michaelmcshinsky/slipstream-ui/commit/db0e184ce7e2534013368c9a95f71fb8c6aecea6) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Add the marketplace card layer: `DealCard`, `EntityCard` (with `ProfileCard`
  alias), `TombstoneCard`, `DocumentCard` and `LoadMore`.
  
  Deal access is stated with text badges; document downloads are disabled unless
  the document is available; unavailable items keep their reason and status;
  LoadMore announces loading and end-of-list states.

### Patch Changes

- [#84](https://github.com/michaelmcshinsky/slipstream-ui/pull/84) [`db0e184`](https://github.com/michaelmcshinsky/slipstream-ui/commit/db0e184ce7e2534013368c9a95f71fb8c6aecea6) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Fix WCAG 2.2 issues found by the dark-mode audit.
  
  - `Separator` only exposes `aria-orientation` when it has the `separator` role.
  - `Tabs` only emits `aria-controls` when the referenced panel is rendered.
  - `Timeline` muted items keep token colors instead of dimming with opacity.
  - `RangeSlider` inputs and `DatePicker`/`DateRangePicker`/`TimePicker` clear
    buttons meet the 24px target-size minimum.
  - `SelectMenu` exposes the select-only `combobox` role on its trigger and makes
    the scrollable listbox focusable, so the open state is valid ARIA.

## 0.6.1

### Patch Changes

- Fix the modal-layer effect cleanup so it captures the current layer id, and
  allow Tailwind CSS v4 as a peer alongside v3.4 because the package ships the
  v4 theme contract.

## 0.6.0

### Minor Changes

- [`352e873`](https://github.com/michaelmcshinsky/slipstream-ui/commit/352e87336f87bd5f2ab5fc327d204af6f62a8944) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Add the dashboard filter layer: `MultiSelect`, `FilterPanel`,
  `DateRangePicker` and `AppliedFilters`.
  
  `MultiSelect` pairs a searchable checkbox panel with removable chips outside
  the trigger. `FilterPanel` owns collapsible sections and reset/apply actions
  without owning filter values. `DateRangePicker` uses an ISO string contract and
  keeps the end on or after the start. `AppliedFilters` wraps `FilterChips` with
  a live count and an edit action.

- [#68](https://github.com/michaelmcshinsky/slipstream-ui/pull/68) [`9dfc268`](https://github.com/michaelmcshinsky/slipstream-ui/commit/9dfc2688503324e7f8dda0784643b688d5ce47b9) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Add prebuilt stylesheets (`styles.css`, `styles-full.css`, `themes/styles.css`), support `data-theme="dark"` alongside `.dark`, make form controls compatible with native change handlers and react-hook-form, and add `LinkTabs` and `ThemeToggle`.

- [#68](https://github.com/michaelmcshinsky/slipstream-ui/pull/68) [`876be12`](https://github.com/michaelmcshinsky/slipstream-ui/commit/876be124dd63ac553e83465a1130eed3a1c9ba6d) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Add a tone-aware marketing and data-filter layer.
  
  - `Container` and `Section` with width, vertical rhythm and `tone` presets.
    `Section` scopes inverse surface tokens so cards, borders and muted text
    stay readable inside a contrasting band.
  - `Hero`, `StatBand`, `CTASection` and `ComparisonTable` marketing blocks.
  - `SegmentedControl`, `RangeSlider` and `FilterChips` for dashboards and
    filter-heavy list pages.
  - Themes gain `inverse`, `inverse-foreground`, `inverse-muted`,
    `inverse-border`, `inverse-card`, `inverse-primary` and related tokens, plus
    matching Tailwind v3 and v4 mappings. Inverse sections keep AA contrast in
    both light and dark mode.

- [`feaf8c6`](https://github.com/michaelmcshinsky/slipstream-ui/commit/feaf8c62252d54bc1d4a2fad5ecb4215a113011b) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Add the second marketing block batch: `LogoCloud`, `FeatureGrid`, `FeatureRow`,
  `Testimonial`, `ProcessSteps`, `ArticleCard`, `Newsletter`, `ContactStrip` and
  `AnnouncementBar`. Each ships a manifest, tests, docs and registry payload.
  
  `Newsletter` owns email capture state and success/error feedback but not the
  CRM transport. `ArticleCard` accepts a router `linkComponent`. `AnnouncementBar`
  owns dismissal only; persistence stays with the caller.

- [#68](https://github.com/michaelmcshinsky/slipstream-ui/pull/68) [`1e8e062`](https://github.com/michaelmcshinsky/slipstream-ui/commit/1e8e062cabae7b0fbe8b9e13de9556ba553e8b38) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Add `linkHrefProp` so router-bound components work with react-router's `to`
  prop, `brandLabel` and `mobileActions` on SiteHeader, and `activeHref` /
  `match` on SiteFooter. Fix the mobile menu button icon and expanded state,
  wire the CLI to prebuilt and Tailwind 4 stylesheets (including `src/styles.css`
  targets), and correct the install docs.

- [#68](https://github.com/michaelmcshinsky/slipstream-ui/pull/68) [`876be12`](https://github.com/michaelmcshinsky/slipstream-ui/commit/876be124dd63ac553e83465a1130eed3a1c9ba6d) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Add integration escape hatches and fix the registry install path.
  
  - Core: emit per-file ESM/CJS modules and component subpath exports
    (`@slipstream-ui/core/card`) that preserve each file's `use client`
    directive. The root import remains a client bundle for compatibility.
  - SectionHeading, PageHeader: `titleClassName`, `descriptionClassName` and
    `eyebrowClassName` for host display typography.
  - Hero: `titleClassName`, `descriptionClassName`, `eyebrowClassName` and
    `badgeClassName`.
  - SiteHeader: `showMobileTrigger`, `desktopBreakpoint` and `navClassName` so
    hosts can keep their own mobile navigation and header height.
  - TableOfContents: `ariaLabel` and `labelClassName`; active links are
    underlined.
  - Breadcrumb: `truncateCurrent` for long current-page labels.
  - Select: native `<option>` children in addition to `options`/`groups`.
  - CLI `add`: copy the component's relative dependency closure and
    `components/slipstream/utils/`, rewrite support imports, and skip existing
    files unless `--overwrite`.
  - CLI `diff` and `add`: read `componentsDir` from `slipstream.config.json`
    and reject paths outside the project.
  - CLI `diff`: normalize support imports and line endings before comparing, so
    a copied install does not report false drift.
  - Dialog and Drawer: share a modal layer stack for body scroll lock and
    nested Escape handling.
  - CLI `init`: extend an existing CSS-variable theme with only the missing
    Slipstream tokens instead of skipping stylesheet setup.
  - Themes: publish the Tailwind CSS 3 preset at
    `@slipstream-ui/themes/tailwind-preset`.
  - Tailwind 3 preset: map timing keys as `standard`, `in`, and `out` so
    `ease-standard` compiles. The previous `ease-*` keys generated
    `ease-ease-*` and never produced the utility.
  - Registry payloads stamp the package version instead of stale
    per-component versions.
  - Docs: use `npx @slipstream-ui/cli@latest`, and document the new add/init
    behaviour and the Tailwind preset.

- [#68](https://github.com/michaelmcshinsky/slipstream-ui/pull/68) [`7dca271`](https://github.com/michaelmcshinsky/slipstream-ui/commit/7dca2714066c74e461da4fb04262540f52e6714b) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Add `contrast`/`onDark` button variants and link-mode pagination (`pageHrefs`,
  `linkComponent`, `linkHrefProp`) for Server Components. Invalidate the manifest
  registry cache when manifest files change so a running MCP server sees edits
  without a restart.

### Patch Changes

- [#68](https://github.com/michaelmcshinsky/slipstream-ui/pull/68) [`a0b5723`](https://github.com/michaelmcshinsky/slipstream-ui/commit/a0b5723495cb31df3f814521aa34198ae359a23c) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Fix the AppShell desktop rail so it stays viewport-height and keeps its footer visible, keep Sidebar parent items active on nested routes, and expose accessible `navLabel` / `mobileNavLabel` props on SiteHeader.

- [`6945e41`](https://github.com/michaelmcshinsky/slipstream-ui/commit/6945e4131dedc792a6e2cf512a9f4cdc1d0d3658) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Localize the remaining P1 component labels with optional props and English
  defaults: Autocomplete clear/suggestions, Breadcrumb landmark, DatePicker and
  TimePicker clear, FileUpload selected/remove/uploading, Search list label,
  CommandPalette dialog/list/empty, Toaster dismiss, Skeleton opt-in status
  label, and AppShell mobile-navigation labels. Message and Reasoning now accept
  `formatTime` or a BCP-47 `locale` for timestamps, and the AI Chat Starter
  passes the active locale. The i18n package gains an `en-XA` pseudo-locale
  catalog and providers accept `pseudo`, with a persisted playground toggle.

- [#68](https://github.com/michaelmcshinsky/slipstream-ui/pull/68) [`876be12`](https://github.com/michaelmcshinsky/slipstream-ui/commit/876be124dd63ac553e83465a1130eed3a1c9ba6d) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Fix pagination typography and harden the Tailwind v4 verification fixture.
  
  - Pagination now renders an ellipsis glyph, en-dash range summaries and
    `«` / `»` boundary glyphs, matching the documented summary and tests.
  - `verify:tailwind-v4` runs the installed `@tailwindcss/cli` binary directly
    instead of calling `npx --no-install @tailwindcss/cli`, which fails on
    Windows. The fixture also verifies the new inverse selectors.

- [`9b07d2e`](https://github.com/michaelmcshinsky/slipstream-ui/commit/9b07d2e5a87623e8f3a9f9033364e711a9285212) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Radio accepts the native `onChange` handler again, matching Checkbox and Select. Both `onChange` and `onCheckedChange` fire, so react-hook-form `register()` and plain native handlers work without a Controller.

- [#68](https://github.com/michaelmcshinsky/slipstream-ui/pull/68) [`5a8d403`](https://github.com/michaelmcshinsky/slipstream-ui/commit/5a8d403af48c4e6705f17a3d91227f35187920eb) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Select now fills its container like Input, and native `<option>`/`<optgroup>` children are a documented fallback: `groups` wins over `options`, and `options` wins over `children`. This lets react-hook-form `register()` spread and dynamic option lists work without converting to the `options` array.

- [#68](https://github.com/michaelmcshinsky/slipstream-ui/pull/68) [`876be12`](https://github.com/michaelmcshinsky/slipstream-ui/commit/876be124dd63ac553e83465a1130eed3a1c9ba6d) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Integration fixes surfaced by adopting Slipstream in a Next.js App Router site: `Badge` gains `neutral` and `accent` variants and now renders an inline `span`, `Alert` accepts `danger` as an alias of `destructive`, `EmptyState` accepts an `actions` alias and a `titleAs` heading level, `Textarea` stops narrowing native `value`/`onChange` so react-hook-form and other native form libraries type-check, the `add` command resolves peer dependencies from the correct manifest and drops two unused bindings, and the Tailwind v4 docs point at the prebuilt `@slipstream-ui/themes/styles.css` defaults.

## 0.5.0

### Minor Changes

- [`768bac2`](https://github.com/michaelmcshinsky/slipstream-ui/commit/768bac237c0f83fffdb114322a68805fdb00539a) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Migration-readiness pass 2: the gaps surfaced by re-auditing dancestack,
  floorpass and the two profile sites against the current library.

  Variants and aliases (P0 for floorpass):

  - Badge gains success/warning/info/primary/danger (primary and danger are
    aliases for default/destructive)
  - Button gains primary/danger aliases and a loading state (spinner,
    disabled, aria-busy, sr-only announcement)

  New components:

  - Link: default/muted/underline/arrow/external variants, asChild for
    router links, auto external detection (target=\_blank + rel=noopener
    noreferrer + sr-only note; mailto/tel never new-tab)
  - SectionHeading: eyebrow/title/description/actions with level 2-4,
    left/center alignment and sm/md/lg sizes

  App shell (P0 for dancestack):

  - SidebarItem.children for nested groups (aria-expanded/aria-controls,
    auto-opens the group containing the active route)
  - collapsible rail: collapsed/defaultCollapsed/onCollapsedChange,
    defaultExpanded groups; AppShell shrinks the aside to w-16 via
    :has([data-collapsed]) and gains mobileBreakpoint

  DataTable (P1 for dancestack):

  - Row selection: selectedRowIds/onSelectedRowIdsChange/isRowSelectable,
    select-all with indeterminate header, bulkActions bar
  - Server pagination: manualPagination/total/pageCount; summary and
    aria-sort stay correct without client slicing/sorting

  Forms and navigation (P1 for the profiles):

  - Input/Textarea/Select: aria-invalid visual styling (destructive border
    - ring) so FormField's error wiring is visible
  - Select: onValueChange alias (alongside onChange)
  - Switch: name renders a hidden "on" input so switches submit with forms
  - Search: controlled `value` (display follows the prop, null clears)
  - Breadcrumb: linkComponent for router links (preserves prefetch and
    modified clicks)

  AI:

  - CommandPalette: loadCommands (debounced, stale-response guarded),
    renderCommand, loadingText; Command gains icon/description

  Docs: new Link and SectionHeading pages, nav + search entries, registry
  and LLM docs regenerate to 75 components (58 core / 17 AI).

  Verified: typecheck 14/14, lint 8/8, tests 10/10, build 10/10, 75
  manifests with zero drift, docs smoke 5/5.

- [`f509885`](https://github.com/michaelmcshinsky/slipstream-ui/commit/f5098857e9fbc2ac32bded9d5d98c7d67b2582b6) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - The last P1 migration gaps: marketing chrome, content typography, TOC and
  confirmations.

  New components:

  - SiteHeader — sticky marketing header: brand, horizontal nav with
    prefix-aware active states (aria-current), right-aligned actions and a
    built-in mobile Drawer; router-agnostic via linkComponent
  - SiteFooter — brand/tagline column, link columns and a legal bar, with
    safe external links and linkComponent for routers
  - Prose — self-contained long-form typography for rendered markdown/MDX
    (headings, links, lists, code, tables, quotes, figures); no
    @tailwindcss/typography dependency, keeps Shiki/KaTeX pipelines intact
  - TableOfContents + useScrollSpy — sticky "On this page" nav with nested
    levels and aria-current, plus an IntersectionObserver scroll-spy hook
  - ConfirmDialog — accessible confirmation built on Dialog with async
    pending state, destructive variant and cancellable actions

  Docs: five new pages, nav + search entries; registry/LLM regenerate to
  80 components (63 core / 17 AI).

  Verified: typecheck 14/14, lint 8/8, tests 10/10, build 10/10, 80
  manifests with zero drift, docs smoke 6/6.

### Patch Changes

- [#66](https://github.com/michaelmcshinsky/slipstream-ui/pull/66) [`09d41c1`](https://github.com/michaelmcshinsky/slipstream-ui/commit/09d41c16a4fc6b1c08abae9bb74267efd34a6876) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Add the typed i18n runtime with English, Arabic and Spanish catalogs, RTL
  direction helpers, Intl formatters and a client-only React entry. Localize the
  AI Chat Starter and add label overrides to `Reasoning` and `ToolCall`.

- [#66](https://github.com/michaelmcshinsky/slipstream-ui/pull/66) [`09d41c1`](https://github.com/michaelmcshinsky/slipstream-ui/commit/09d41c16a4fc6b1c08abae9bb74267efd34a6876) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Add the Tailwind v4 theme contract, manifest metadata for seven AI components,
  enum-value validation and JSX-children handling in `validate_usage`, and MCP
  registry metadata (`server.json` + `mcpName`). Also adds the 100-case
  validation benchmark and the AI Chat Starter.

## 0.4.0

### Minor Changes

- [`d2b9f4a`](https://github.com/michaelmcshinsky/slipstream-ui/commit/d2b9f4a90368b8ab7b844c9e4fb656c7894a6b7c) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Compound select and table shell.

  - SelectMenu: custom listbox for rich options — descriptions, icons,
    grouped headings, single/multi select, custom trigger and row
    rendering, hidden form inputs, and the full button/listbox keyboard
    model (arrows, Home/End, Enter/Space, Escape, first-letter typeahead,
    aria-activedescendant). Fills the last migration blocker from the
    dancestack audit (Radix-style compound Select with rich option content)
    without giving up the native `Select` default.
  - TableCard: list-page table shell — title/description, header actions,
    optional toolbar, edge-to-edge body (flush) and footer row for
    pagination/summary.
  - Docs pages, nav and search entries; registry/LLM docs regenerate to 73
    components (56 core / 17 AI).

- [`e6aec11`](https://github.com/michaelmcshinsky/slipstream-ui/commit/e6aec115a75f17b232d2d92d5fef83f88176f595) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Migration-readiness batch: shell, app patterns, async inputs, files, timelines.

  New components (core):

  - AppShell + Sidebar — responsive frame with a sectioned rail, sticky
    header, scrolling main and a built-in mobile Drawer; router-agnostic
    via `linkComponent` and `activeHref` (aria-current)
  - EmptyState, PageHeader, MetricCard, PasswordInput, AuthLayout,
    FilterBar — the app-pattern set every dashboard/website was hand-rolling
  - DatePicker, TimePicker — native date/time fields with ISO / HH:MM
    contracts and clear affordances
  - Stepper — ordered-list wizard indicator with aria-current=step and
    text states (not color-only)
  - FileUpload — native input + drop zone + removable list + per-file
    progress bars
  - Timeline — chronology on ordered-list semantics

  New APIs:

  - Imperative toasts: `toast.success/error/warning/info`, `toast.dismiss`,
    `toast.clear` + `<Toaster position richColors />` (useSyncExternalStore;
    provider/useToast unchanged)
  - Dialog: `size` presets (sm..2xl), `footer`, `scrollable`, `header` slot
    and composed parts (DialogHeader/DialogTitle/DialogDescription/
    DialogBody/DialogFooter) that pick up the aria ids
  - Select: `groups` (optgroups), `placeholder`, `multiple` (string[]
    contract)
  - Autocomplete: option objects, debounced async `loadOptions` with
    stale-response guard, grouped headings, descriptions, `renderOption`,
    `clearable`
  - `asChild` on Card, Badge and MenuItem for router links

  Docs: 14 new/expanded component pages, theming gains a documented
  z-index ladder, registry/LLM docs regenerate to 71 components.

- [`7bc8808`](https://github.com/michaelmcshinsky/slipstream-ui/commit/7bc8808cadabac03460a263dcde5bbde789ca640) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Pagination contracts and item summary.

  - Accept `currentPage` / `totalPages` as aliases for `page` / `pageCount`
    (migration-friendly for codebases using that naming).
  - Derive the page count from `total` + `pageSize` and render a
    "Showing 26–50 of 312 students" summary (`itemLabel`, `showSummary`).
  - Both `page` and `pageCount` are now optional; the nav falls back to
    page 1 of 1 when nothing is provided.

## 0.3.0

### Minor Changes

- [`ed44685`](https://github.com/michaelmcshinsky/slipstream-ui/commit/ed44685ac64fc8656560ffc9af19a64ad9c3bf8b) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Minor release prep: grouping components, overlay motion, and theme polish.

  New components (core):

  - InputGroup + InputGroupAddon — flush left/right addons (ghost/muted
    surfaces) behind one outer border; FormField wiring forwards to the
    nested field; addon padding on both sides so affixes breathe next to
    the input
  - CheckboxGroup + CheckboxGroupItem — multi-select counterpart of
    RadioGroup (shared name, legend, string[] selection)
  - ButtonGroup — joined segments with collapsed borders
  - RadioCard — whole clickable section per option: native circle hidden
    (sr-only), selection via has-[:checked] border+tint, optional rounded
    corners (rounded=false for square tiles)

  New props (core):

  - Dialog/Drawer `animate` — optional fade (dialog) / side-aware slide
    (drawer) in+out via usePresence exit window; reduced motion respected;
    off by default
  - RadioGroup/CheckboxGroup `orientation` (vertical|horizontal) and
    group-level `error` (role=alert inside the single fieldset)
  - Button semantic variants success/warning/info with audited AA
    foregrounds; Tabs rounded variant; Accordion borderless+gap; DataTable
    loadingRows; Confirmation approveVariant/rejectVariant/showActions (ai)
  - GapValue accepts tokens or exact pixels across Flex/Grid/Form/
    FormLayout/Accordion

  Theme:

  - Info color retuned from sky (198) to teal (176) in both modes —
    light-mode info now passes WCAG AA (4.04 → 6.36 against ink);
    updated in docs/app/playground globals, themes create-theme, CLI init
    template, and installation docs

## 0.2.0

### Minor Changes

- Slipstream 0.2.0 — Axial-inspired dark mode, six new components, and depth across the board.

  **New components:** Fieldset, FormField (label placement, tooltip, trailing slot), Text/Heading/Block typography, Flex/FlexItem + Grid/GridItem layout, List/ListItem, Search, Autocomplete, DataTable (config-driven: custom sort icons, sticky header, density, zebra, loading skeletons, row + column callbacks).

  **Design:** full token pivot on the axial.net language — dark surface ladder (background < card < popover), crisp navy borders, light-blue primary with AA contrast in both themes, 6px radii, fixed the invalid percent-hue success/warning/info tokens.

  **Component APIs:** Tabs variant (underline) + sizes + real arrow-key navigation, Dialog showClose, Breadcrumb onItemClick, Pagination showFirst/showLast/icons, Accordion custom icon + full-width headers, Confirmation color variants, Skeleton sizing props, portalled Tooltip (no more container scroll), Menu/Popover already portalled.

  **Docs:** browser-support tables on every component page, grouped accordion sidebar, full-width shell, nine guides, interactive MCP playground, five live templates, unique per-page SEO metadata, unified CodeBlock across all examples, `type` (not `interface`) codebase-wide.
