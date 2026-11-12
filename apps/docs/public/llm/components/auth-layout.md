# AuthLayout

Authentication surface with a centered card or a split form/aside layout, plus brand, title, footer and size presets.

> Import: `import { AuthLayout } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/auth-layout.json
> Tier: organism · Package: @slipstream-ui/core

## Design intent

Sign-in, sign-up, reset and verify screens should look identical. AuthLayout owns the centered card (or the split form/aside shell), brand slot and footer so auth pages only supply the form. The split variant keeps DOM order form then aside and stacks below the form on mobile.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| title | `string` | — | yes | Card heading (h1). |
| description | `string` | — | no | Supporting line under the heading. |
| subtitle | `string` | — | no | Alias for description (migration-friendly). |
| brand | `ReactNode` | — | no | Mark rendered above the card. |
| logo | `ReactNode` | — | no | Alias for brand (migration-friendly). |
| footer | `ReactNode` | — | no | Links/legal copy under the card. |
| size | `'sm' | 'md' | 'lg'` | `md` | no | Card width preset. |
| variant | `'centered' | 'split'` | `centered` | no | Layout preset. Split adds a branded aside beside the form card on desktop and below it on mobile. |
| aside | `ReactNode` | — | no | Optional panel rendered beside the card in the split variant. Ignored when centered; omitting it falls back to centered. |

## Examples

### Sign in

Form lives inside the card.

```tsx
<AuthLayout
  title="Sign in"
  description="Welcome back."
  brand={<Logo />}
  footer={<a href="/signup">Create account</a>}
>
  <SignInForm />
</AuthLayout>
```

## Anti-patterns

- **Don't nest another full-height page** — AuthLayout already owns min-h-screen centering.

## Accessibility

- **One h1**: Renders the page heading

## Composition

- Compose with **Form** — Place the Form inside children
  
  ```tsx
  <AuthLayout title="Sign in"><Form onSubmit={…}>…</Form></AuthLayout>
  ```
- Related: Form, PasswordInput, Button

