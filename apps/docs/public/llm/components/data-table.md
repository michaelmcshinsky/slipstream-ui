# DataTable

Config-driven table: one component plus a columns config that owns shape, sorting, pagination, and row interaction.

> Import: `import { DataTable } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/data-table.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Most tables are 90% configuration — columns, sortability, page size, row click. DataTable collapses that into a single columns config so application code describes WHAT the table shows, not HOW to render th/td/sort/paginate markup by hand, while keeping full control through cell renderers.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| columns | `DataTableColumn<T>[]` | — | yes | Column configuration: key, header, optional cell renderer, sortable flag, align, className. Each column may define onClick(row) to make the cell content a button (column-level callbacks); onSortChange wires server-side sorting. |
| data | `T[]` | — | yes | Row data. |
| rowId | `(row: T) => string` | — | yes | Stable id per row (React key + test hooks). |
| caption | `string` | — | no | Accessible table caption. |
| defaultSort | `{ key: string; dir: 'asc' | 'desc' } | null` | — | no | Initial sort when uncontrolled. |
| sortKey | `string | null` | — | no | Controlled sort column (pair with sortDir and onSortChange). |
| sortDir | `'asc' | 'desc'` | — | no | Controlled sort direction. |
| onSortChange | `(key: string, dir: 'asc' | 'desc') => void` | — | no | Fires when a sortable header is toggled (controlled or not). |
| pageSize | `number` | — | no | Rows per page; enables pagination with a count line when set. |
| page | `number` | — | no | Controlled page number (1-based) when pageSize is set. |
| onPageChange | `(page: number) => void` | — | no | Fires when the pagination control changes page. |
| onRowClick | `(row: T) => void` | — | no | Makes rows interactive: click plus Enter/Space activation with ring focus. |
| renderSortIcon | `(state: 'none' | 'asc' | 'desc') => ReactNode` | — | no | Replace the default ▲/▼/↕ header glyphs with custom markup. |
| stickyHeader | `boolean` | `false` | no | Pin the header while the body scrolls (add a max-height via className). |
| density | `'default' | 'compact'` | `default` | no | Row density — compact shrinks text and cell padding. |
| zebra | `boolean` | `false` | no | Zebra-striped rows for long tables. |
| loading | `boolean` | `false` | no | Render skeleton placeholder rows (tbody is aria-busy while loading). |
| loadingRows | `number` | — | no | Skeleton row count while loading (defaults to page size, else 5) — match it to visible data so rows do not jump. |
| emptyMessage | `string` | `'No results.'` | no | Shown when data is empty. |
| className | `string` | — | no | Additional classes for the table wrapper. |
| selectedRowIds | `string[]` | — | no | Selected row ids (controlled) — enables the leading selection column. |
| onSelectedRowIdsChange | `(ids: string[]) => void` | — | no | Fires after a row or select-all toggle. |
| isRowSelectable | `(row: T) => boolean` | — | no | Disable selection for individual rows. |
| bulkActions | `ReactNode` | — | no | Rendered above the table while rows are selected. |
| manualPagination | `boolean` | `false` | no | Server pagination: render data as-is, do not slice or sort. |
| total | `number` | — | no | Total row count across pages (summary + derived page count). |
| pageCount | `number` | — | no | Total page count (manual pagination). |

## Examples

### Sortable, paginated table from one config

Sorting, paging, empty state, and row interaction come from the config — no table markup.

```tsx
<DataTable
  caption="Recent conversations"
  columns={[
    { key: 'title', header: 'Title', sortable: true },
    { key: 'messages', header: 'Messages', align: 'right', sortable: true },
    { key: 'updatedAt', header: 'Updated', cell: (row) => row.updatedAt.toLocaleDateString() },
  ]}
  data={conversations}
  rowId={(row) => row.id}
  pageSize={10}
  onRowClick={(row) => router.push(`/c/${row.id}`)}
/>
```

### Controlled sort (server-side)

Pass sort props + onSortChange to let the backend own ordering; DataTable renders aria-sort either way.

```tsx
<DataTable
  columns={columns}
  data={rows}
  rowId={(row) => row.id}
  sortKey={sort.key}
  sortDir={sort.dir}
  onSortChange={(key, dir) => fetchSorted(key, dir)}
/>
```

## Anti-patterns

- **Don't sort server-owned data locally** — Local sorting runs on the rows you pass in. When data is paged by the API, wire onSortChange to a server query — sorting one page locally lies about global order.
- **Don't put heavy interactions in onRowClick only** — Rows are keyboard-focusable when onRowClick is set (Enter/Space activate), but a row click is not a semantic action for assistive tech. Also provide a real link/button (e.g. in a cell) for primary navigation.
- **Don't build nested tables for layout** — DataTable is for tabular DATA. Layout grids belong to Card/grid containers — nested tables degrade the table navigation story for screen readers.

## Accessibility

- **Sortable headers**: Sortable th elements carry aria-sort (ascending/descending/none) and use a real button for the toggle
- **Caption**: Renders a native <caption> naming the table's purpose
- **Row interaction**: With onRowClick rows are tabIndex=0 and activate on Enter/Space with a visible ring
- **Pagination feedback**: The result count line is aria-live=polite and pagination reuses the Pagination nav (aria-current=page)

## Composition

- Compose with **Pagination** — Used internally when pageSize is set — you never need to wire it yourself
  
  ```tsx
  <DataTable pageSize={10} … /> // pagination + count render automatically
  ```
- Compose with **Badge / Button** — Use column cell renderers for status pills and row actions
  
  ```tsx
  { key: 'status', header: 'Status', cell: (row) => <Badge variant={row.ok ? 'default' : 'destructive'}>{row.status}</Badge> }
  ```
- Compose with **Table** — Prefer Table when you need fully custom markup or non-interactive static data
- Related: Table, Pagination, Badge, Skeleton

