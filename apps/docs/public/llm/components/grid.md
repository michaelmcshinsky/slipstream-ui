# Grid / GridItem

Typed CSS grid with column counts per breakpoint (literal utilities that survive purging), auto-fit min-column mode, and GridItem spans.

> Import: `import { Grid } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/grid.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Grid layout should be declarative without stepping on Tailwind's compiler: column counts map to literal class names the scanner can see, and responsive card grids use minmax() auto-fit via minCol — no breakpoint math, no purged runtime-built classes. GridItem adds per-cell spans with the same literal approach.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| cols | `number` | `auto (minCol) or browser default` | no | Base column count (1-6). |
| smCols | `number` | — | no | Columns from the sm breakpoint up (1-6). |
| mdCols | `number` | — | no | Columns from the md breakpoint up (1-6). |
| lgCols | `number` | — | no | Columns from the lg breakpoint up (1-6). |
| minCol | `string` | `undefined` | no | Auto-fit mode: repeat(auto-fit, minmax(<minCol>, 1fr)) — cards wrap responsively. Overrides the cols* props. |
| gap | `'none' | 'sm' | 'md' | 'lg' | 'xl'` | `md` | no | Token gap between cells. |
| as | `'div' | 'span' | 'section' | 'ul'` | — | no | Semantic element (use 'ul' with GridItem as="li" for item grids). |
| span | `number` | — | no | GridItem column span at the base breakpoint (1-6). |
| smSpan | `number` | — | no | GridItem column span from sm up (1-6). |
| mdSpan | `number` | — | no | GridItem column span from md up (1-6). |
| lgSpan | `number` | — | no | GridItem column span from lg up (1-6). |

## Examples

### Responsive card grid (auto-fit)

minmax() wrapping — works at every width without breakpoint columns.

```tsx
<Grid minCol="18rem" gap="lg">
  {cards.map((c) => (
    <Card key={c.id}>…</Card>
  ))}
</Grid>
```

### Fixed columns with a hero span

Literal grid-cols-*/col-span-* classes are compiled (they exist verbatim in source).

```tsx
<Grid cols={2} mdCols={3} gap="md">
  <GridItem span={2} mdSpan={2} className="…">Hero</GridItem>
  <GridItem>Card A</GridItem>
  <GridItem>Card B</GridItem>
</Grid>
```

## Anti-patterns

- **Don't build column classes at runtime** — Template-built utilities (md:grid-cols-${n}) are invisible to Tailwind's scanner and get purged — the grid silently collapses to one column. The cols props use pre-declared literal classes.
- **Don't nest grids for one-axis layouts** — Row/column alignment is Flex's job; nesting grids adds template complexity with no benefit.

## Accessibility

- **Layout-only semantics**: Renders div/section/ul — no interactive behavior added
- **Reading order equals DOM order**: Visual column reflow never reorders DOM nodes

## Composition

- Compose with **Flex** — Flex for one-axis rows; Grid for two-axis layout
- Compose with **Card** — The classic minCol grid cell — cards wrap responsively
- Related: Flex, Card, Block

