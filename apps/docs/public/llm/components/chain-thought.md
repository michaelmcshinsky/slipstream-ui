# ChainThought

Displays ordered reasoning steps with status indicators.

> Component ID: `chain-thought`
> Import: `import { ChainThought } from '@slipstream-ui/ai'`
> Docs: https://slipstreamui.com/docs/components/chain-thought
> Registry: https://slipstreamui.com/registry/chain-thought.json
> Tier: molecule · Package: @slipstream-ui/ai@0.11.5
> Manifest schema: v1 · manifest: v1

## Design intent

Provide a compact progress view for multi-step agent work.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| steps | `ChainThoughtStep[]` | — | yes | Ordered reasoning steps. |
| compact | `boolean` | `false` | no | Use compact typography. |

## Examples

### Agent steps

```tsx
<ChainThought steps={[{ id: '1', content: 'Analyzing…', status: 'pending' }]} />
```


## Accessibility

- **Status visibility**: Each step exposes a text label and visual status.

