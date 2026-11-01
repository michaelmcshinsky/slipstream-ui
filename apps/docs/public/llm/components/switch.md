# Switch

A toggle switch for binary settings, with role=switch and aria-checked

> Import: `import { Switch } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/switch.json
> Tier: atom · Package: @slipstream-ui/core

## Design intent

Switch represents an on/off setting that takes effect immediately. Unlike Checkbox, it signals a change of state rather than a form submission value.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| checked | `boolean` | — | no | Controlled on/off state |
| defaultChecked | `boolean` | — | no | Initial state when uncontrolled |
| onCheckedChange | `(checked: boolean) => void` | — | no | Fired when the user toggles the switch |
| disabled | `boolean` | `false` | no | Disables the switch |
| className | `string` | — | no | Additional CSS classes to apply |

## Examples

### Settings toggle

Toggle in a settings row

```tsx
<div className="flex items-center justify-between">
  <Label htmlFor="notifications">Email notifications</Label>
  <Switch id="notifications" onCheckedChange={setEmails} />
</div>
```

### Controlled switch

Switch driven by parent state

```tsx
<Switch checked={dark} onCheckedChange={setDark} aria-label="Dark mode" />
```

## Anti-patterns

- **Don't use Switch inside forms that need a submit** — Switch applies immediately. Use Checkbox when the value is submitted with a form.
- **Don't rely on color alone** — Switch position conveys state; keep the thumb contrast high in both themes.

## Accessibility

- **Switch semantics**: role="switch" with aria-checked announces on/off state
- **Keyboard toggle**: Space and Enter toggle the switch

## Composition

- Compose with **Label** — Pair with Label or aria-label
  
  ```tsx
  <Label htmlFor="s">Auto-save</Label><Switch id="s" />
  ```
- Related: Checkbox, Label

