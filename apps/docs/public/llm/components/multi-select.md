# MultiSelect

Searchable multi-select filter with visible removable chips and a checkbox panel.

> Import: `import { MultiSelect } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/multi-select.json
> Tier: organism · Package: @slipstream-ui/core

## Design intent

Dashboard filters need to show the selected set without opening the control. MultiSelect pairs a searchable checkbox panel with chips outside the trigger, so the applied filters stay visible and removable.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| options | `MultiSelectOption[]` | — | yes | Options to choose from: value, label, optional description, group and disabled. |
| value | `string[]` | — | no | Controlled selected values. |
| defaultValue | `string[]` | — | no | Initial selected values when uncontrolled. |
| onValueChange | `(values: string[]) => void` | — | no | Fires with the full selection after every change. |
| label | `string` | — | no | Visible field label; also names the trigger. |
| triggerLabel | `string` | `Add` | no | Trigger text when nothing is selected. |
| searchPlaceholder | `string` | `Search options` | no | Search placeholder and accessible name. |
| emptyText | `string` | `No options` | no | Shown when no option matches. |
| maxDisplay | `number` | `3` | no | Maximum chips shown before a +N more summary. |
| disabled | `boolean` | — | no | Disable the trigger and chip removal. |

## Examples

### Industry filter

Selected industries stay visible as chips.

```tsx
<MultiSelect
  label="Industry"
  value={industries}
  onValueChange={setIndustries}
  options={[
    { value: 'technology', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
  ]}
/>
```

## Anti-patterns

- **Don't put the chips inside the trigger** — Chips carry remove buttons; nesting them in the trigger button creates invalid controls and conflicting click targets.

## Accessibility

- **Named trigger**: The trigger is named by the visible label and exposes aria-haspopup=dialog and aria-expanded
- **Native checkboxes**: Options are native checkbox inputs with wrapping labels
- **Chip removal**: Each chip has a Remove <option> button

## Composition

- Compose with **FilterPanel** — Place MultiSelect inside a FilterPanel section
  
  ```tsx
  <FilterPanel sections={[{ title: 'Industry', content: <MultiSelect ... /> }]} />
  ```
- Compose with **AppliedFilters** — AppliedFilters summarizes the same state outside the panel
  
  ```tsx
  <AppliedFilters filters={chips} />
  ```
- Related: FilterPanel, AppliedFilters, FilterChips, SelectMenu

