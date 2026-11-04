# AuthLayout

Centered authentication surface: brand, title/description, form card and footer, with size presets.

> Import: `import { AuthLayout } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/auth-layout.json
> Tier: organism · Package: @slipstream-ui/core

## Design intent

Sign-in, sign-up, reset and verify screens should look identical. AuthLayout owns the centered card, brand slot and footer so auth pages only supply the form.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| title | `string` | — | yes | Card heading (h1). |
| description | `string` | — | no | Supporting line under the heading. |
| brand | `ReactNode` | — | no | Mark rendered above the card. |
| footer | `ReactNode` | — | no | Links/legal copy under the card. |
| size | `'sm' | 'md' | 'lg'` | `md` | no | Card width preset. |

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

