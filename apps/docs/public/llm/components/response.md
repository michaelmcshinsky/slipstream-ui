# Response

Streaming-optimized markdown renderer for AI responses with GFM support, streaming-safe repair of incomplete syntax, and highlighted code blocks with copy.

> Import: `import { Response } from '@slipstream-ui/ai'`
> Registry: https://slipstreamui.com/registry/response.json
> Tier: molecule · Package: @slipstream-ui/ai

## Design intent

Render AI output as rich content without flicker or broken partial syntax while tokens arrive.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| children | `string` | — | yes | Markdown content to render. |
| parseIncompleteMarkdown | `boolean` | `true` | no | Close unclosed emphasis/inline-code/fences during streaming. |

## Examples

### Basic response

```tsx
<Response>{assistantMessage.content}</Response>
```

### Inside Message

```tsx
<Message message={m} renderContent={(c) => <Response>{c}</Response>} />
```

## Anti-patterns

- **Do not use Response inside a code fence context** — Response is the top-level renderer; nested Response instances double-parse content.

## Accessibility

- **Semantic HTML**: Headings, lists and tables are real elements announced correctly.
- **Code blocks**: Routed through CodeBlock with accessible copy button.

