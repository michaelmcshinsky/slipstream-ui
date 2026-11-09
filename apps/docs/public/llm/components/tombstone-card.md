# TombstoneCard

Placeholder card for archived, closed or unavailable marketplace items.

> Import: `import { TombstoneCard } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/tombstone-card.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Removing unavailable items silently breaks saved links and user expectations. TombstoneCard keeps the item in place and states the reason and status.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| title | `string` | — | yes | Listing, deal or document name. |
| reason | `string` | — | no | Why the item is unavailable. |
| status | `'archived' | 'unavailable' | 'closed'` | `unavailable` | no | Unavailable state. |
| logo | `ReactNode` | — | no | Logo or document icon slot. |
| href | `string` | — | no | Optional detail destination. |
| actionLabel | `string` | `View details` | no | Link label. |
| linkComponent | `React.ElementType` | — | no | Custom link element for routers. |

## Examples

### Archived listing

A muted card that explains why the listing is unavailable.

```tsx
<TombstoneCard
  title="Archived listing"
  reason="This listing closed in 2025."
  status="archived"
  href="/deals/archived"
/>
```

## Anti-patterns

- **Don't remove the item without explanation** — A saved link or bookmark should still resolve to a card that explains the state.

## Accessibility

- **Status text**: The unavailable state is a text badge, not color alone

## Composition

- Compose with **Grid** — Use in place of a DealCard or EntityCard when the item is unavailable
  
  ```tsx
  <Grid><TombstoneCard ... /></Grid>
  ```
- Related: Card, Badge, DealCard, EntityCard

