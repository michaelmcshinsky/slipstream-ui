# Reasoning

A collapsible component for displaying AI reasoning steps and chain-of-thought processes

> Import: `import { Reasoning } from '@slipstream-ui/ai'`
> Registry: https://slipstreamui.com/registry/reasoning.json
> Tier: molecule · Package: @slipstream-ui/ai

## Design intent

The Reasoning component displays the step-by-step thought process of an AI agent. It's collapsible to avoid cluttering the interface while still providing transparency into how the AI arrived at its conclusions.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| steps | `ReasoningStep[]` | — | yes | Array of reasoning steps to display |
| collapsible | `boolean` | `true` | no | Whether the reasoning can be collapsed/expanded |
| defaultExpanded | `boolean` | `false` | no | Whether the reasoning is expanded by default |
| className | `string` | — | no | Additional CSS classes to apply |

## Examples

### Basic reasoning

Collapsible reasoning with multiple steps

```tsx
<Reasoning 
  steps={[
    { id: '1', content: 'I need to analyze the user\'s request.' },
    { id: '2', content: 'The user wants to know about React components.' },
    { id: '3', content: 'I should provide a comprehensive answer.' }
  ]}
/>
```

### Expanded by default

Reasoning that shows steps immediately

```tsx
<Reasoning 
  steps={steps}
  defaultExpanded={true}
/>
```

### Non-collapsible

Reasoning that cannot be collapsed

```tsx
<Reasoning 
  steps={steps}
  collapsible={false}
/>
```

### With timestamps

Reasoning steps with timing information

```tsx
<Reasoning 
  steps={[
    { id: '1', content: 'Step 1', timestamp: new Date() },
    { id: '2', content: 'Step 2', timestamp: new Date() }
  ]}
/>
```

## Anti-patterns

- **Don't show reasoning for simple responses** — undefined
- **Don't make steps too verbose** — undefined
- **Don't show empty reasoning** — undefined

## Accessibility

- **Collapsible state**: Uses aria-expanded to communicate collapsible state to screen readers
- **Keyboard navigation**: Collapsible button is keyboard accessible with Enter/Space to toggle
- **Visual hierarchy**: Steps are numbered and visually distinct with clear hierarchy

## Composition

- Compose with **Message** — Reasoning is typically displayed before or within an assistant's message to show thought process
  
  ```tsx
  Message component can contain Reasoning to show the AI's thinking before the final response
  ```
- Compose with **ToolCall** — Reasoning often precedes tool calls to explain why a tool is being used
  
  ```tsx
  Reasoning explains the decision to use a tool, ToolCall shows the actual tool invocation
  ```
- Related: Message, ToolCall, Conversation

