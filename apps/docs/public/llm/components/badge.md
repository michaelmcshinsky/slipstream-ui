# Badge

A small status indicator component for displaying tags, counts, or status information

> Import: `import { Badge } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/badge.json
> Tier: atom · Package: @slipstream-ui/core

## Design intent

The Badge component is used to display small pieces of information like status indicators, counts, or tags. It provides visual variants for different semantic meanings (default, secondary, destructive, outline).

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| variant | `'default' | 'secondary' | 'destructive' | 'outline'` | `default` | no | Visual style variant of the badge |
| children | `ReactNode` | — | no | Content to display inside the badge |
| className | `string` | — | no | Additional CSS classes to apply |

## Examples

### Default badge

Primary badge for highlighting new items

```tsx
<Badge>New</Badge>
```

### Secondary badge

Less prominent badge for secondary information

```tsx
<Badge variant="secondary">Info</Badge>
```

### Destructive badge

Badge for error states or destructive actions

```tsx
<Badge variant="destructive">Error</Badge>
```

### Outline badge

Subtle badge with outline style

```tsx
<Badge variant="outline">Beta</Badge>
```

### Count badge

Badge for displaying counts or numbers

```tsx
<Badge>3</Badge>
```

### Status badge

Badge for status indicators

```tsx
<Badge variant="outline">Active</Badge>
```

## Anti-patterns

- **Don't use for long text** — undefined
- **Don't overuse badges** — undefined
- **Don't use wrong variant for meaning** — undefined

## Accessibility

- **Screen reader support**: Badge content is announced as text. Use aria-label if badge has visual-only meaning
- **Color contrast**: All variants meet WCAG AA contrast requirements
- **Focus indication**: Badge has visible focus ring when keyboard navigable

## Composition

- Compose with **Button** — Badges can be combined with buttons to show notification counts or status
  
  ```tsx
  <Button><Badge>3</Badge> Messages</Button>
  ```
- Compose with **Card** — Badges are often used in card headers to show status or category
  
  ```tsx
  <Card><CardHeader><Badge>New</Badge></CardHeader></Card>
  ```
- Related: Button, Card, Tooltip

