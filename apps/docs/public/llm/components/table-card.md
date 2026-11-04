# TableCard

Table shell with title/description, header actions, optional toolbar, edge-to-edge body and a footer row.

> Import: `import { TableCard } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/table-card.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Every list page rebuilds the same chrome around Table/DataTable: heading, count, actions, filter row, pagination. TableCard standardizes that shell so pages only supply the table.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| title | `string` | — | no | Card heading. |
| description | `string` | — | no | Supporting line under the heading. |
| actions | `ReactNode` | — | no | Right-aligned header actions. |
| toolbar | `ReactNode` | — | no | Row between header and table (filters, bulk actions). |
| children | `ReactNode` | — | yes | Table or DataTable content. |
| footer | `ReactNode` | — | no | Footer row (pagination, summary). |
| flush | `boolean` | `true` | no | Remove inner padding so the table reaches the card edges. |

## Examples

### List page table

Header, toolbar, table and pagination in one surface.

```tsx
<TableCard
  title="Classes"
  description="12 active"
  actions={<Button>New class</Button>}
  toolbar={<FilterBar … />}
  footer={<Pagination … />}
>
  <DataTable columns={columns} data={rows} />
</TableCard>
```

## Anti-patterns

- **Don't nest another bordered card** — TableCard is the surface; wrapping it in Card double-borders the content.

## Accessibility

- **Heading semantics**: Title renders an h2 (page owns the h1 via PageHeader)
- **Table labelling**: The table keeps its own caption/aria-label

## Composition

- Compose with **DataTable** — Body content; use flush for edge-to-edge rows
  
  ```tsx
  <TableCard flush><DataTable … /></TableCard>
  ```
- Compose with **FilterBar** — Pass as toolbar for list filtering
  
  ```tsx
  <TableCard toolbar={<FilterBar … />}>…</TableCard>
  ```
- Compose with **Pagination** — Pass as footer
  
  ```tsx
  <TableCard footer={<Pagination … />}>…</TableCard>
  ```
- Related: DataTable, Table, FilterBar, Pagination, Card

