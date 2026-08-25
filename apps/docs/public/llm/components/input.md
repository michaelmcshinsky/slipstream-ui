# Input

A text input field with support for various input types and standard HTML input attributes

> Import: `import { Input } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/input.json
> Tier: atom · Package: @slipstream-ui/core

## Design intent

The Input component provides a styled text input that follows the design system. It supports all standard HTML input attributes and includes proper focus states, disabled states, and file input styling.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| type | `string` | `text` | no | HTML input type (text, password, email, number, etc.) |
| placeholder | `string` | — | no | Placeholder text to display when input is empty |
| value | `string` | — | no | Current value of the input (controlled component) |
| defaultValue | `string` | — | no | Default value for uncontrolled input |
| disabled | `boolean` | `false` | no | Disables the input |
| required | `boolean` | `false` | no | Marks the input as required for form validation |
| onChange | `(event: ChangeEvent<HTMLInputElement>) => void` | — | no | Handler called when input value changes |
| onFocus | `(event: FocusEvent<HTMLInputElement>) => void` | — | no | Handler called when input is focused |
| onBlur | `(event: FocusEvent<HTMLInputElement>) => void` | — | no | Handler called when input loses focus |

## Examples

### Basic text input

Simple text input with placeholder

```tsx
<Input placeholder="Enter your name" />
```

### Email input

Input optimized for email addresses

```tsx
<Input type="email" placeholder="user@example.com" />
```

### Password input

Input that obscures text for passwords

```tsx
<Input type="password" placeholder="Enter password" />
```

### Controlled input

Input with controlled state

```tsx
<Input 
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Controlled input"
/>
```

### Disabled input

Input that cannot be interacted with

```tsx
<Input disabled placeholder="Disabled input" />
```

### File input

Input for file uploads with styled file button

```tsx
<Input type="file" />
```

## Anti-patterns

- **Don't use Input for multi-line text** — undefined
- **Don't ignore validation** — undefined
- **Don't use vague placeholders** — undefined

## Accessibility

- **Keyboard navigation**: Input is natively focusable and supports all keyboard input
- **Screen reader support**: Input type and placeholder are announced. Use aria-label or aria-labelledby for additional context
- **Form validation**: Supports HTML5 validation attributes (required, pattern, min, max)
- **Disabled state**: Disabled inputs are not focusable and screen readers announce as disabled

## Composition

- Compose with **Label** — Inputs should always have associated labels for accessibility
  
  ```tsx
  <Label htmlFor="email">Email</Label><Input id="email" />
  ```
- Compose with **Form** — Inputs are typically used within form components for validation and submission
  
  ```tsx
  Form groups multiple inputs together for validation
  ```
- Related: Textarea, Label, Form, Select

