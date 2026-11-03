# Radio

Native radio buttons grouped for mutually exclusive choices, with an accessible fieldset/legend wrapper

> Import: `import { Radio } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/radio.json
> Tier: atom · Package: @slipstream-ui/core

## Design intent

Radio lets users pick exactly one option from a visible set. RadioGroup provides the shared name and accessible legend so screen readers announce group context.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| value | `string` | — | yes | The value this item contributes to the group |
| label | `string` | — | no | Visible label rendered next to the radio |
| checked | `boolean` | — | no | Controlled checked state (on Radio) |
| onCheckedChange | `(checked: boolean) => void` | — | no | Fired when the user selects this radio (on Radio) |
| disabled | `boolean` | `false` | no | Disables the radio |
| legend | `string` | — | no | Accessible group label; rendered as <legend> inside a fieldset (RadioGroup component) |
| onValueChange | `(value: string) => void` | — | no | Called with the newly selected value (RadioGroup component) |
| orientation | `'vertical' | 'horizontal'` | `vertical` | no | Stack options (default) or lay them out in a wrapping row (RadioGroup component) |
| error | `string` | — | no | Group-level validation message; announced via role=alert (RadioGroup component) |
| defaultValue | `string` | — | no | Initial selected value when uncontrolled (RadioGroup component) |

## Examples

### Radio group

Mutually exclusive plan selection

```tsx
<RadioGroup name="plan" legend="Choose a plan" defaultValue="free">
  <RadioGroupItem value="free" label="Free" />
  <RadioGroupItem value="pro" label="Pro" />
</RadioGroup>
```

### Controlled group

Group driven by parent state

```tsx
<RadioGroup
  name="plan"
  legend="Plan"
  value={plan}
  onValueChange={setPlan}
>
  <RadioGroupItem value="free" label="Free" />
  <RadioGroupItem value="pro" label="Pro" />
</RadioGroup>
```

## Anti-patterns

- **Don't use Radio for multi-select** — Radio is single-choice. Use Checkbox when users can pick more than one option.
- **Don't render bare radios without a group** — Without RadioGroup there is no shared name or legend, so screen readers can't convey the grouping.

## Accessibility

- **Group semantics**: RadioGroup renders a fieldset with a legend so the group name is announced
- **Arrow-key navigation**: Native radio behavior: arrows move selection within the group

## Composition

- Compose with **RadioGroup** — Always wrap Radio/RadioGroupItem in a RadioGroup
  
  ```tsx
  <RadioGroup name="x" legend="Choose"><RadioGroupItem value="a" label="A" /></RadioGroup>
  ```
- Related: Checkbox, Select, Label

