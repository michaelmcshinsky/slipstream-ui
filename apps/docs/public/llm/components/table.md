# Table

Semantic data table with headers, body, footer, and accessible caption

> Import: `import { Table } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/table.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Table displays tabular data with proper semantics. TableHead uses scope=col, TableCaption provides an accessible summary, and rows support hover/selected states.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| children | `ReactNode` | — | yes | TableHeader, TableBody, TableFooter, and TableCaption children |
| className | `string` | — | no | Additional CSS classes to apply |

## Examples

### Basic table

Table with caption, headers, and data rows

```tsx
<Table>
  <TableCaption>Monthly revenue</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead scope="col">Month</TableHead>
      <TableHead scope="col">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>January</TableCell>
      <TableCell>$1,200</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## Anti-patterns

- **Don't use Table for layout** — Tables are for tabular data. Use CSS Grid or Flexbox for page layout.
- **Don't omit the caption** — Screen readers use the caption to describe the table's purpose.

## Accessibility

- **Semantic table**: Native table/thead/tbody/tfoot with scope attributes on headers
- **Accessible caption**: TableCaption describes the table contents

## Composition

- Compose with **TableHeader** — Place column headers in a TableHeader with TableRow
  
  ```tsx
  <TableHeader><TableRow><TableHead scope="col">Name</TableHead></TableRow></TableHeader>
  ```
- Related: Card, Badge

