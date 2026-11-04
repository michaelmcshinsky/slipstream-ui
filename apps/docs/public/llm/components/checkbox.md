# Checkbox

A native checkbox input styled to match the design system, plus CheckboxGroup for grouping related options under an accessible legend

> Import: `import { Checkbox } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/checkbox.json
> Tier: atom · Package: @slipstream-ui/core

## Design intent

The Checkbox component is the standard way to let users select zero or more options from a set. It wraps the native input so keyboard, form, and screen-reader behavior is identical to platform checkboxes. CheckboxGroup is the multi-select counterpart of RadioGroup: shared name, fieldset/legend context, and the selection as a string[].

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| checked | `boolean` | — | no | Controlled checked state; omit for uncontrolled usage |
| defaultChecked | `boolean` | — | no | Initial checked state when uncontrolled |
| onCheckedChange | `(checked: boolean) => void` | — | no | Fired when the user toggles the checkbox |
| disabled | `boolean` | `false` | no | Disables the checkbox |
| className | `string` | — | no | Additional CSS classes to apply |
| legend | `string` | — | no | Accessible group label; rendered as <legend> inside a fieldset (CheckboxGroup component) |
| onValueChange | `(value: string[]) => void` | — | no | Called with the full selection after a toggle (CheckboxGroup component) |
| orientation | `'vertical' | 'horizontal'` | `vertical` | no | Stack options (default) or lay them out in a wrapping row (CheckboxGroup component) |
| error | `string` | — | no | Group-level validation message; announced via role=alert (CheckboxGroup component) |

## Examples

### Basic checkbox

Simple checkbox with an accessible label

```tsx
<Checkbox aria-label="Accept terms" />
```

### With visible label

Checkbox paired with a visible Label

```tsx
<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms</Label>
</div>
```

### Controlled checkbox

Checkbox driven by parent state

```tsx
<Checkbox
  checked={agreed}
  onCheckedChange={setAgreed}
  aria-label="Accept terms"
/>
```

### Multi-select group

Shared name, legend context, selection as string[]

```tsx
<CheckboxGroup
  name="langs"
  legend="Languages"
  defaultValue={["ts"]}
  onValueChange={setLangs}
>
  <CheckboxGroupItem value="ts" label="TypeScript" />
  <CheckboxGroupItem value="go" label="Go" />
</CheckboxGroup>
```

## Anti-patterns

- **Don't use Checkbox for mutually exclusive choices** — Checkbox is for multi-select. Use Radio (inside RadioGroup) when only one option can be chosen.
- **Don't use Checkbox as a toggle for settings** — For binary settings that apply immediately, use Switch which announces on/off state.

## Accessibility

- **Native semantics**: Wraps input[type=checkbox]; keyboard and screen-reader behavior is the platform default
- **Focus indicator**: Visible ring on focus-visible

## Composition

- Compose with **Label** — Always pair with a Label or aria-label for accessibility
  
  ```tsx
  <Checkbox id="x" /><Label htmlFor="x">Accept</Label>
  ```
- Compose with **CheckboxGroup** — Wrap related checkboxes so they share a name and an announced group label
  
  ```tsx
  <CheckboxGroup name="x" legend="Options"><CheckboxGroupItem value="a" label="A" /></CheckboxGroup>
  ```
- Related: Radio, Switch, Label

