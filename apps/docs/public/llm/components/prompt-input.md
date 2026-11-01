# PromptInput

A textarea input for entering chat prompts with auto-resize, keyboard shortcuts, and send button

> Import: `import { PromptInput } from '@slipstream-ui/ai'`
> Registry: https://slipstreamui.com/registry/prompt-input.json
> Tier: molecule · Package: @slipstream-ui/ai

## Design intent

The PromptInput component provides a specialized input for chat interfaces. It handles auto-resizing as the user types, supports Enter to submit (Shift+Enter for new line), and integrates with the conversation flow. It's designed to be the primary way users interact with AI assistants.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| onSubmit | `(value: string) => void` | — | yes | Callback when the user submits the prompt |
| placeholder | `string` | `Type your message...` | no | Placeholder text to display when input is empty |
| disabled | `boolean` | `false` | no | Whether the input is disabled |
| isLoading | `boolean` | `false` | no | Whether a submission is currently in progress |
| autoFocus | `boolean` | `false` | no | Whether to auto-focus the input on mount |
| maxLength | `number` | — | no | Maximum character count for the input |
| showSendButton | `boolean` | `true` | no | Whether to show the send button |
| sendButtonText | `string` | `Send` | no | Text or icon for the send button |
| className | `string` | — | no | Additional CSS classes to apply to the container |
| onStop | `() => void` | — | no | While loading, the send button becomes a stop button that calls this handler. |
| stopButtonText | `string` | `Stop generating` | no | Accessible label for the stop button; enables localization. |
| attachments | `AttachmentItem[]` | — | no | Controlled attachment list shown as chips above the input |
| onRemoveAttachment | `(id: string) => void` | — | no | Called when the user removes an attachment chip |
| onAttachmentsChange | `(attachments: AttachmentItem[]) => void` | — | no | Called when files are added via drag-and-drop, paste, or picker |
| hasError | `boolean` | — | no | Styles the input in an error state (e.g. after a rejected file) |
| accept | `string` | — | no | MIME types accepted for attachments (e.g. "image/*") |
| multiple | `boolean` | — | no | Allow selecting multiple files |
| maxFiles | `number` | — | no | Maximum number of attachments allowed |
| maxFileSize | `number` | — | no | Maximum file size in bytes; rejects larger files |
| onAttachmentError | `(error: string) => void` | — | no | Called when an attachment is rejected (size, type, or count limit) |
| globalDrop | `boolean` | — | no | Enable drop-anywhere-on-page file acceptance |
| children | `ReactNode` | — | no | Custom content rendered inside the input row (e.g. tool buttons) |
| tooltip | `string | { content: ReactNode; shortcut?: string }` | — | no | Tooltip content for a toolbar button; optionally includes a keyboard shortcut hint (PromptInput.Button sub-component) |
| active | `boolean` | `false` | no | Toggles the active state on a toolbar button (PromptInput.Button sub-component) |

## Examples

### Basic prompt input

Simple prompt input with default configuration

```tsx
<PromptInput onSubmit={(value) => console.log(value)} />
```

### With custom placeholder

Prompt input with custom placeholder text

```tsx
<PromptInput 
  onSubmit={handleSubmit}
  placeholder="Ask me anything about coding..."
/>
```

### With auto-focus

Auto-focuses the input when component mounts

```tsx
<PromptInput 
  onSubmit={handleSubmit}
  autoFocus={true}
/>
```

### With character limit

Limits input to 500 characters

```tsx
<PromptInput 
  onSubmit={handleSubmit}
  maxLength={500}
/>
```

### Without send button

Hides the send button (user must press Enter)

```tsx
<PromptInput 
  onSubmit={handleSubmit}
  showSendButton={false}
/>
```

### With loading state

Shows loading state and disables while AI is responding

```tsx
<PromptInput 
  onSubmit={handleSubmit}
  isLoading={isGenerating}
  disabled={isGenerating}
/>
```

### Cancellable generation

```tsx
<PromptInput onSubmit={send} isLoading={loading} onStop={() => abortRef.current.abort()} />
```

## Anti-patterns

- **Don't use for non-chat input** — PromptInput is specifically for chat interactions, not general form input
- **Don't ignore Enter key behavior** — Users expect Enter to submit. If you change this, communicate it clearly
- **Don't validate after submission** — Disable the input when empty rather than validating in the handler

## Accessibility

- **Keyboard navigation**: Full keyboard support with Enter to submit, Shift+Enter for new line
- **Screen reader support**: Textarea has proper label and placeholder. Button state is announced
- **Form validation**: Button is disabled when input is empty, preventing invalid submissions
- **Auto-resize**: Textarea automatically grows with content up to max-height

## Composition

- Compose with **Conversation** — PromptInput is typically used below a Conversation component to add new messages
  
  ```tsx
  Conversation displays messages, PromptInput submits new ones to the same messages array
  ```
- Compose with **ChatLayout** — PromptInput is often part of a ChatLayout that combines Conversation and input
  
  ```tsx
  ChatLayout wraps Conversation and PromptInput in a complete chat interface
  ```
- Related: Conversation, ChatLayout, Button

