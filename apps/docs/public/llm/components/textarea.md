# Textarea

A multi-line text input styled to match Input, wrapping the native textarea

> Import: `import { Textarea } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/textarea.json
> Tier: atom · Package: @slipstream-ui/core

## Design intent

Textarea is for free-form, multi-line text such as messages, descriptions, and feedback. Native textarea semantics keep IME, form validation, and screen-reader behavior intact.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| value | `string` | — | no | Controlled value; omit for uncontrolled usage |
| defaultValue | `string` | — | no | Initial value when uncontrolled |
| placeholder | `string` | — | no | Placeholder text shown when empty |
| disabled | `boolean` | `false` | no | Disables the textarea |
| onChange | `(event: ChangeEvent<HTMLTextAreaElement>) => void` | — | no | Fired when the content changes |

## Examples

### Basic textarea

Multi-line input with a placeholder

```tsx
<Textarea placeholder="Tell us about your project" />
```

### With label and helper text

Labelled textarea with a hint

```tsx
<div className="space-y-1">
  <Label htmlFor="bio">Bio</Label>
  <Textarea id="bio" maxLength={280} />
  <p className="text-xs text-muted-foreground">Up to 280 characters</p>
</div>
```

## Anti-patterns

- **Don't use Textarea for single-line values** — Use Input for emails, names, and other short single-line data.
- **Don't use Textarea for rich text** — Textarea is plain text. Use a rich-text editor when formatting is required.

## Accessibility

- **Native semantics**: Wraps textarea; multiline text entry and form validation work natively
- **Character limits**: maxLength is supported natively

## Composition

- Compose with **Label** — Pair with Label for accessibility
  
  ```tsx
  <Label htmlFor="m">Message</Label><Textarea id="m" />
  ```
- Related: Input, Label

