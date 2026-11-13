# @slipstream-ui/themes

## 0.8.0

### Patch Changes

- [#101](https://github.com/michaelmcshinsky/slipstream-ui/pull/101) [`8a5b115`](https://github.com/michaelmcshinsky/slipstream-ui/commit/8a5b11558942b43708241d7a5a81282586fff1a9) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Neutral graphite dark palette and localized docs navigation.
  
  - `createTheme` dark mode replaces the navy-tinted surface ladder with a
    neutral graphite ladder (`background < card < popover`) and matching
    near-black ink on solid semantic fills. Light mode tokens are unchanged.
  - The `init` command writes the same graphite dark values, so generated
    projects match the shipped theme.
  - `@slipstream-ui/i18n` adds `nav` and marketing message namespaces across
    `ar`, `en`, `es`, `ja`, `ko`, `ru` and `zh`, and the locale switcher now
    reads the active locale label from the message catalog.

## 0.6.1

### Patch Changes

- Fix the modal-layer effect cleanup so it captures the current layer id, and
  allow Tailwind CSS v4 as a peer alongside v3.4 because the package ships the
  v4 theme contract.

## 0.6.0

### Minor Changes

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

### Patch Changes

- [#68](https://github.com/michaelmcshinsky/slipstream-ui/pull/68) [`876be12`](https://github.com/michaelmcshinsky/slipstream-ui/commit/876be124dd63ac553e83465a1130eed3a1c9ba6d) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Integration fixes surfaced by adopting Slipstream in a Next.js App Router site: `Badge` gains `neutral` and `accent` variants and now renders an inline `span`, `Alert` accepts `danger` as an alias of `destructive`, `EmptyState` accepts an `actions` alias and a `titleAs` heading level, `Textarea` stops narrowing native `value`/`onChange` so react-hook-form and other native form libraries type-check, the `add` command resolves peer dependencies from the correct manifest and drops two unused bindings, and the Tailwind v4 docs point at the prebuilt `@slipstream-ui/themes/styles.css` defaults.

## 0.5.0

### Minor Changes

- [#66](https://github.com/michaelmcshinsky/slipstream-ui/pull/66) [`09d41c1`](https://github.com/michaelmcshinsky/slipstream-ui/commit/09d41c16a4fc6b1c08abae9bb74267efd34a6876) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Add the Tailwind v4 theme contract, manifest metadata for seven AI components,
  enum-value validation and JSX-children handling in `validate_usage`, and MCP
  registry metadata (`server.json` + `mcpName`). Also adds the 100-case
  validation benchmark and the AI Chat Starter.

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
