---
id: SLIP-073
title: "Filter panel, multi-select and date-range primitives for dashboards"
epic: 7
priority: P0
estimate_hours: 18
milestone: "M7 Axial adoption"
labels: ["epic:adoption", "type:feature", "p0"]
depends_on: ["SLIP-070"]
---

**Context.** `FilterBar` covers a single search field and simple controls.
Dashboard and marketplace pages need a filter panel with multi-select,
date-range, applied-filter chips, and a clear-all path.

**Scope.**
- `FilterPanel` (sections, collapsible groups, apply/reset).
- `MultiSelect` (searchable, chips, select-all, keyboard).
- `DateRangePicker` (start/end, presets, ISO contract).
- `AppliedFilters` (removable chips, clear all, count).
- `FilterBar` v2 integration.

**Acceptance criteria**

- [x] All controls are keyboard operable and screen-reader labelled.
- [x] Date range returns ISO strings and handles empty/partial ranges.
- [x] Applied filters can be removed individually and all at once.
- [x] Works at 320px and inside a narrow sidebar.
- [x] Manifests, tests, axe, docs, registry/LLM output.

**Out of scope.** Server-side query building.

**Completed:** 2026-11-07. 4 components shipped: MultiSelect, FilterPanel, DateRangePicker and AppliedFilters. 104 components total (87 core + 17 AI); core 616 tests passed; docs build 144 routes.
