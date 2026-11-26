# StreamingIndicator

Shows that an AI response is currently streaming.

> Component ID: `streaming-indicator`
> Import: `import { StreamingIndicator } from '@slipstream-ui/ai'`
> Docs: https://slipstreamui.com/docs/components/streaming-indicator
> Registry: https://slipstreamui.com/registry/streaming-indicator.json
> Tier: atom · Package: @slipstream-ui/ai@0.11.0
> Manifest schema: v1 · manifest: v1

## Design intent

Give users immediate feedback while generated content is arriving.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| isStreaming | `boolean` | — | yes | Whether the indicator is visible. |
| text | `string` | `Generating…` | no | Status text. |
| size | `'sm' | 'md' | 'lg'` | `md` | no | Dot and label scale. |
| tone | `'primary' | 'muted' | 'current'` | `primary` | no | Dot colour: brand primary, muted foreground, or the inherited text colour. |
| dotCount | `number` | `3` | no | How many dots pulse. |
| showLabel | `boolean` | `true` | no | Render the label beside the dots; the text stays the accessible name either way. |

## Examples

### Generating state

```tsx
<StreamingIndicator isStreaming={true} />
```


## Accessibility

- **Status text**: The state includes human-readable text in addition to animation.

