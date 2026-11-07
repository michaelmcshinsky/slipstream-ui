# Alert

Inline alert for status messages with semantic variants (destructive, success, warning, info)

> Import: `import { Alert } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/alert.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Alert communicates status or requires attention. Use it for form errors, success confirmations, warnings, and informational notices. Renders role=alert so screen readers announce it immediately.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| variant | `'default' | 'destructive' | 'danger' | 'success' | 'warning' | 'info'` | `'default'` | no | Semantic style variant; danger is an alias of destructive. |
| children | `ReactNode` | — | yes | Alert content (AlertTitle and AlertDescription) |
| className | `string` | — | no | Additional CSS classes to apply |

## Examples

### Destructive alert

Error state with title and description

```tsx
<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
</Alert>
```

### Success alert

Confirmation of a completed action

```tsx
<Alert variant="success">
  <AlertTitle>Success</AlertTitle>
  <AlertDescription>Your changes have been saved.</AlertDescription>
</Alert>
```

## Anti-patterns

- **Don't use Alert for transient notifications** — Alert is persistent inline content. Use Toast for temporary notifications that auto-dismiss.
- **Don't use Alert for required form validation** — Field-level errors belong next to the field with aria-describedby. Use Alert only for form-level errors.

## Accessibility

- **Live region**: role=alert announces the content when it appears
- **Heading semantics**: AlertTitle renders as h5

## Composition

- Compose with **AlertTitle + AlertDescription** — Pair title with description for structured alerts
  
  ```tsx
  <Alert><AlertTitle>Title</AlertTitle><AlertDescription>Body</AlertDescription></Alert>
  ```
- Related: Toast, Badge

