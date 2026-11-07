# AppliedFilters

Applied-filter summary with a live count, removable chips and an edit action.

> Import: `import { AppliedFilters } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/applied-filters.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Filter panels close, collapse or move into a drawer. AppliedFilters keeps the active set visible outside the panel and gives the user one place to edit or clear it.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| filters | `FilterChip[]` | — | yes | Active filters to display. |
| onClearAll | `() => void` | — | no | Clear-all action. |
| onEdit | `() => void` | — | no | Opens the filter panel for editing. |
| label | `string` | — | no | Optional summary text; defaults to N active. |
| emptyLabel | `string` | — | no | Shown when there are no filters. |
| editLabel | `string` | `Edit filters` | no | Edit action label. |

## Examples

### Applied dashboard filters

A count, removable chip and edit action.

```tsx
<AppliedFilters
  filters={[
    { key: 'industry', label: 'Industry', value: 'Technology', onRemove: remove },
  ]}
  onClearAll={clearAll}
  onEdit={openPanel}
/>
```

## Anti-patterns

- **Don't duplicate FilterChips** — AppliedFilters already renders FilterChips. Use one summary per filter surface.

## Accessibility

- **Live summary**: The wrapper uses aria-live=polite so count changes are announced
- **Remove and clear**: Delegates to FilterChips, which names each remove button and the clear action

## Composition

- Compose with **FilterPanel** — Pair AppliedFilters with the panel; onEdit opens the panel or drawer
  
  ```tsx
  <AppliedFilters filters={chips} onEdit={() => setOpen(true)} />
  ```
- Related: FilterChips, FilterPanel, FilterBar

