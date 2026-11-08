# @slipstream-ui/ai

## 0.6.1

### Patch Changes

- Updated dependencies []:
  - @slipstream-ui/core@0.6.1

## 0.6.0

### Patch Changes

- [`6945e41`](https://github.com/michaelmcshinsky/slipstream-ui/commit/6945e4131dedc792a6e2cf512a9f4cdc1d0d3658) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Localize the remaining P1 component labels with optional props and English
  defaults: Autocomplete clear/suggestions, Breadcrumb landmark, DatePicker and
  TimePicker clear, FileUpload selected/remove/uploading, Search list label,
  CommandPalette dialog/list/empty, Toaster dismiss, Skeleton opt-in status
  label, and AppShell mobile-navigation labels. Message and Reasoning now accept
  `formatTime` or a BCP-47 `locale` for timestamps, and the AI Chat Starter
  passes the active locale. The i18n package gains an `en-XA` pseudo-locale
  catalog and providers accept `pseudo`, with a persisted playground toggle.
- Updated dependencies [[`a0b5723`](https://github.com/michaelmcshinsky/slipstream-ui/commit/a0b5723495cb31df3f814521aa34198ae359a23c), [`352e873`](https://github.com/michaelmcshinsky/slipstream-ui/commit/352e87336f87bd5f2ab5fc327d204af6f62a8944), [`9dfc268`](https://github.com/michaelmcshinsky/slipstream-ui/commit/9dfc2688503324e7f8dda0784643b688d5ce47b9), [`6945e41`](https://github.com/michaelmcshinsky/slipstream-ui/commit/6945e4131dedc792a6e2cf512a9f4cdc1d0d3658), [`876be12`](https://github.com/michaelmcshinsky/slipstream-ui/commit/876be124dd63ac553e83465a1130eed3a1c9ba6d), [`feaf8c6`](https://github.com/michaelmcshinsky/slipstream-ui/commit/feaf8c62252d54bc1d4a2fad5ecb4215a113011b), [`876be12`](https://github.com/michaelmcshinsky/slipstream-ui/commit/876be124dd63ac553e83465a1130eed3a1c9ba6d), [`9b07d2e`](https://github.com/michaelmcshinsky/slipstream-ui/commit/9b07d2e5a87623e8f3a9f9033364e711a9285212), [`5a8d403`](https://github.com/michaelmcshinsky/slipstream-ui/commit/5a8d403af48c4e6705f17a3d91227f35187920eb), [`1e8e062`](https://github.com/michaelmcshinsky/slipstream-ui/commit/1e8e062cabae7b0fbe8b9e13de9556ba553e8b38), [`876be12`](https://github.com/michaelmcshinsky/slipstream-ui/commit/876be124dd63ac553e83465a1130eed3a1c9ba6d), [`876be12`](https://github.com/michaelmcshinsky/slipstream-ui/commit/876be124dd63ac553e83465a1130eed3a1c9ba6d), [`7dca271`](https://github.com/michaelmcshinsky/slipstream-ui/commit/7dca2714066c74e461da4fb04262540f52e6714b)]:
  - @slipstream-ui/core@0.6.0

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

### Patch Changes

- [#66](https://github.com/michaelmcshinsky/slipstream-ui/pull/66) [`09d41c1`](https://github.com/michaelmcshinsky/slipstream-ui/commit/09d41c16a4fc6b1c08abae9bb74267efd34a6876) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Add the typed i18n runtime with English, Arabic and Spanish catalogs, RTL
  direction helpers, Intl formatters and a client-only React entry. Localize the
  AI Chat Starter and add label overrides to `Reasoning` and `ToolCall`.

- [#66](https://github.com/michaelmcshinsky/slipstream-ui/pull/66) [`09d41c1`](https://github.com/michaelmcshinsky/slipstream-ui/commit/09d41c16a4fc6b1c08abae9bb74267efd34a6876) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Add the Tailwind v4 theme contract, manifest metadata for seven AI components,
  enum-value validation and JSX-children handling in `validate_usage`, and MCP
  registry metadata (`server.json` + `mcpName`). Also adds the 100-case
  validation benchmark and the AI Chat Starter.
- Updated dependencies [[`09d41c1`](https://github.com/michaelmcshinsky/slipstream-ui/commit/09d41c16a4fc6b1c08abae9bb74267efd34a6876), [`768bac2`](https://github.com/michaelmcshinsky/slipstream-ui/commit/768bac237c0f83fffdb114322a68805fdb00539a), [`f509885`](https://github.com/michaelmcshinsky/slipstream-ui/commit/f5098857e9fbc2ac32bded9d5d98c7d67b2582b6), [`09d41c1`](https://github.com/michaelmcshinsky/slipstream-ui/commit/09d41c16a4fc6b1c08abae9bb74267efd34a6876)]:
  - @slipstream-ui/core@0.5.0

## 0.4.0

### Patch Changes

- Updated dependencies [[`d2b9f4a`](https://github.com/michaelmcshinsky/slipstream-ui/commit/d2b9f4a90368b8ab7b844c9e4fb656c7894a6b7c), [`e6aec11`](https://github.com/michaelmcshinsky/slipstream-ui/commit/e6aec115a75f17b232d2d92d5fef83f88176f595), [`7bc8808`](https://github.com/michaelmcshinsky/slipstream-ui/commit/7bc8808cadabac03460a263dcde5bbde789ca640)]:
  - @slipstream-ui/core@0.4.0

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

### Patch Changes

- Updated dependencies [[`ed44685`](https://github.com/michaelmcshinsky/slipstream-ui/commit/ed44685ac64fc8656560ffc9af19a64ad9c3bf8b)]:
  - @slipstream-ui/core@0.3.0

## 0.2.0

### Minor Changes

- Slipstream 0.2.0 — Axial-inspired dark mode, six new components, and depth across the board.

  **New components:** Fieldset, FormField (label placement, tooltip, trailing slot), Text/Heading/Block typography, Flex/FlexItem + Grid/GridItem layout, List/ListItem, Search, Autocomplete, DataTable (config-driven: custom sort icons, sticky header, density, zebra, loading skeletons, row + column callbacks).

  **Design:** full token pivot on the axial.net language — dark surface ladder (background < card < popover), crisp navy borders, light-blue primary with AA contrast in both themes, 6px radii, fixed the invalid percent-hue success/warning/info tokens.

  **Component APIs:** Tabs variant (underline) + sizes + real arrow-key navigation, Dialog showClose, Breadcrumb onItemClick, Pagination showFirst/showLast/icons, Accordion custom icon + full-width headers, Confirmation color variants, Skeleton sizing props, portalled Tooltip (no more container scroll), Menu/Popover already portalled.

  **Docs:** browser-support tables on every component page, grouped accordion sidebar, full-width shell, nine guides, interactive MCP playground, five live templates, unique per-page SEO metadata, unified CodeBlock across all examples, `type` (not `interface`) codebase-wide.

### Patch Changes

- Updated dependencies []:
  - @slipstream-ui/core@0.2.0
