# Pagination

Numeric pagination with prev/next and boundary jumps; accepts page/pageCount or currentPage/totalPages and derives the count (plus a Showing X-Y of Z summary) from total/pageSize.

> Import: `import { Pagination } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/pagination.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Pagination lets users navigate through paged content. It shows page numbers with ellipsis for large ranges, prev/next buttons, and marks the current page with aria-current=page.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| page | `number` | `1` | no | Current page (1-based). Alias: currentPage. |
| pageCount | `number` | — | no | Total pages. Alias: totalPages, or derived from total/pageSize. |
| currentPage | `number` | — | no | Alias for page (migration-friendly). |
| totalPages | `number` | — | no | Alias for pageCount. |
| pageSize | `number` | — | no | Rows per page; with total enables the summary and derives pageCount. |
| total | `number` | — | no | Total item count for the summary. |
| itemLabel | `string` | `items` | no | Noun used in the summary. |
| showSummary | `boolean` | — | no | Force the summary on/off (defaults on when total and pageSize are set). |
| onPageChange | `(page: number) => void` | — | no | Called with the new page number. |
| siblings | `number` | `1` | no | Page buttons shown around the current page. |
| showBoundaries | `boolean` | `false` | no | Show first/last jump buttons. |
| showFirst | `boolean` | — | no | Force-show the first-page button. |
| showLast | `boolean` | — | no | Force-show the last-page button. |
| icons | `PaginationIcons` | — | no | Replace the default glyphs. |
| labels | `{ pagination?: string; first?: string; previous?: string; next?: string; last?: string; page?: (page: number) => string }` | — | no | Localized landmark and control labels. |

## Examples

### Summary + derived pages

Renders "Showing 26–50 of 312 students" and derives 13 pages.

```tsx
<Pagination
  page={page}
  pageSize={25}
  total={312}
  itemLabel="students"
  onPageChange={setPage}
/>
```

### Migration aliases

currentPage/totalPages map onto page/pageCount.

```tsx
<Pagination currentPage={page} totalPages={pages} onPageChange={setPage} />
```

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

