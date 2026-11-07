# Skeleton

A loading placeholder that mirrors the shape of upcoming content

> Import: `import { Skeleton } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/skeleton.json
> Tier: atom · Package: @slipstream-ui/core

## Design intent

Skeleton reduces perceived loading time by showing the layout shape before data arrives. It is aria-hidden so screen readers skip it; pair with a live-region status to announce loading.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| className | `string` | — | no | Shape and size classes (e.g. h-4 w-32, rounded-full) |
| height | `string` | — | no | Tailwind height class for the block (e.g. 'h-4'). |
| width | `string` | `w-full` | no | Tailwind width class for the block (e.g. 'w-48'). |
| rounded | `'none' | 'sm' | 'md' | 'lg' | 'full'` | `md` | no | Corner preset — full for avatars/dots, none for tables. |
| label | `string` | — | no | Optional loading announcement. When set, the block becomes a status region instead of decorative. |

## Examples

### Text placeholder

Placeholder for a line of text

```tsx
<Skeleton className="h-4 w-32" />
```

### Card placeholder

Placeholder matching a card layout

```tsx
<div className="space-y-2">
  <Skeleton className="h-24 w-full rounded-lg" />
  <Skeleton className="h-4 w-2/3" />
</div>
```

### With live-region announcement

Announcing the loading state to screen readers

```tsx
<span role="status" className="sr-only">Loading…</span>
<Skeleton className="h-4 w-48" />
```

## Anti-patterns

- **Don't use Skeleton as a permanent element** — Skeletons are for loading states only; remove once content renders.
- **Don't use Skeleton without announcing loading** — Skeleton is aria-hidden. Add a role=status element so screen-reader users know something is loading.

## Accessibility

- **Hidden from assistive tech**: aria-hidden="true" on the placeholder
- **Reduced motion**: Pulse animation is disabled under prefers-reduced-motion

## Composition

- Compose with **Status region** — Always pair with a status region to announce loading
  
  ```tsx
  <span role="status" className="sr-only">Loading…</span><Skeleton className="h-4 w-32" />
  ```
- Related: Progress, Spinner

