# MessageActions

Feedback toolbar for an AI response: copy to clipboard, thumbs up/down rating, and regenerate. Every action is a callback; the component holds no conversation state.

> Import: `import { MessageActions } from '@slipstream-ui/ai'`
> Registry: https://slipstreamui.com/registry/message-actions.json
> Tier: atom · Package: @slipstream-ui/ai

## Design intent

Collect user trust signals (copy, rating, regeneration) with minimal API surface; consumers own what happens after each action.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| content | `string` | — | no | Text to copy; omit to hide the copy action. |
| onCopy | `(content: string) => void` | — | no | Called after copy with the copied text. |
| onFeedback | `(rating: 'up' | 'down' | undefined) => void` | — | no | Rating callback; selecting the active rating again passes undefined. |
| onRegenerate | `() => void` | — | no | Regeneration request; omit to hide the action. |
| labels | `{ copy?, copied?, thumbUp?, thumbDown?, regenerate? }` | — | no | Overrides for all visible labels; enables localization. |

## Examples

### Full feedback bar

```tsx
<MessageActions content={message.content} onCopy={copy} onFeedback={(r) => track(r)} onRegenerate={regen} />
```

### Ratings only

```tsx
<MessageActions onFeedback={(r) => save(r)} />
```

## Anti-patterns

- **Do not place MessageActions inside the message text flow** — Render it below the Message bubble so actions remain visually and semantically separate from content.

## Accessibility

- **Toolbar semantics**: Root has role=toolbar with an aria-label.
- **Toggle state**: Rating buttons expose aria-pressed so screen readers announce selection.
- **Icon buttons**: All icon-only controls have accessible labels; labels are localizable.

