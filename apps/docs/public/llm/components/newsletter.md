# Newsletter

Email capture block with inline or stacked layout, pending state, success and failure feedback.

> Import: `import { Newsletter } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/newsletter.json
> Tier: organism · Package: @slipstream-ui/core

## Design intent

Resource hubs and articles all need a newsletter block with the same validation, consent copy and status feedback. Newsletter owns the field and state while the caller owns the CRM and double opt-in.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| title | `string` | — | yes | Headline for the signup block. |
| description | `string` | — | no | Supporting copy. |
| placeholder | `string` | `you@example.com` | no | Email placeholder. |
| buttonLabel | `string` | `Subscribe` | no | Submit button label. |
| label | `string` | `Email address` | no | Visible or screen-reader label for the email field. |
| successMessage | `string` | `Thanks. Check your inbox to confirm.` | no | Success message. |
| errorMessage | `string` | `Something went wrong. Please try again.` | no | Failure message used when onSubmit rejects. |
| consent | `ReactNode` | — | no | Consent or privacy copy shown under the form. |
| onSubmit | `(email: string) => void | Promise<void>` | — | no | Submit handler. Omit for a presentational form. |
| layout | `'inline' | 'stacked'` | `inline` | no | Inline on desktop or always stacked. |
| level | `2 | 3` | `2` | no | Heading level. |

## Examples

### Owner newsletter

Inline email capture with consent copy.

```tsx
<Newsletter
  title="Weekly exit insights"
  description="One email a week. No spam."
  consent="By subscribing you agree to the privacy policy."
  onSubmit={async (email) => subscribe(email)}
/>
```

## Anti-patterns

- **Don't put the transport in the component** — Newsletter owns the field and status only. Pass a submit handler so the caller controls the CRM, double opt-in and error mapping.

## Accessibility

- **Labelled email field**: The label is associated with the input and visible to screen readers
- **Status announcements**: Success uses aria-live polite; errors use role alert

## Composition

- Compose with **Section** — Place Newsletter inside a Section or a Card
  
  ```tsx
  <Section tone="muted"><Newsletter title="Join" /></Section>
  ```
- Related: Input, Button, Section, Card

