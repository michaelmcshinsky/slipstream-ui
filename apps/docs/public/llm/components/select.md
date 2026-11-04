# Select

Accessible select built on the native <select> with flat options, optgroups, a placeholder row and native multi-select.

> Import: `import { Select } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/select.json
> Tier: atom · Package: @slipstream-ui/core

## Design intent

Native selects keep platform keyboard, mobile picker and screen-reader behavior for free. Groups cover coarse categorization, placeholder renders the 'choose one' affordance, and multiple switches the contract to string[] for tag-picker use cases without reimplementing a listbox.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| options | `SelectOption[]` | — | no | Flat options ({ value, label, disabled? }). Ignored when groups is provided. |
| label | `string` | — | no | Visible label rendered and associated via htmlFor/aria |
| value | `string | string[]` | — | no | Controlled value (string, or string[] when multiple). |
| defaultValue | `string | string[]` | — | no | Initial value when uncontrolled. |
| onChange | `(value: string | string[]) => void` | — | no | Fired with the new value; string[] when multiple. |
| groups | `SelectOptionGroup[]` | — | no | Optgroups: [{ label, options }] rendered with a heading per section. |
| placeholder | `string` | — | no | Renders a disabled empty option as the 'choose one' affordance. |
| multiple | `boolean` | `false` | no | Native multi-select; value/defaultValue/onChange switch to string[]. |
| onValueChange | `(value: string | string[]) => void` | — | no | Alias for onChange — value-based callback. |

## Examples

### Grouped options

Optgroups with a placeholder row.

```tsx
<Select
  label="Plan"
  placeholder="Choose a plan"
  groups={[
    { label: 'Individual', options: [{ value: 'free', label: 'Free' }] },
    { label: 'Business', options: [{ value: 'team', label: 'Team' }] },
  ]}
/>
```

### Multi-select

Native listbox with a string[] contract.

```tsx
<Select
  label="Channels"
  multiple
  value={channels}
  onChange={setChannels}
  options={[{ value: 'email', label: 'Email' }, { value: 'slack', label: 'Slack' }]}
/>
```

### Controlled select

Keep the selected value in state and render it back through value.

```tsx
const [size, setSize] = useState('default');

<Select
  label="Size"
  value={size}
  onChange={setSize}
  options={[
    { value: 'default', label: 'Default' },
    { value: 'sm', label: 'Small' },
    { value: 'lg', label: 'Large' },
  ]}
/>
```

## Anti-patterns

- **Do not build a custom listbox for simple choices** — Hand-rolled listboxes rarely match native keyboard and screen-reader behavior. Use Select for flat option lists; consider CommandPalette for searchable command surfaces.

## Accessibility

- **Label association**: A visible label is connected with htmlFor/id; without one, aria-label is forwarded to the native select.
- **Platform keyboard and screen-reader support**: Built on the native select element, inheriting its full support matrix.

## Composition

- Compose with **Button** — Pair Select with Button in filter toolbars; Button submits, Select filters.
- Related: Button, Input

