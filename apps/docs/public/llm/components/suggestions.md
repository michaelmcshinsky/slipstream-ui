# Suggestions

Displays clickable follow-up prompts for AI interactions.

> Import: `import { Suggestions } from '@slipstream-ui/ai'`
> Registry: https://slipstreamui.com/registry/suggestions.json
> Tier: molecule · Package: @slipstream-ui/ai

## Design intent

Help users discover useful next actions without composing every prompt from scratch.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| suggestions | `Suggestion[]` | — | yes | Suggestions to display. |
| onSelect | `(suggestion: Suggestion) => void` | — | no | Called when a suggestion is selected. |

## Examples

### Follow-up prompts

```tsx
<Suggestions suggestions={[{ id: '1', text: 'Show me an example' }]} />
```


## Accessibility

- **Keyboard activation**: Suggestions are native buttons.

