# Label

An accessible form label that associates with its control

> Import: `import { Label } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/label.json
> Tier: atom · Package: @slipstream-ui/core

## Design intent

Label names a form control so screen readers announce the field name together with its value and state. Use htmlFor to associate, or wrap the control.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| htmlFor | `string` | — | no | The id of the control this label describes |
| children | `ReactNode` | — | yes | The label text |
| className | `string` | — | no | Additional CSS classes to apply |

## Examples

### Label with input

Associated label and input

```tsx
<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />
```

### Required field

Marking required fields explicitly

```tsx
<Label htmlFor="name">Name (required)</Label>
<Input id="name" required />
```

## Anti-patterns

- **Don't use placeholder as a label** — Placeholders disappear on input and are skipped by many screen readers.

## Accessibility

- **Programmatic association**: htmlFor/id pairing links the label to its control

## Composition

- Compose with **Input** — Every input should have a label
  
  ```tsx
  <Label htmlFor="e">Email</Label><Input id="e" />
  ```
- Related: Input, Textarea, Select, Checkbox, Radio

