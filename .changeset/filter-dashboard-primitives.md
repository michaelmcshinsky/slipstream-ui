---
"@slipstream-ui/core": minor
---

Add the dashboard filter layer: `MultiSelect`, `FilterPanel`,
`DateRangePicker` and `AppliedFilters`.

`MultiSelect` pairs a searchable checkbox panel with removable chips outside
the trigger. `FilterPanel` owns collapsible sections and reset/apply actions
without owning filter values. `DateRangePicker` uses an ISO string contract and
keeps the end on or after the start. `AppliedFilters` wraps `FilterChips` with
a live count and an edit action.
