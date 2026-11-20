# @slipstream-ui/ai

## 0.10.0

### Minor Changes

- [#146](https://github.com/michaelmcshinsky/slipstream-ui/pull/146) [`ad40d9d`](https://github.com/michaelmcshinsky/slipstream-ui/commit/ad40d9d66d092506d0cf89e9d788f0c272bd885b) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - feat: form-control contrast, overlay polish and density options
  
  Light-mode fixes
  
  - `createTheme()` now records `colorScheme` and `themeToCssVariables()` emits
    `color-scheme`, so native chrome (scrollbars, checkboxes, radios, the date
    picker panel) follows the theme instead of a dark OS preference. The docs
    theme pins `color-scheme: light` on `:root` for the same reason.
  - `Checkbox` and `Radio` set `accent-primary`, so the checked fill is the brand
    colour instead of the UA accent.
  - `RangeSlider` gives the thumb a primary fill with a background-coloured ring
    and a `md` shadow, and the unfilled rail uses `border` instead of `muted`, so
    the control reads on a white page.
  
  New props
  
  - `Tooltip` gains `variant: 'default' | 'inverse'` — the inverse surface is
    navy in light mode and white in dark mode.
  - `Select` gains `labelHidden` for filter bars and toolbars: the label stays the
    accessible name but no longer pushes the control out of alignment.
  - `FilterChips` gains `size: 'sm' | 'md' | 'lg'`.
  - `Message` gains `density` and `surface`; `Conversation` gains `density` and
    `messageSurface`; `PromptInput` gains `density` and `surface`. Together they
    cover tighter chat layouts and borderless or tinted bubbles.
  - `StreamingIndicator` gains `size`, `tone`, `dotCount` and `showLabel`.
  
  Visual fixes
  
  - `Timeline` draws one connector rail per item that starts at the dot's bottom
    edge and runs into the next dot; the flex-column connector left a gap at each
    item boundary.
  - `Drawer` paints the backdrop (`bg-background/80`) and fades it with the panel,
    so page content no longer flashes through during close.
  - `Accordion` keeps the panel mounted through a 300ms grid-row and opacity
    transition, so collapse animates instead of disappearing on the closing
    frame.

### Patch Changes

- Updated dependencies [[`ad40d9d`](https://github.com/michaelmcshinsky/slipstream-ui/commit/ad40d9d66d092506d0cf89e9d788f0c272bd885b)]:
  - @slipstream-ui/core@0.10.0

## 0.9.1

### Patch Changes

- [#137](https://github.com/michaelmcshinsky/slipstream-ui/pull/137) [`7e59910`](https://github.com/michaelmcshinsky/slipstream-ui/commit/7e5991043bf14b5adf44b97b48e09f100e3ba0dd) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Modern Web Guidance modernization fixes across the repository:
  
  - **Dark mode toggles**: Updated all apps (app, playground, ai-chat starter, docs) to use `<meta name="color-scheme">` with CSS `:has()` selector mapping instead of toggling `.dark` class on `<html>`. This follows the modern-web-guidance `dark-mode-toggle` guide for proper color-scheme synchronization.
  
  - **Form field auto-sizing**: Updated `PromptInput` to use CSS `field-sizing: content` with progressive enhancement fallback instead of imperative scrollHeight resizing.
  
  - **IME-safe enter-to-submit**: Added composition checks (`event.nativeEvent.isComposing` and `keyCode === 229`) to all Enter handlers in PromptInput and Message components to prevent premature submission during CJK input.
  
  - **Modern array methods**: Replaced `[...messages].reverse().find()` with `messages.findLast()` in ai-chat starter.
  
  - **Error cause chaining**: Updated CLI config to use `{ cause: error }` option when throwing errors.
  
  Updated documentation in docs app to reflect the new dark mode approach.

## 0.9.0

### Minor Changes

- [#121](https://github.com/michaelmcshinsky/slipstream-ui/pull/121) [`f1d340c`](https://github.com/michaelmcshinsky/slipstream-ui/commit/f1d340c960e93c452a59dbe63a53ca35102c4fae) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - feat(i18n): localize the marketing lab, chat demo and docs shell
  
  `Stepper` accepts `labels` (`completed`, `current`, `upcoming`) so the
  screen-reader state suffix is no longer English-only. `DataTable` accepts
  `selectedLabel` (`{count} selected` by default) for the selection summary
  above the table. `Conversation` accepts `userLabel`, `assistantLabel` and
  `labels` (`transcript`, `responseComplete`, `loadEarlier`, `loadingEarlier`,
  `latest`, `download`) and forwards the role labels to each `Message`.
  
  The docs shell gained a `site.translation` message group used by the
  "this page is English only for now" notice, and `LocaleSwitcher` now uses
  logical padding and inset so the caret stays on the trailing side in RTL.

- [#124](https://github.com/michaelmcshinsky/slipstream-ui/pull/124) [`afdab6f`](https://github.com/michaelmcshinsky/slipstream-ui/commit/afdab6f40000cae6e9771185c8cf528cad3fbbf1) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - feat(core): add Image, nested SiteHeader menus, and a primary ink token
  
  `Image` fills the last media gap in the library: `src` → `fallbackSrc` →
  `fallback` node, intrinsic `width`/`height` on every render, `decoding="async"`,
  and `priority` for the single LCP image. It is manifested with the fallback and
  alt-text rules.
  
  `SiteHeader` accepts nested `columns` on an item. Desktop renders a disclosure
  trigger with `aria-expanded`/`aria-controls`, opens on hover or click, stays
  open while tabbing, and closes on Escape or an outside pointer. The mobile
  drawer renders the same groups as native `<details>` disclosures.
  
  `primary-ink` joins the theme contract: a darker primary for text roles on
  light surfaces and `primary/10` tints, and the lightened primary in dark mode.
  `Link`, the Sidebar active item, `PageHeader`/`SectionHeading` eyebrows,
  `ArticleCard`/`CTASection` eyebrows, and the highlighted `ComparisonTable`
  column now use it. `bg-primary` is unchanged for fills.
  
  The dark-mode \destructive\ text token is lightened slightly so it clears 4.5:1 on the popover surface; the previous value missed by 0.002.

- [#110](https://github.com/michaelmcshinsky/slipstream-ui/pull/110) [`ef31109`](https://github.com/michaelmcshinsky/slipstream-ui/commit/ef311099c8603e6e791aa8b13b7c2b8caae33b1e) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - feat(core): Popover placement and a Calendar date grid
  
  `PopoverContent` gained `side`, `align`, `sideOffset`, `alignOffset`,
  `collisionPadding` and `matchTriggerWidth`, plus a `PopoverAnchor` element. The
  panel now flips to the opposite side when the preferred one cannot fit, clamps
  inside the viewport, and repositions on scroll instead of closing.
  
  Note: the old panel right-aligned to the trigger; the default is now
  `align="start"`, which left-aligns. Consumers that relied on the previous
  right edge can pass `align="end"`.
  
  New `Calendar` renders a six-week month grid with ISO `YYYY-MM-DD` values,
  min/max, `isDateDisabled`, locale-aware labels, week start, and keyboard
  navigation (arrows, Home/End, PageUp/PageDown, Enter) with a single roving tab
  stop. `DatePickerPopover` composes `Popover` + `Calendar` for a themed date
  field that still posts an ISO value through a hidden input.

### Patch Changes

- [#121](https://github.com/michaelmcshinsky/slipstream-ui/pull/121) [`f1d340c`](https://github.com/michaelmcshinsky/slipstream-ui/commit/f1d340c960e93c452a59dbe63a53ca35102c4fae) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - fix(a11y): dark-mode contrast and naming findings from the full audit
  
  - Calendar outside-month days move from `text-muted-foreground/50` (2.94:1 on
    the dark background) to `/80` (5.1:1).
  - Dark `destructive` lifts from 64% to 65% lightness: 4.47:1 → 4.64:1 as text
    on the popover surface.
  - The docs search button's accessible name now matches its rendered text, and
    the shortcut hint uses the same string as the label.

- [#119](https://github.com/michaelmcshinsky/slipstream-ui/pull/119) [`ac1eea6`](https://github.com/michaelmcshinsky/slipstream-ui/commit/ac1eea61ac2d3352862c72d6b08f4286149d03e7) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - fix(ai): render unlabelled fenced code as a block, and stop repairing identifiers
  
  - `Response` treated a fenced block with no language and a single line as inline code,
    because the inline test looked at the text after its trailing newline was stripped. It
    now tests the source text, so ```` ```\nfoo\n``` ```` renders through `CodeBlock`.
  - `closeIncompleteMarkdown` no longer appends a stray closer for identifiers: complete
    inline code spans are ignored when counting emphasis, and intraword underscores in
    `snake_case` are not treated as italic markers.
  - `CodeBlock` and `Response` now ship the jest-axe assertion the component pipeline
    requires, plus coverage for clipboard failure, overflow tab stops, unknown languages,
    empty input, raw HTML and unsafe link protocols, and dark-theme syntax switching.

- [#110](https://github.com/michaelmcshinsky/slipstream-ui/pull/110) [`ef31109`](https://github.com/michaelmcshinsky/slipstream-ui/commit/ef311099c8603e6e791aa8b13b7c2b8caae33b1e) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - fix(a11y): add a success ink token for text on success tints
  
  `text-success` on `bg-success/10` measured 4.11:1 in light mode, under the
  4.5:1 minimum for small text. `success-ink` joins `warning-ink` and `info-ink`:
  5.6:1 on a 10% tint in light mode and 7.9:1 on the dark card.
  
  The ToolCall `completed` chip, the Confirmation `approved` chip and the Alert
  `success` variant now use `text-success-ink`. A themes test pins both values and
  fails if the plain `success` token ever starts passing on a tint (which would
  mean the token contract changed).
- Updated dependencies [[`f1d340c`](https://github.com/michaelmcshinsky/slipstream-ui/commit/f1d340c960e93c452a59dbe63a53ca35102c4fae), [`f1d340c`](https://github.com/michaelmcshinsky/slipstream-ui/commit/f1d340c960e93c452a59dbe63a53ca35102c4fae), [`afdab6f`](https://github.com/michaelmcshinsky/slipstream-ui/commit/afdab6f40000cae6e9771185c8cf528cad3fbbf1), [`acdd742`](https://github.com/michaelmcshinsky/slipstream-ui/commit/acdd7424d7943c439a64bfe6959cb4a8b6a4aca3), [`ef31109`](https://github.com/michaelmcshinsky/slipstream-ui/commit/ef311099c8603e6e791aa8b13b7c2b8caae33b1e), [`ef31109`](https://github.com/michaelmcshinsky/slipstream-ui/commit/ef311099c8603e6e791aa8b13b7c2b8caae33b1e)]:
  - @slipstream-ui/core@0.9.0

## 0.8.0

### Patch Changes

- Updated dependencies [[`5a229c1`](https://github.com/michaelmcshinsky/slipstream-ui/commit/5a229c132991dd4ae565e0f4106f4066f961e017), [`ab21033`](https://github.com/michaelmcshinsky/slipstream-ui/commit/ab21033e7bf72b9e54126c9b653f0d7e8cfee1a1)]:
  - @slipstream-ui/core@0.8.0

## 0.7.0

### Patch Changes

- Updated dependencies [[`db0e184`](https://github.com/michaelmcshinsky/slipstream-ui/commit/db0e184ce7e2534013368c9a95f71fb8c6aecea6), [`db0e184`](https://github.com/michaelmcshinsky/slipstream-ui/commit/db0e184ce7e2534013368c9a95f71fb8c6aecea6)]:
  - @slipstream-ui/core@0.7.0

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
