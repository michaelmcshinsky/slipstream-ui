# Conversation

A container for displaying a list of chat messages with auto-scroll and loading states

> Import: `import { Conversation } from '@slipstream-ui/ai'`
> Registry: https://slipstreamui.com/registry/conversation.json
> Tier: organism · Package: @slipstream-ui/ai

## Design intent

The Conversation component manages the display of multiple messages in a chat interface. It handles auto-scrolling to show new messages, distinct avatar configurations for users and assistants, and a loading state when the AI is generating a response.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| messages | `Message[]` | — | yes | Array of message objects to display |
| showAvatars | `boolean` | `true` | no | Whether to show avatars for messages |
| userAvatarSrc | `string` | — | no | Custom avatar image URL for user messages |
| userAvatarFallback | `string` | — | no | Fallback text for user avatar |
| assistantAvatarSrc | `string` | — | no | Custom avatar image URL for assistant messages |
| assistantAvatarFallback | `string` | — | no | Fallback text for assistant avatar |
| isLoading | `boolean` | `false` | no | Whether the assistant is currently generating a response |
| loadingMessage | `string` | `Thinking...` | no | Text to display while loading |
| className | `string` | — | no | Additional CSS classes to apply to the conversation container |
| renderContent | `(content: string) => ReactNode` | — | no | Custom renderer applied to every message (e.g. markdown). |
| streamingMessageId | `string` | — | no | ID of the message still generating; renders its streaming cursor and auto-scrolls. |
| showScrollButton | `boolean` | `true` | no | Show the scroll-to-latest button when the user scrolls up |
| showDownload | `boolean` | `true` | no | Show the transcript download action |
| messageErrors | `Record<string, string>` | — | no | Map of message id to error text; renders an error card on that message |
| onRetryMessage | `(message: MessageData) => void` | — | no | Called when the user retries a failed message |
| welcomeTitle | `string` | — | no | Title shown in the empty/welcome state |
| welcomeDescription | `string` | — | no | Supporting text in the welcome state |
| welcomeSuggestions | `string[]` | — | no | Starter prompts shown in the welcome state |
| onWelcomeSelect | `(prompt: string) => void` | — | no | Called when a welcome suggestion is clicked |
| hasMoreHistory | `boolean` | — | no | Whether older history pages exist (enables infinite scroll) |
| isLoadingMore | `boolean` | — | no | Whether a history page is currently loading |
| onLoadMore | `() => void` | — | no | Called when the user scrolls to the top to load older messages |

## Examples

### Basic conversation

Simple conversation with user and assistant messages

```tsx
<Conversation 
  messages={[
    { id: '1', role: 'user', content: 'Hello' },
    { id: '2', role: 'assistant', content: 'Hi there!' }
  ]}
/>
```

### With custom avatars

Conversation with custom avatar images and fallbacks

```tsx
<Conversation 
  messages={messages}
  userAvatarSrc="/user.png"
  userAvatarFallback="JD"
  assistantAvatarSrc="/ai.png"
  assistantAvatarFallback="AI"
/>
```

### With loading state

Conversation showing loading indicator while AI responds

```tsx
<Conversation 
  messages={messages}
  isLoading={true}
  loadingMessage="Generating your response..."
/>
```

### Without avatars

More compact conversation without avatars

```tsx
<Conversation 
  messages={messages}
  showAvatars={false}
/>
```

## Anti-patterns

- **Don't manage state inside Conversation** — Conversation should be a controlled component. State should be managed by the parent.
- **Don't use for non-chat content** — Conversation is specifically for chat messages, not general data display

## Accessibility

- **Live regions**: Consider adding aria-live to the container for screen readers to announce new messages
- **Keyboard navigation**: Container is scrollable with keyboard. Focus management depends on parent component
- **Loading announcement**: Loading state is visually indicated but not announced to screen readers by default

## Composition

- Compose with **Message** — Conversation renders multiple Message components internally
  
  ```tsx
  Conversation maps over messages array and renders Message for each item
  ```
- Compose with **PromptInput** — PromptInput is typically used alongside Conversation to submit new messages
  
  ```tsx
  Conversation displays messages, PromptInput adds new ones to the messages array
  ```
- Related: Message, PromptInput, ChatLayout

