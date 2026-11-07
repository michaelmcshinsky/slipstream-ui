# Breadcrumb

Navigation breadcrumb trail with links and current-page indicator

> Import: `import { Breadcrumb } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/breadcrumb.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Breadcrumb shows the user's location in a hierarchy and lets them navigate back to parent levels. The last item is the current page, marked with aria-current=page.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| items | `BreadcrumbItem[]` | — | yes | Ordered breadcrumb items; the last is the current page |
| separator | `ReactNode` | `'/'` | no | Separator character between items |
| className | `string` | — | no | Additional CSS classes to apply |
| onItemClick | `(item: BreadcrumbItem, index: number) => void` | — | no | Receives every link click with default navigation prevented — route programmatically. |
| linkComponent | `React.ElementType` | — | no | Custom link element for routers (preserves prefetch/modified clicks). |
| linkHrefProp | `'href' | 'to'` | `href` | no | Prop used to pass the destination to linkComponent: href for anchors/Next Link, to for react-router. |
| truncateCurrent | `boolean` | `false` | no | Truncate the current page label and expose the full text as a title. |

## Examples

### Three-level breadcrumb

Hierarchical navigation with current page

```tsx
<Breadcrumb items={[
  { label: 'Home', href: '/' },
  { label: 'Docs', href: '/docs' },
  { label: 'Components' },
]} />
```

### Custom separator

Breadcrumb with a chevron separator

```tsx
<Breadcrumb
  items={[{ label: 'Home', href: '/' }, { label: 'Page' }]}
  separator="›"
/>
```

## Anti-patterns

- **Don't use Breadcrumb for flat navigation** — Breadcrumb is for hierarchical structures. Use a nav menu or tabs for flat peer pages.
- **Don't make the current page a link** — The last item should be plain text with aria-current=page, not a link to itself.

## Accessibility

- **Navigation landmark**: nav[aria-label=Breadcrumb] so screen readers announce the landmark
- **Current page**: Last item has aria-current=page

## Composition

- Compose with **Link** — Non-last items should be links
  
  ```tsx
  <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Current' }]} />
  ```
- Related: Menu, Tabs

