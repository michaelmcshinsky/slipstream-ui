# ComparisonTable

Marketing comparison table with check/dash boolean cells, a highlighted column and responsive overflow.

> Import: `import { ComparisonTable } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/comparison-table.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Comparison sections are hand-built with ad-hoc check glyphs and inaccessible color-only states. ComparisonTable makes the feature/value relationship semantic and gives boolean cells screen-reader text.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| columns | `ComparisonColumn[]` | — | yes | Comparison columns excluding the feature column. Each column has a label and optional highlight. |
| rows | `ComparisonRow[]` | — | yes | Feature rows with one value per column. Booleans render check/dash; strings render as text. |
| caption | `string` | `Comparison` | no | Accessible table caption. |
| featureLabel | `string` | `Feature` | no | Heading for the feature column. |
| valueLabels | `{ yes?: string; no?: string }` | — | no | Screen-reader labels for boolean cells. Defaults to Included and Not included. |

## Examples

### With advisor vs. solo

A highlighted recommended column and mixed boolean/text cells.

```tsx
<ComparisonTable
  columns={[
    { label: 'With an advisor', highlight: true },
    { label: 'On your own' },
  ]}
  rows={[
    { feature: 'Accurate valuation', values: [true, false] },
    { feature: 'Negotiation support', values: ['Included', 'Self-managed'] },
  ]}
/>
```

## Anti-patterns

- **Don't use color alone** — Boolean cells already include a check/dash and screen-reader text. Do not replace them with colored dots.
- **Don't use it for dense data** — Use DataTable when rows are records and columns need sorting, selection or pagination.

## Accessibility

- **Table semantics**: Renders caption, thead, tbody, scope=col and scope=row
- **Boolean values**: Check/dash glyphs are aria-hidden and paired with sr-only Included/Not included text

## Composition

- Compose with **Section** — Place the table inside a Section; it owns its own bordered surface
  
  ```tsx
  <Section><ComparisonTable columns={columns} rows={rows} /></Section>
  ```
- Related: Table, DataTable, Section

