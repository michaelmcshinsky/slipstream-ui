# @slipstream-ui/core

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
