# FilterBar

List-page filter strip: search field, filter controls, reset affordance and trailing actions.

> Import: `import { FilterBar } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/filter-bar.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Filter rows drift: some pages wrap, some scroll, resets appear inconsistently. FilterBar fixes the order (search → filters → reset → trailing) and keeps the strip compact on narrow screens.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| searchValue | `string` | — | no | Controlled search text. |
| onSearchChange | `(value: string) => void` | — | no | Fires on each keystroke; hides the search box when omitted. |
| searchPlaceholder | `string` | `Search…` | no | Search input placeholder (also its accessible name). |
| onReset | `() => void` | — | no | Shows a reset button when provided. |
| activeCount | `number` | `0` | no | Active filter count appended to the reset and filter labels. |
| onOpenFilters | `() => void` | — | no | Shows a Filters button and opens a filter panel or mobile drawer. |
| filtersLabel | `string` | `Filters` | no | Filter button label. |
| resultsCount | `number` | — | no | Result count shown before the trailing slot. |
| resultsLabel | `string` | `results` | no | Noun for the result count. |
| trailing | `ReactNode` | — | no | Far-right actions (bulk actions, column settings). |

## Examples

### List filters

Search, filters, reset and count in one strip.

```tsx
<FilterBar
  searchValue={query}
  onSearchChange={setQuery}
  searchPlaceholder="Search students"
  onReset={resetFilters}
  activeCount={activeFilters}
  onOpenFilters={() => setPanelOpen(true)}
  resultsCount={312}
>
  <Select label="Status" options={statusOptions} />
</FilterBar>
```

## Anti-patterns

- **Don't put the primary action in the bar** — FilterBar is for narrowing; creation actions belong in PageHeader actions.

## Accessibility

- **Search landmark**: Wraps controls in role=search; the search input is labelled by its placeholder

## Composition

- Compose with **Select** — Filter controls render in children
  
  ```tsx
  <FilterBar><Select … /></FilterBar>
  ```
- Related: DataTable, Select, Input, PageHeader

