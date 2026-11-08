# DealCard

Deal opportunity card with sector, status, metrics, NDA/CIM badges and access actions.

> Import: `import { DealCard } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/deal-card.json
> Tier: organism · Package: @slipstream-ui/core

## Design intent

Deal lists repeat the same card across trends, search and saved views. DealCard keeps the metrics and access state consistent and never implies NDA or CIM access without an explicit badge.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| title | `string` | — | yes | Deal headline. |
| sector | `string` | — | yes | Sector or industry label. |
| location | `string` | — | no | Region or location. |
| description | `string` | — | no | Optional short summary. |
| metrics | `DealMetric[]` | — | yes | Three headline metrics such as revenue, EBITDA and margin. |
| status | `'available' | 'under-nda' | 'closed' | 'draft'` | `available` | no | Availability state. |
| ndaAvailable | `boolean` | — | no | Show the NDA badge. |
| cimAvailable | `boolean` | — | no | Show the CIM badge. |
| href | `string` | — | no | Optional deal detail link. |
| linkComponent | `React.ElementType` | — | no | Custom link element for routers. |
| saved | `boolean` | `false` | no | Save toggle state. |
| onSave | `() => void` | — | no | Save toggle handler. |
| saveLabel | `string` | `Save` | no | Save button label. |
| onRequestAccess | `() => void` | — | no | Request access handler. |
| requestLabel | `string` | `Request access` | no | Request access label. |

## Examples

### Deal opportunity

A deal card with access badges and one action.

```tsx
<DealCard
  title="Fleet services platform"
  sector="Transportation"
  location="South Atlantic"
  metrics={[
    { label: 'Revenue', value: '$20.4M' },
    { label: 'EBITDA', value: '$4.2M' },
    { label: 'Margin', value: '21%' },
  ]}
  ndaAvailable
  cimAvailable
  onRequestAccess={requestAccess}
/>
```

## Anti-patterns

- **Don't imply access with color** — NDA and CIM access are stated as text badges. Do not use color or a lock icon alone.

## Accessibility

- **Action labels**: Request access and Save are real buttons; Save exposes aria-pressed
- **Metric pairs**: Metrics render as a description list

## Composition

- Compose with **Grid** — Place cards in a responsive Grid
  
  ```tsx
  <Grid mdCols={2} gap="lg"><DealCard ... /></Grid>
  ```
- Compose with **LoadMore** — Pair a deal grid with LoadMore for paginated results
  
  ```tsx
  <DealCard ... /><LoadMore hasMore={hasMore} onLoadMore={load} />
  ```
- Related: Card, Badge, EntityCard, LoadMore

