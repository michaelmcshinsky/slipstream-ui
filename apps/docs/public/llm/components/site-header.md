# SiteHeader

Marketing/site header: sticky bar with brand, horizontal navigation with prefix-aware active states, right-aligned actions and a mobile drawer.

> Component ID: `site-header`
> Import: `import { SiteHeader } from '@slipstream-ui/core'`
> Docs: https://slipstreamui.com/docs/components/site-header
> Registry: https://slipstreamui.com/registry/site-header.json
> Tier: organism · Package: @slipstream-ui/core@0.11.6
> Manifest schema: v1 · manifest: v1

## Design intent

Marketing sites repeat brand/nav/actions/mobile-menu wiring with custom active matching. SiteHeader standardizes the bar, handles /docs matching /docs/components, and stays router-agnostic via linkComponent.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| brand | `ReactNode` | — | yes | Brand slot (logo/lockup), wrapped in a link to /. |
| items | `SiteNavItem[]` | — | yes | Primary nav. A plain item is { href, label, external? }; an item with `columns` renders as a mega-panel disclosure (desktop) and a <details> group (mobile). |
| activeHref | `string` | — | no | Current route for active styling (aria-current=page). |
| match | `'prefix' | 'exact'` | `prefix` | no | Prefix highlights parents of the current route; exact only identical hrefs. |
| actions | `ReactNode` | — | no | Right-aligned actions (theme toggle, GitHub, CTA). |
| mobileActions | `ReactNode` | — | no | Actions rendered inside the mobile drawer; defaults to `actions`. |
| linkComponent | `React.ElementType` | — | no | Router link element. |
| linkHrefProp | `'href' | 'to'` | `href` | no | Prop used to pass the destination to linkComponent: href for anchors/Next Link, to for react-router. |
| brandLabel | `string` | `Home` | no | Accessible name for the brand link. |
| navLabel | `string` | `Main` | no | Accessible name for the desktop navigation landmark. |
| mobileNavLabel | `string` | `Mobile` | no | Accessible name for the mobile navigation landmark. |
| sticky | `boolean` | `true` | no | Pin the bar to the top. |
| mobileLabel | `string` | `Menu` | no | Title of the mobile navigation drawer. |
| mobileMenuOpenLabel | `string` | `Open menu` | no | Accessible name for the mobile menu trigger when closed. |
| mobileMenuCloseLabel | `string` | `Close menu` | no | Accessible name for the mobile menu trigger when open. |
| mobileDrawerCloseLabel | `string` | `Close drawer` | no | Accessible name for the mobile drawer close button. |
| showMobileTrigger | `boolean` | `true` | no | Render the built-in mobile trigger and drawer. Set false when the host owns mobile navigation. |
| desktopBreakpoint | `'md' | 'lg'` | `md` | no | Breakpoint where the horizontal navigation appears. |
| navClassName | `string` | — | no | Extra classes for the inner nav row. |

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

### Persona mega menus

Nested persona panels on desktop and <details> groups in the mobile drawer.

```tsx
<SiteHeader
  brand={<span>Acme</span>}
  items={[
    {
      label: 'Dancers',
      columns: [
        {
          heading: 'Plan your season',
          items: [
            { href: '/events', label: 'All events', description: 'Every genre in Utah' },
            { href: '/deadlines', label: 'Deadlines' },
          ],
        },
      ],
    },
    { href: '/directory', label: 'Directory' },
  ]}
  activeHref={pathname}
/>
```

## Anti-patterns

- **Don't use it for admin rails** — Vertical app navigation belongs in Sidebar + AppShell.

## Accessibility

- **Current page**: aria-current=page on the active link (prefix or exact matching)
- **Mobile navigation**: Burger opens a focus-trapped Drawer with the same items; nested items render as native <details> disclosures
- **Mega panels**: Trigger mirrors aria-expanded/aria-controls; panels open on hover or click, stay open while tabbing, close on Escape or an outside pointer

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

