# FeatureGrid

Grid of feature or benefit cards with an icon, title, copy and optional link.

> Import: `import { FeatureGrid } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/feature-grid.json
> Tier: organism · Package: @slipstream-ui/core

## Design intent

Marketing pages repeat three- and six-card feature groups. FeatureGrid standardizes the card hierarchy, icon tile, grid and link affordance without forcing a separate Card composition on every page.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| features | `FeatureItem[]` | — | yes | Features to display: title, optional description, icon, href and actionLabel. |
| columns | `2 | 3 | 4` | `3` | no | Desktop column count. |
| variant | `'card' | 'plain'` | `card` | no | Card surface or a plain stack. |
| align | `'left' | 'center'` | `left` | no | Content alignment. |
| linkComponent | `React.ElementType` | — | no | Custom link element for routers. |

## Examples

### Three benefits

A two-column feature group with one linked card.

```tsx
<FeatureGrid
  features={[
    { title: 'Vetted advisors', description: 'Curated for your business', icon: <Shield /> },
    { title: 'Buyer targeting', description: 'Reach the right investors', href: '/features/buyers', actionLabel: 'Learn more' },
  ]}
/>
```

## Anti-patterns

- **Don't put a button inside a linked card** — The whole card is a link when href is present. A nested button creates invalid interaction and conflicting targets.

## Accessibility

- **List semantics**: Renders ul/li so the group and item count are announced
- **Linked cards**: The card is a single link; the action label is part of its accessible name

## Composition

- Compose with **Section** — Place FeatureGrid inside a Section band
  
  ```tsx
  <Section><FeatureGrid features={features} /></Section>
  ```
- Related: Card, FeatureRow, ProcessSteps

