# ToolCall

A component for displaying AI tool/function calls with status, arguments, and results

> Import: `import { ToolCall } from '@slipstream-ui/ai'`
> Registry: https://slipstreamui.com/registry/tool-call.json
> Tier: molecule · Package: @slipstream-ui/ai

## Design intent

The ToolCall component visualizes when an AI agent uses tools or functions. It shows the tool name, status (pending, running, completed, failed), arguments passed, and the result returned. This provides transparency into the AI's actions.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| toolCall | `ToolCall` | — | yes | The tool call object containing name, arguments, status, and result |
| showResult | `boolean` | `true` | no | Whether to display the tool result |
| className | `string` | — | no | Additional CSS classes to apply |

## Examples

### Completed tool call

Tool call that completed successfully with result

```tsx
<ToolCall 
  toolCall={{
    id: '1',
    name: 'search',
    arguments: { query: 'React components' },
    status: 'completed',
    result: { results: [...] }
  }}
/>
```

### Running tool call

Tool call currently in progress

```tsx
<ToolCall 
  toolCall={{
    id: '2',
    name: 'calculate',
    arguments: { expression: '2 + 2' },
    status: 'running'
  }}
/>
```

### Failed tool call

Tool call that failed with error message

```tsx
<ToolCall 
  toolCall={{
    id: '3',
    name: 'api_request',
    arguments: { endpoint: '/users' },
    status: 'failed',
    result: { error: 'Timeout' }
  }}
/>
```

### Without result

Tool call with result hidden

```tsx
<ToolCall 
  toolCall={toolCall}
  showResult={false}
/>
```

## Anti-patterns

- **Don't show tool calls for simple operations** — undefined
- **Don't expose sensitive data in arguments** — undefined
- **Don't ignore failed tool calls** — undefined

## Accessibility

- **Status indication**: Status is shown with both color and text label for clarity
- **Code readability**: Arguments and results are displayed in pre/code blocks with proper formatting
- **Structure**: Tool call information is organized in clear sections (header, arguments, result)

## Composition

- Compose with **Message** — ToolCall components are typically displayed within assistant messages to show tool usage
  
  ```tsx
  Message component can contain ToolCall to show when the AI used tools during its response
  ```
- Compose with **Reasoning** — Reasoning often precedes ToolCall to explain why a tool is being invoked
  
  ```tsx
  Reasoning explains the decision to use a tool, ToolCall shows the actual invocation
  ```
- Related: Message, Reasoning, Conversation

