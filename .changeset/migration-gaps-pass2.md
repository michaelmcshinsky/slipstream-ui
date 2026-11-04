---
"@slipstream-ui/core": minor
"@slipstream-ui/ai": minor
---

Migration-readiness pass 2: the gaps surfaced by re-auditing dancestack,
floorpass and the two profile sites against the current library.

Variants and aliases (P0 for floorpass):
- Badge gains success/warning/info/primary/danger (primary and danger are
  aliases for default/destructive)
- Button gains primary/danger aliases and a loading state (spinner,
  disabled, aria-busy, sr-only announcement)

New components:
- Link: default/muted/underline/arrow/external variants, asChild for
  router links, auto external detection (target=_blank + rel=noopener
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
  + ring) so FormField's error wiring is visible
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
