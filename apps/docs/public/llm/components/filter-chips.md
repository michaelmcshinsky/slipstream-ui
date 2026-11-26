# FilterChips

Active-filter summary with removable chips and a clear-all action.

> Component ID: `filter-chips`
> Import: `import { FilterChips } from '@slipstream-ui/core'`
> Docs: https://slipstreamui.com/docs/components/filter-chips
> Registry: https://slipstreamui.com/registry/filter-chips.json
> Tier: molecule · Package: @slipstream-ui/core@0.11.1
> Manifest schema: v1 · manifest: v1

## Design intent

Filter bars collapse, scroll or hide on mobile, so users lose track of what is applied. FilterChips keeps the active set visible, with one remove action per filter and an optional reset.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| filters | `FilterChip[]` | — | yes | Active filters: key, label, optional value and onRemove. |
| size | `'sm' | 'md' | 'lg'` | `md` | no | Chip scale: padding, text size and remove-button icon size. |
| onClearAll | `() => void` | — | no | Shows a clear-all action when provided. |
| clearLabel | `string` | `Clear all` | no | Label for the clear-all action. |
| emptyLabel | `string` | — | no | Shown when there are no active filters. Nothing renders when omitted. |

## Examples

### Applied dashboard filters

A removable summary of two applied filters.

```tsx
<FilterChips
  filters={[
    { key: 'industry', label: 'Industry', value: 'Technology', onRemove: () => remove('industry') },
    { key: 'region', label: 'Region', value: 'Mountain', onRemove: () => remove('region') },
  ]}
  onClearAll={clearAll}
/>
```

## Anti-patterns

- **Don't duplicate the filter controls** — FilterChips summarizes applied filters; the select, slider or segmented control still owns input.

## Accessibility

- **Group name**: Renders role=group with aria-label Active filters by default
- **Remove buttons**: Each remove button is named Remove <label>: <value>

## Composition

- Compose with **FilterBar** — Place FilterChips directly under FilterBar so applied filters remain visible
  
  ```tsx
  <FilterBar /><FilterChips filters={filters} onClearAll={clearAll} />
  ```
- Compose with **SegmentedControl** — Use FilterChips to summarize multi-select segments
  
  ```tsx
  <SegmentedControl multiple /><FilterChips filters={chips} />
  ```
- Related: FilterBar, SegmentedControl, RangeSlider

