# Badge

A small status indicator component for displaying tags, counts, or status information

> Component ID: `badge`
> Import: `import { Badge } from '@slipstream-ui/core'`
> Docs: https://slipstreamui.com/docs/components/badge
> Registry: https://slipstreamui.com/registry/badge.json
> Tier: atom · Package: @slipstream-ui/core@0.11.1
> Manifest schema: v1 · manifest: v1

## Design intent

The Badge component is used to display small pieces of information like status indicators, counts, or tags. It provides visual variants for different semantic meanings (default, secondary, destructive, outline).

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| variant | `'default' | 'secondary' | 'destructive' | 'outline' | 'primary' | 'danger' | 'neutral' | 'accent' | 'success' | 'warning' | 'info' | 'outline-success' | 'outline-warning' | 'outline-info' | 'outline-danger'` | `default` | no | Semantic surface; primary/danger are aliases for default/destructive, neutral is a muted metadata pill, accent is a tinted brand pill, and outline-* are quiet status tones for metadata chips. |
| children | `ReactNode` | — | no | Content to display inside the badge |
| className | `string` | — | no | Additional CSS classes to apply |
| asChild | `boolean` | `false` | no | Render the child element with badge styling. |
| dot | `boolean` | `false` | no | Leading status dot colored to match the variant. Decorative only; pair with text that carries the meaning. |
| size | `'sm' | 'md' | 'lg'` | `md` | no | Pill scale: sm for dense tables, lg for hero and metadata strips. |

## Examples

### Tag linking to a filter

Tag that navigates.

```tsx
<Badge asChild>
  <Link href="/tags/react">React</Link>
</Badge>
```

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

- **Don't use for long text** — Badges are designed for short text. Use tooltips or other components for longer content.
- **Don't overuse badges** — Too many badges create visual noise. Prioritize the most important information.
- **Don't use wrong variant for meaning** — Destructive variant should only be used for errors or destructive actions.

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

