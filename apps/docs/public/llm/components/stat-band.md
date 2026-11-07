# StatBand

Semantic description list of headline stats with labels, optional hints and column presets.

> Import: `import { StatBand } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/stat-band.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Proof sections repeat the same number/label cluster. StatBand standardizes the scale, dividers and responsive columns, and uses dl semantics so the number-to-label relationship is real structure, not styled divs.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| items | `StatItem[]` | — | yes | Stats to display: value, label and optional hint. |
| columns | `2 | 3 | 4` | `3` | no | Desktop column count. Mobile stacks to one column and sm uses two. |
| align | `'left' | 'center'` | `center` | no | Copy alignment. |
| size | `'sm' | 'md' | 'lg'` | `md` | no | Value scale. |
| divided | `boolean` | `true` | no | Draw dividers between stats at sm and up. |

## Examples

### Proof band

Three proof points with default dividers.

```tsx
<StatBand
  items={[
    { value: '3,500+', label: 'Advisory firms' },
    { value: '5,000+', label: 'Investors' },
    { value: '12,000+', label: 'Deals annually' },
  ]}
/>
```

### Left-aligned four-up

Four stats aligned to the left.

```tsx
<StatBand columns={4} align="left" items={stats} />
```

## Anti-patterns

- **Don't use StatBand for app KPIs** — Use MetricCard when the value needs a delta, trend or loading state. StatBand is a marketing proof strip.

## Accessibility

- **Description list**: Renders dl/dt/dd so each value is paired with its label
- **Visual order**: Value renders before label visually while dt precedes dd in the DOM

## Composition

- Compose with **Section** — StatBand sits inside a Section so the surface tone and padding come from the band
  
  ```tsx
  <Section tone="inverse"><StatBand items={stats} /></Section>
  ```
- Related: MetricCard, Hero, Section

