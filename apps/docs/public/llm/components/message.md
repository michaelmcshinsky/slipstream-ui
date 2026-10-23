# Message

A chat message component that displays messages from users, assistants, or system prompts with optional avatars

> Import: `import { Message } from '@slipstream-ui/ai'`
> Registry: https://slipstreamui.com/registry/message.json
> Tier: molecule · Package: @slipstream-ui/ai

## Design intent

The Message component renders individual chat messages with proper styling based on the message role (user, assistant, system, tool). It handles avatar display, timestamps, and different visual treatments to distinguish between message types in a conversation interface.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| message | `Message` | — | yes | The message object containing role, content, and optional metadata |
| showAvatar | `boolean` | `true` | no | Whether to show the avatar for the message |
| avatarSrc | `string` | — | no | Optional custom avatar image URL |
| avatarFallback | `string` | — | no | Fallback text to show when avatar image is not available |
| className | `string` | — | no | Additional CSS classes to apply to the message container |
| renderContent | `(content: string) => ReactNode` | — | no | Custom renderer (e.g. markdown); replaces default plain-text rendering. |
| isStreaming | `boolean` | `false` | no | Shows a typing cursor and sets aria-busy while the response is still generating. |
| userLabel | `string` | `You` | no | Display name for user messages; enables localization. |
| assistantLabel | `string` | `Assistant` | no | Display name for assistant messages; enables localization. |

## Examples

### User message

Message from the user with default avatar

```tsx
<Message message={{ id: '1', role: 'user', content: 'Hello, how are you?' }} />
```

### Assistant message

Message from the AI assistant

```tsx
<Message message={{ id: '2', role: 'assistant', content: 'I\'m doing well, thank you!' }} />
```

### System message

System-level message with distinct styling

```tsx
<Message message={{ id: '3', role: 'system', content: 'System initialized' }} />
```

### With custom avatar

Message with custom avatar image and fallback

```tsx
<Message 
  message={{ id: '4', role: 'assistant', content: 'Hello' }}
  avatarSrc="/ai-avatar.png"
  avatarFallback="AI"
/>
```

### Without avatar

Message with avatar hidden for more compact display

```tsx
<Message 
  message={{ id: '5', role: 'user', content: 'Quick message' }}
  showAvatar={false}
/>
```

### Markdown rendering (opt-in)

```tsx
<Message message={m} renderContent={(c) => <ReactMarkdown>{c}</ReactMarkdown>} />
```

### Streaming response

```tsx
<Message message={partial} isStreaming />
```

## Anti-patterns

- **Don't use for complex content** — undefined
- **Don't hardcode message data** — undefined

## Accessibility

- **Screen reader support**: Message role and content are announced. Avatar has proper alt text from fallback or role
- **Color contrast**: User and assistant messages have distinct background colors with proper contrast
- **Semantic structure**: Message is rendered as a div with proper ARIA attributes for role identification

## Composition

- Compose with **Conversation** — Messages are typically rendered within a Conversation component that manages the message list
  
  ```tsx
  <Conversation>
  {messages.map(msg => <Message key={msg.id} message={msg} />)}
</Conversation>
  ```
- Compose with **PromptInput** — New messages from PromptInput should be added to the message list and rendered as Message components
  
  ```tsx
  const handleSubmit = (text) => {
  const newMessage = { id: Date.now(), role: 'user', content: text };
  setMessages([...messages, newMessage]);
}
  ```
- Related: Conversation, PromptInput, Avatar

