# StreamingIndicator

Shows that an AI response is currently streaming.

> Import: `import { StreamingIndicator } from '@slipstream-ui/ai'`
> Registry: https://slipstreamui.com/registry/streaming-indicator.json
> Tier: atom · Package: @slipstream-ui/ai

## Design intent

Give users immediate feedback while generated content is arriving.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| isStreaming | `boolean` | — | yes | Whether the indicator is visible. |
| text | `string` | `Generating…` | no | Status text. |

## Examples

### Generating state

```tsx
<StreamingIndicator isStreaming={true} />
```


## Accessibility

- **Status text**: The state includes human-readable text in addition to animation.

