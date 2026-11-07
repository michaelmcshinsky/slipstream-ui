# RangeSlider

Dual-thumb numeric range slider with labeled native inputs and formatted values.

> Import: `import { RangeSlider } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/range-slider.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Data dashboards need a low/high range for revenue, EBITDA or dates, but a single range input cannot express two thumbs accessibly. RangeSlider composes two native range inputs so keyboard and screen-reader behavior stay native while the track renders one selection.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| value | `[number, number]` | — | no | Controlled low/high pair. |
| defaultValue | `[number, number]` | — | no | Initial low/high pair when uncontrolled. Defaults to [min, max]. |
| onValueChange | `(value: [number, number]) => void` | — | no | Fires with the next low/high pair. |
| min | `number` | `0` | no | Lower bound. |
| max | `number` | `100` | no | Upper bound. |
| step | `number` | `1` | no | Increment. |
| startLabel | `string` | `Minimum` | no | Accessible label for the low thumb. |
| endLabel | `string` | `Maximum` | no | Accessible label for the high thumb. |
| formatValue | `(value: number) => string` | — | no | Formats the displayed values and aria-valuetext. |
| showValues | `boolean` | `true` | no | Show the current low/high values above the track. |
| disabled | `boolean` | — | no | Disable both thumbs. |

## Examples

### Revenue range

A five-to-one-hundred million revenue filter.

```tsx
<RangeSlider
  min={5}
  max={100}
  defaultValue={[5, 100]}
  startLabel="Revenue minimum"
  endLabel="Revenue maximum"
  formatValue={(value) => `$${value}M`}
  onValueChange={setRevenue}
/>
```

## Anti-patterns

- **Don't use a single range input for two values** — A single thumb cannot express a minimum and maximum. Use RangeSlider when both ends are adjustable.
- **Don't hide the labels** — Each thumb needs a distinct accessible name so screen-reader users know which end they are changing.

## Accessibility

- **Native range inputs**: Two input[type=range] elements with individual aria-label and aria-valuetext
- **Non-crossing thumbs**: The low thumb cannot move above the high thumb and vice versa

## Composition

- Compose with **FilterPanel** — Place RangeSlider inside a filter panel or FilterBar for live numeric filtering
  
  ```tsx
  <FilterBar><RangeSlider defaultValue={[5, 100]} /></FilterBar>
  ```
- Related: FilterChips, FilterBar, SegmentedControl

