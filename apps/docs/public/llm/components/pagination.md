# Pagination

Numeric pagination with prev/next, ellipsis, and aria-current on the active page

> Import: `import { Pagination } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/pagination.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Pagination lets users navigate through paged content. It shows page numbers with ellipsis for large ranges, prev/next buttons, and marks the current page with aria-current=page.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| page | `number` | — | yes | Current page number (1-based) |
| pageCount | `number` | — | yes | Total number of pages |
| onPageChange | `(page: number) => void` | — | no | Called with the new page number |
| siblings | `number` | `1` | no | How many page buttons to show around the current page |
| className | `string` | — | no | Additional CSS classes to apply |

## Examples

### Basic pagination

Navigate through 10 pages

```tsx
<Pagination page={3} pageCount={10} onPageChange={setPage} />
```

### Wide page range

Show more page buttons around the current page

```tsx
<Pagination page={5} pageCount={20} siblings={2} onPageChange={setPage} />
```

## Anti-patterns

- **Don't use Pagination for infinite scroll content** — Pagination implies discrete pages. Use a 'Load more' button or infinite scroll for continuous content.
- **Don't hide the current page number** — Users need to know where they are. Always show the active page with aria-current=page.

## Accessibility

- **Navigation landmark**: nav[aria-label=Pagination]
- **Current page**: Active button has aria-current=page
- **Disabled buttons**: Prev/next are disabled at the boundaries

## Composition

- Compose with **Table** — Paginate long table data
  
  ```tsx
  <Table>...</Table><Pagination page={page} pageCount={total} onPageChange={setPage} />
  ```
- Related: Table, Breadcrumb

