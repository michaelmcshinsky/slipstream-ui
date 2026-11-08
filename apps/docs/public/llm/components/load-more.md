# LoadMore

Load-more control with pending and end-of-list states.

> Import: `import { LoadMore } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/load-more.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Paginated lists without page numbers need one consistent load-more control that announces loading and the end of the list. LoadMore keeps the row layout and state copy in one place.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| hasMore | `boolean` | — | yes | Whether another page is available. |
| onLoadMore | `() => void` | — | yes | Request the next page. |
| loading | `boolean` | `false` | no | Loading state. |
| loadLabel | `string` | `Load more` | no | Button label. |
| loadingLabel | `string` | `Loading...` | no | Loading label. |
| endLabel | `string` | `You're all caught up.` | no | End-of-list message. |

## Examples

### Deal grid pagination

A load-more control below a card grid.

```tsx
<LoadMore hasMore={hasMore} loading={loading} onLoadMore={loadNextPage} />
```

## Anti-patterns

- **Don't keep the button when the list is complete** — Replace the button with the end message so there is no dead action.

## Accessibility

- **Live state**: The wrapper uses aria-live polite; loading disables the button and sets aria-busy

## Composition

- Compose with **Grid** — Place LoadMore below the card grid
  
  ```tsx
  <Grid>...</Grid><LoadMore ... />
  ```
- Related: Pagination, DataTable, DealCard, EntityCard

