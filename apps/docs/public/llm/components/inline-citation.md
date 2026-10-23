# InlineCitation

Perplexity-style inline citation chip that reveals the source title and snippet on hover or keyboard focus.

> Import: `import { InlineCitation } from '@slipstream-ui/ai'`
> Registry: https://slipstreamui.com/registry/inline-citation.json
> Tier: atom · Package: @slipstream-ui/ai

## Design intent

Attribute individual claims inside a response to their source without leaving the paragraph.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| source | `SourceItem` | — | yes | Cited source powering the preview card. |
| children | `ReactNode` | — | no | Wrapped text; defaults to the source title. |

## Examples

### Wrap a claim

```tsx
<InlineCitation source={sources[0]}>as reported</InlineCitation>
```

## Anti-patterns

- **Do not stack many citations on one word** — Use Sources footer for long lists; keep inline citations to one claim each.

## Accessibility

- **Keyboard access**: Trigger is a focusable button; card opens on focus-within.
- **Tooltip semantics**: Card has role=tooltip linked via aria-describedby.

