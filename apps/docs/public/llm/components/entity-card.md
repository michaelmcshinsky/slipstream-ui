# EntityCard

Firm or member profile card with logo, type, location, stats, tags and actions.

> Import: `import { EntityCard } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/entity-card.json
> Tier: organism · Package: @slipstream-ui/core

## Design intent

Directory and profile lists repeat the same firm card. EntityCard keeps the identity, stats and sector tags consistent and falls back to initials when no logo exists.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| name | `string` | — | yes | Firm or member name. |
| entityType | `string` | — | yes | Firm type, role or member category. |
| location | `string` | — | no | Region or office location. |
| description | `string` | — | no | Short firm description. |
| logo | `ReactNode` | — | no | Logo slot. Falls back to initials when omitted. |
| stats | `EntityStat[]` | — | no | Small stats such as closed deals or active mandates. |
| tags | `string[]` | — | no | Sector or service tags. |
| href | `string` | — | no | Profile destination. |
| linkComponent | `React.ElementType` | — | no | Custom link element for routers. |
| actions | `ReactNode` | — | no | Extra footer actions. |

## Examples

### Directory profile

A firm card with stats, tags and a profile link.

```tsx
<EntityCard
  name="Peakstone Group"
  entityType="Investment bank"
  location="New York, NY"
  stats={[
    { label: 'Closed deals', value: '60' },
    { label: 'Via Axial', value: '3' },
  ]}
  tags={['Industrials', 'Healthcare']}
  href="/members/peakstone"
/>
```

## Anti-patterns

- **Don't make the whole card a link with nested actions** — The title and footer link are the destinations; actions stay separate so controls never nest.

## Accessibility

- **Identity fallback**: The avatar fallback derives initials from the name
- **Stats**: Stats render as a description list

## Composition

- Compose with **Grid** — Place entity cards in a directory Grid
  
  ```tsx
  <Grid mdCols={3} gap="lg"><EntityCard ... /></Grid>
  ```
- Related: Avatar, Badge, Card, DealCard, DocumentCard

