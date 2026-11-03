# @slipstream-ui/themes

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
