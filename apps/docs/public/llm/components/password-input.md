# PasswordInput

Password field with an accessible show/hide toggle (aria-pressed), built on Input.

> Import: `import { PasswordInput } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/password-input.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Users mistype passwords; a reveal toggle reduces failed sign-ins. The toggle must be a real button with a pressed state and a proper label so it is not a mystery control.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| showLabel | `string` | `Show password` | no | Accessible label while hidden. |
| hideLabel | `string` | `Hide password` | no | Accessible label while visible. |

## Examples

### Sign-in field

Input props pass through.

```tsx
<PasswordInput aria-label="Password" autoComplete="current-password" />
```

## Anti-patterns

- **Don't reveal by default** — Start masked; reveal is user-initiated.

## Accessibility

- **Toggle semantics**: Button with aria-pressed and Show/Hide labels

## Composition

- Compose with **FormField** — Wrap for label/hint/error wiring
  
  ```tsx
  <FormField id="pw" label="Password"><PasswordInput /></FormField>
  ```
- Related: Input, FormField, InputGroup

