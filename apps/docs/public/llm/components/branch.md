# Branch

Variant navigation for branched messages: previous/next arrows with an N/M position indicator.

> Import: `import { Branch } from '@slipstream-ui/ai'`
> Registry: https://slipstreamui.com/registry/branch.json
> Tier: atom · Package: @slipstream-ui/ai

## Design intent

Let users compare alternative AI responses without leaving the transcript flow.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| count | `number` | — | yes | Total variants; renders nothing below 2. |
| selected | `number` | — | no | Controlled zero-based index. |
| defaultSelected | `number` | `0` | no | Uncontrolled initial index. |
| onSelect | `(index: number) => void` | — | no | Called with the chosen variant index. |
| labels | `object` | — | no | Overrides for previous/next aria-labels. |

## Examples

### Two variants

```tsx
<Branch count={variants.length} selected={i} onSelect={setI} />
```

## Anti-patterns

- **Do not swap message content without syncing selected** — In controlled mode the displayed variant must follow onSelect.

## Accessibility

- **Boundary disabling**: Arrows disable at ends instead of wrapping silently.
- **Position announcement**: N/M indicator uses aria-live=polite.

