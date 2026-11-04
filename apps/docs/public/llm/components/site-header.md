# SiteHeader

Marketing/site header: sticky bar with brand, horizontal navigation with prefix-aware active states, right-aligned actions and a mobile drawer.

> Import: `import { SiteHeader } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/site-header.json
> Tier: organism · Package: @slipstream-ui/core

## Design intent

Marketing sites repeat brand/nav/actions/mobile-menu wiring with custom active matching. SiteHeader standardizes the bar, handles /docs matching /docs/components, and stays router-agnostic via linkComponent.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| brand | `ReactNode` | — | yes | Brand slot (logo/lockup), wrapped in a link to /. |
| items | `SiteNavItem[]` | — | yes | Primary nav: { href, label, external? }. |
| activeHref | `string` | — | no | Current route for active styling (aria-current=page). |
| match | `'prefix' | 'exact'` | `prefix` | no | Prefix highlights parents of the current route; exact only identical hrefs. |
| actions | `ReactNode` | — | no | Right-aligned actions (theme toggle, GitHub, CTA). |
| linkComponent | `React.ElementType` | — | no | Router link element. |
| sticky | `boolean` | `true` | no | Pin the bar to the top. |
| mobileLabel | `string` | `Menu` | no | Title of the mobile navigation drawer. |

## Examples

### Marketing header

Prefix-active nav with a mobile drawer.

```tsx
<SiteHeader
  brand={<img src="/logo.svg" alt="Acme" className="h-8" />}
  items={[{ href: '/docs', label: 'Docs' }, { href: '/pricing', label: 'Pricing' }]}
  activeHref={pathname}
  linkComponent={RouterLink}
  actions={<ThemeToggle />}
/>
```

## Anti-patterns

- **Don't use it for admin rails** — Vertical app navigation belongs in Sidebar + AppShell.

## Accessibility

- **Current page**: aria-current=page on the active link (prefix or exact matching)
- **Mobile navigation**: Burger opens a focus-trapped Drawer with the same items

## Composition

- Compose with **SiteFooter** — Pair header and footer for a complete marketing shell
  
  ```tsx
  <SiteHeader … /><main /><SiteFooter … />
  ```
- Compose with **Drawer** — The mobile menu is a Drawer automatically
  
  ```tsx
  <SiteHeader … />
  ```
- Related: SiteFooter, AppShell, Sidebar, Link

