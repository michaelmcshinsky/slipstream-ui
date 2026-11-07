# LinkTabs

Route-driven navigation tabs that render real links and mark the current path with aria-current="page".

> Import: `import { LinkTabs } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/link-tabs.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Tabs switch client-side panels; LinkTabs navigates between routes. Settings, account, and app sub-navigation are URL-driven, so they need link semantics, prefix/exact matching, and a router-agnostic link component rather than a tablist.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| items | `LinkTabsItem[]` | — | yes | Tabs in display order. Each item has label, href, optional exact, icon, and disabled. |
| activeHref | `string` | — | no | Current pathname used to mark the active tab. |
| linkComponent | `React.ElementType` | — | no | Router link element (Inertia Link, Next Link, react-router Link). Defaults to an anchor. |
| linkHrefProp | `'href' | 'to'` | `href` | no | Prop used to pass the destination to linkComponent: href for anchors/Next Link, to for react-router. |
| variant | `'default' | 'underline' | 'rounded'` | `default` | no | Visual style of the tab strip. |
| size | `'sm' | 'md' | 'lg'` | `md` | no | Control density. |
| label | `string` | `Section` | no | Accessible name for the navigation landmark. |
| className | `string` | — | no | Additional CSS classes to apply. |

## Examples

### Settings sub-navigation

The active item receives aria-current="page"; prefix matching keeps parent sections active on child routes.

```tsx
<LinkTabs
  items={[
    { label: 'Profile', href: '/settings/profile', exact: true },
    { label: 'Billing', href: '/settings/billing' },
  ]}
  activeHref={pathname}
  linkComponent={Link}
/>
```

### Underline strip

```tsx
<LinkTabs items={items} activeHref={pathname} variant="underline" />
```

## Anti-patterns

- **Don't use Tabs for route navigation** — Tabs is a tablist for switching panels in place. Use LinkTabs when the URL changes; screen readers and browser history expect links.
- **Don't hardcode the active state** — Pass activeHref from the router; the component handles exact vs prefix matching.

## Accessibility

- **Navigation landmark**: Renders a nav with an accessible label (default "Section").
- **Current page**: The active link receives aria-current="page".
- **Keyboard**: Native links are tabbable and activate with Enter.
- **Disabled tabs**: Disabled items render as spans with aria-disabled and no link.

## Composition

- Compose with **PageHeader** — Place LinkTabs directly below the page header for section navigation.
- Related: Tabs, Breadcrumb, PageHeader, Link

