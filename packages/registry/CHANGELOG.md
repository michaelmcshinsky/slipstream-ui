# @slipstream-ui/registry

## 0.2.1

### Patch Changes

- [#66](https://github.com/michaelmcshinsky/slipstream-ui/pull/66) [`09d41c1`](https://github.com/michaelmcshinsky/slipstream-ui/commit/09d41c16a4fc6b1c08abae9bb74267efd34a6876) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Add the Tailwind v4 theme contract, manifest metadata for seven AI components,
  enum-value validation and JSX-children handling in `validate_usage`, and MCP
  registry metadata (`server.json` + `mcpName`). Also adds the 100-case
  validation benchmark and the AI Chat Starter.

## 0.2.0

### Minor Changes

- Slipstream 0.2.0 — Axial-inspired dark mode, six new components, and depth across the board.

  **New components:** Fieldset, FormField (label placement, tooltip, trailing slot), Text/Heading/Block typography, Flex/FlexItem + Grid/GridItem layout, List/ListItem, Search, Autocomplete, DataTable (config-driven: custom sort icons, sticky header, density, zebra, loading skeletons, row + column callbacks).

  **Design:** full token pivot on the axial.net language — dark surface ladder (background < card < popover), crisp navy borders, light-blue primary with AA contrast in both themes, 6px radii, fixed the invalid percent-hue success/warning/info tokens.

  **Component APIs:** Tabs variant (underline) + sizes + real arrow-key navigation, Dialog showClose, Breadcrumb onItemClick, Pagination showFirst/showLast/icons, Accordion custom icon + full-width headers, Confirmation color variants, Skeleton sizing props, portalled Tooltip (no more container scroll), Menu/Popover already portalled.

  **Docs:** browser-support tables on every component page, grouped accordion sidebar, full-width shell, nine guides, interactive MCP playground, five live templates, unique per-page SEO metadata, unified CodeBlock across all examples, `type` (not `interface`) codebase-wide.
