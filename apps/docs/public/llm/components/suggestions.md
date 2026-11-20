# Suggestions

Displays clickable follow-up prompts for AI interactions.

> Component ID: `suggestions`
> Import: `import { Suggestions } from '@slipstream-ui/ai'`
> Docs: https://slipstreamui.com/docs/components/suggestions
> Registry: https://slipstreamui.com/registry/suggestions.json
> Tier: molecule · Package: @slipstream-ui/ai@0.10.0
> Manifest schema: v1 · manifest: v1

## Design intent

Help users discover useful next actions without composing every prompt from scratch.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| suggestions | `Suggestion[]` | — | yes | Suggestions to display. |
| onSelect | `(suggestion: Suggestion) => void` | — | no | Called when a suggestion is selected. |
| maxDisplay | `number` | `4` | no | Maximum number of suggestions to display before truncating |

## Examples

### Follow-up prompts

```tsx
<Suggestions suggestions={[{ id: '1', text: 'Show me an example' }]} />
```


## Accessibility

- **Keyboard activation**: Suggestions are native buttons.

