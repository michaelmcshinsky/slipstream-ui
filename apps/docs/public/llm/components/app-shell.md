# AppShell

Application frame with a sectioned sidebar, sticky header and scrolling main; the sidebar becomes a left Drawer on small screens.

> Import: `import { AppShell } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/app-shell.json
> Tier: organism · Package: @slipstream-ui/core

## Design intent

Every dashboard hand-rolls the same shell: rail, header, scroll owner, and a mobile nav. AppShell owns the structure and responsive switch while staying presentational — you pass the active route and a router link component, so it works with React Router, Next Link, or plain anchors.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| sidebar | `ReactNode` | — | no | Desktop rail content; also rendered inside the mobile drawer (AppShell). |
| header | `ReactNode` | — | no | Sticky top bar content (AppShell). |
| hideMobileMenu | `boolean` | `false` | no | Hide the built-in burger button when the header owns navigation (AppShell). |
| sidebarWidth | `string` | `w-64` | no | Tailwind width class for the desktop rail (AppShell). |
| sections | `{ title?: string; items: SidebarItem[] }[]` | — | yes | Grouped navigation items (Sidebar). |
| heading | `ReactNode` | — | no | Brand/mark at the top of the rail (Sidebar). |
| footer | `ReactNode` | — | no | Bottom area of the rail (Sidebar). |
| activeHref | `string` | — | no | Current route; matching items get aria-current=page (Sidebar). |
| linkComponent | `React.ElementType` | `a` | no | Router link component (react-router Link, Next Link) (Sidebar). |
| label | `string` | `Primary` | no | Accessible name of the nav landmark (Sidebar). |
| children | `SidebarItem[]` | — | no | Nested items — renders a collapsible group with aria-expanded (SidebarItem). |
| collapsible | `boolean` | `false` | no | Shows the collapse/expand control (Sidebar). |
| defaultCollapsed | `boolean` | `false` | no | Initial collapsed state (Sidebar). |
| collapsed | `boolean` | — | no | Controlled collapsed state (Sidebar). |
| onCollapsedChange | `(collapsed: boolean) => void` | — | no | Fires when the rail collapses/expands (Sidebar). |
| defaultExpanded | `string[]` | — | no | SidebarItem hrefs of groups open initially (Sidebar). |
| mobileBreakpoint | `'sm' | 'md' | 'lg'` | `md` | no | Breakpoint where the rail becomes a drawer (AppShell). |
| openNavigationLabel | `string` | `Open navigation` | no | Accessible label for the mobile menu button. |
| navigationTitle | `string` | `Navigation` | no | Title of the mobile navigation drawer. |

## Examples

### Dashboard shell

Router-agnostic: pass your Link component and the current path.

```tsx
import { AppShell, Sidebar } from '@slipstream-ui/core';

<AppShell
  header={<h1 className="text-sm font-semibold">Studio</h1>}
  sidebar={
    <Sidebar
      activeHref={pathname}
      linkComponent={RouterLink}
      heading={<strong>Acme</strong>}
      sections={[
        { title: 'Workspace', items: [{ href: '/dashboard', label: 'Dashboard' }, { href: '/classes', label: 'Classes', badge: 4 }] },
      ]}
    />
  }
>
  <Page />
</AppShell>
```

### Header only

Skip the sidebar when the product is a single surface.

```tsx
<AppShell header={<TopBar />}>
  <Page />
</AppShell>
```

## Anti-patterns

- **Don't nest scroll containers** — AppShell's main is the scroll owner. Adding h-screen/overflow-hidden wrappers inside breaks sticky headers and mobile drawer focus.
- **Don't hardcode anchors for SPA routes** — Plain <a href> triggers full page loads in client-side routers. Pass your router's Link via linkComponent.

## Accessibility

- **Nav landmark**: Sidebar renders nav with an accessible name (label prop)
- **Current route**: aria-current=page on the active item
- **Mobile drawer**: The rail becomes a Drawer with focus trap, Escape, focus restore and a labelled dialog

## Composition

- Compose with **Drawer** — AppShell mounts the mobile navigation Drawer for you when a sidebar is provided
  
  ```tsx
  <AppShell sidebar={<Sidebar sections={sections} />}>…</AppShell>
  ```
- Compose with **Button** — Header actions live in the header slot
  
  ```tsx
  <AppShell header={<Button>New</Button>}>…</AppShell>
  ```
- Related: Drawer, Button, Breadcrumb, Menu

