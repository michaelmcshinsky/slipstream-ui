# DatePicker

Native date field with an ISO-string contract, min/max passthrough and an optional clear button.

> Import: `import { DatePicker } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/date-picker.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

A custom calendar is a large accessibility surface. The platform date picker already handles locale formatting, keyboard editing and mobile wheels, so DatePicker standardizes the ISO contract and a clear affordance instead of reimplementing a calendar.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| value | `string` | — | no | ISO date (YYYY-MM-DD), controlled. |
| defaultValue | `string` | — | no | ISO date, initial value. |
| onValueChange | `(value: string) => void` | — | no | Fired with the ISO string; '' when cleared. |
| clearable | `boolean` | `false` | no | Shows a clear button once a value exists. |
| clearLabel | `string` | `Clear date` | no | Accessible label for the clear button. |

## Examples

### ISO date field

Controlled ISO value with a clear button.

```tsx
<DatePicker
  aria-label="Start date"
  value={start}
  onValueChange={setStart}
  clearable
/>
```

## Anti-patterns

- **Don't store locale-formatted strings** — The contract is YYYY-MM-DD; format for display at the edge.

## Accessibility

- **Platform input**: Renders input[type=date] so OS pickers and keyboard editing apply

## Composition

- Compose with **FormField** — Wrap for label/hint/error wiring
  
  ```tsx
  <FormField id="start" label="Start date"><DatePicker /></FormField>
  ```
- Related: TimePicker, FormField, Input

