# DateRangePicker

Start/end date range with ISO strings and quick presets.

> Import: `import { DateRangePicker } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/date-range-picker.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Dashboards filter by rolling periods and custom date ranges. DateRangePicker provides an ISO contract and preset shortcuts while using the native date fields for keyboard and platform behavior.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| value | `DateRange` | — | no | Controlled range with ISO start/end strings. |
| defaultValue | `DateRange` | — | no | Initial range when uncontrolled. |
| onValueChange | `(range: DateRange) => void` | — | no | Fires with the next ISO range. |
| startLabel | `string` | `From` | no | Accessible label for the start field. |
| endLabel | `string` | `To` | no | Accessible label for the end field. |
| presets | `DateRangePreset[]` | — | no | Preset buttons. Defaults to 7 days, 30 days, 90 days and YTD. |
| showPresets | `boolean` | `true` | no | Show the preset row. |
| disabled | `boolean` | — | no | Disable the preset buttons and both date fields. |

## Examples

### Rolling range

A controlled range with two presets.

```tsx
<DateRangePicker
  value={range}
  onValueChange={setRange}
  presets={[
    { label: '7 days', days: 7 },
    { label: 'YTD', ytd: true },
  ]}
/>
```

## Anti-patterns

- **Don't use a single date field for a range** — A range needs two independent ends. Use DateRangePicker so partial ranges and ordering are handled.

## Accessibility

- **Labelled date fields**: Each native date input has a visible associated label
- **Ordered range**: The end cannot precede the start; changing the start past the end moves the end

## Composition

- Compose with **FilterPanel** — Place DateRangePicker inside a FilterPanel section
  
  ```tsx
  <FilterPanel sections={[{ title: 'Period', content: <DateRangePicker ... /> }]} />
  ```
- Related: DatePicker, FilterPanel, AppliedFilters

