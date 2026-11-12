# MetricCard

KPI tile: label, value, directional delta (arrow + color) and supporting hint.

> Import: `import { MetricCard } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/metric-card.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Dashboards need comparable tiles. MetricCard standardizes tabular numbers, delta direction (never color-only) and the label/value/hint hierarchy so rows of KPIs align.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| label | `string` | — | no | Metric name. Alias: title. |
| title | `string` | — | no | Alias for label (migration-friendly). |
| value | `string | number` | — | yes | Primary number/value; rendered tabular. |
| delta | `string` | — | no | Signed change, e.g. +12.4%. |
| trend | `'up' | 'down' | 'flat'` | `flat` | no | Delta direction color + arrow glyph. |
| hint | `React.ReactNode` | — | no | Comparison context (vs last month). Alias: description. |
| description | `React.ReactNode` | — | no | Alias for hint (migration-friendly). |
| icon | `ReactNode` | — | no | Decorative icon. |

## Examples

### KPI row

Deltas carry arrows as well as color.

```tsx
<div className="grid gap-4 sm:grid-cols-3">
  <MetricCard label="Revenue" value="$12,480" delta="+12.4%" trend="up" hint="vs last month" />
  <MetricCard label="Churn" value="2.1%" delta="-0.4" trend="down" />
</div>
```

## Anti-patterns

- **Don't encode meaning in color alone** — Always pass trend so the arrow glyph accompanies the color.

## Accessibility

- **Color-independent direction**: Delta renders ↑/↓/→ glyphs alongside color

## Composition

- Compose with **Grid** — Lay KPI rows out with Grid for even columns
  
  ```tsx
  <Grid columns={3} gap="md"><MetricCard … /></Grid>
  ```
- Related: Card, Grid, Progress

