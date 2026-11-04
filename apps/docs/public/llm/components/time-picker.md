# TimePicker

Native time field with an HH:MM contract and an optional clear button.

> Import: `import { TimePicker } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/time-picker.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Like DatePicker: the platform time control is already accessible and locale-aware. TimePicker standardizes the HH:MM contract and clear affordance.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| value | `string` | — | no | "HH:MM" (24h), controlled. |
| defaultValue | `string` | — | no | "HH:MM", initial value. |
| onValueChange | `(value: string) => void` | — | no | Fired with the time string; '' when cleared. |
| clearable | `boolean` | `false` | no | Shows a clear button once a value exists. |

## Examples

### Time field

Controlled HH:MM value.

```tsx
<TimePicker aria-label="Starts at" value={start} onValueChange={setStart} clearable />
```

## Anti-patterns

- **Don't mix 12h display with 24h state** — State stays HH:MM; format for display with Intl.

## Accessibility

- **Platform input**: Renders input[type=time]

## Composition

- Compose with **DatePicker** — Pair for date+time scheduling
  
  ```tsx
  <DatePicker aria-label="Date" /><TimePicker aria-label="Time" />
  ```
- Related: DatePicker, FormField, Input

