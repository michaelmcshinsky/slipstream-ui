# Timeline

Vertical chronology for experience, activity and audit trails, built on an ordered list.

> Import: `import { Timeline } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/timeline.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Chronologies communicate order. Rendering them as an ordered list keeps the sequence structural for assistive tech, while the connector rule and dots provide the visual rhythm.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| items | `{ title: string; period?: string; description?: string; icon?: ReactNode; muted?: boolean }[]` | — | yes | Ordered timeline entries. |

## Examples

### Experience

Period label, title and supporting line per entry.

```tsx
<Timeline
  items={[
    { title: 'Senior Engineer', period: '2023 — Present', description: 'Platform team' },
    { title: 'Engineer', period: '2020 — 2023' },
  ]}
/>
```

## Anti-patterns

- **Don't reverse the DOM order for newest-first** — Reverse the array instead so reading order matches visual order.

## Accessibility

- **Sequence**: Ordered list semantics

## Composition

- Compose with **Card** — Often embedded in profile/about cards
  
  ```tsx
  <Card><CardContent><Timeline items={roles} /></CardContent></Card>
  ```
- Related: List, Card, Separator

