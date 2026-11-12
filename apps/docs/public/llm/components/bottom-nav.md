# BottomNav

Mobile bottom tab bar for the 3-5 primary destinations of an app shell, with an active tab, count badges and safe-area padding.

> Import: `import { BottomNav } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/bottom-nav.json
> Tier: organism · Package: @slipstream-ui/core

## Design intent

Mobile apps put primary navigation within thumb reach at the bottom of the screen, but hand-rolled bars drift on target size, active state and the iOS home indicator. BottomNav owns the landmark, the aria-current state, 44px minimum targets and env(safe-area-inset-bottom) so every mobile shell behaves the same.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| items | `BottomNavItem[]` | — | yes | Tabs in order: href, label, optional icon, active, badge and disabled. |
| linkComponent | `React.ElementType` | — | no | Router link component (Next Link, react-router Link). |
| linkHrefProp | `'href' | 'to'` | `href` | no | Prop used to pass the destination to linkComponent. |
| label | `string` | `Primary` | no | Accessible label for the nav landmark. |
| fixed | `boolean` | `true` | no | Pin the bar to the bottom edge with safe-area padding. |
| mobileOnly | `boolean` | `true` | no | Hide the bar from the md breakpoint up. |

## Examples

### Mobile app shell tabs

Three primary destinations with one active tab.

```tsx
<BottomNav
  items={[
    { href: '/', label: 'Home', icon: <HomeIcon />, active: true },
    { href: '/search', label: 'Search', icon: <SearchIcon /> },
    { href: '/alerts', label: 'Alerts', icon: <BellIcon />, badge: 3 },
  ]}
/>
```

## Anti-patterns

- **Don't stack more than five tabs** — Targets stop being thumb-reachable and labels start truncating. Move the extras into a More destination.
- **Don't use BottomNav for desktop navigation** — mobileOnly hides the bar at md and up; desktop keeps SiteHeader/Sidebar.

## Accessibility

- **Navigation landmark**: Renders <nav> with an accessible name (default "Primary")
- **Current tab**: aria-current="page" on the active tab only
- **Target size**: Every tab is at least 56px tall with a 44px minimum target

## Composition

- Compose with **AppShell** — Pair with AppShell and add bottom padding so content is not hidden behind the bar
  
  ```tsx
  <AppShell><main className="pb-20">...</main><BottomNav items={items} /></AppShell>
  ```
- Compose with **Badge** — Counts ride in the item's badge slot; keep them to a single number
  
  ```tsx
  <BottomNav items={[{ href: '/alerts', label: 'Alerts', badge: 3 }]} />
  ```
- Related: AppShell, Sidebar, SiteHeader, Badge

