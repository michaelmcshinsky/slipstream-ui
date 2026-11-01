# Select

Accessible select primitive built on the native select element with controlled and uncontrolled modes

> Import: `import { Select } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/select.json
> Tier: atom · Package: @slipstream-ui/core

## Design intent

Most dropdown needs are satisfied by the platform select: it brings complete keyboard, screen-reader and mobile behavior for free and never strands focus. This primitive adds consistent styling and a typed options API without re-implementing a listbox.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| options | `SelectOption[]` | — | yes | Options to render; each is { value, label, disabled? } |
| label | `string` | — | no | Visible label rendered and associated via htmlFor/aria |
| value | `string` | — | no | Controlled selected value |
| defaultValue | `string` | — | no | Uncontrolled initial value |
| onChange | `(value: string) => void` | — | no | Called with the newly selected value |

## Examples

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

