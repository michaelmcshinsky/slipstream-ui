# Slipstream UI — LLM Documentation Index

The AI-first React component library. Every component ships a machine-readable
COMPONENT_MANIFEST; this directory mirrors those manifests as markdown.

- Library docs: https://slipstreamui.com/docs
- Manifest registry: https://slipstreamui.com/registry/all.json
- shadcn-compatible install: `npx shadcn@latest add https://slipstreamui.com/registry/<id>.json`

## Core components (@slipstream-ui/core)

- [Avatar](https://slipstreamui.com/llm/components/avatar.md) — A user profile image component with fallback support and accessible image loading
- [Badge](https://slipstreamui.com/llm/components/badge.md) — A small status indicator component for displaying tags, counts, or status information
- [Button](https://slipstreamui.com/llm/components/button.md) — A clickable button component with variants for different visual styles and sizes
- [Input](https://slipstreamui.com/llm/components/input.md) — A text input field with support for various input types and standard HTML input attributes
- [Spinner](https://slipstreamui.com/llm/components/spinner.md) — Indeterminate loading indicator with accessible status semantics.

## AI components (@slipstream-ui/ai)

- [Attachment / AttachmentList](https://slipstreamui.com/llm/components/attachment.md) — File chips for prompts and messages. `Attachment` renders one file; `AttachmentList` renders a wrapping row. Display-only: upload and file-system logic stay in the consumer.
- [Branch](https://slipstreamui.com/llm/components/branch.md) — Variant navigation for branched messages: previous/next arrows with an N/M position indicator.
- [ChainThought](https://slipstreamui.com/llm/components/chain-thought.md) — Displays ordered reasoning steps with status indicators.
- [CodeBlock](https://slipstreamui.com/llm/components/code-block.md) — Syntax-highlighted code block with language label and copy-to-clipboard button.
- [Confirmation](https://slipstreamui.com/llm/components/confirmation.md) — Human-in-the-loop approval gate for agent actions. Pauses execution until the user approves or rejects.
- [Conversation](https://slipstreamui.com/llm/components/conversation.md) — A container for displaying a list of chat messages with auto-scroll and loading states
- [InlineCitation](https://slipstreamui.com/llm/components/inline-citation.md) — Perplexity-style inline citation chip that reveals the source title and snippet on hover or keyboard focus.
- [Message](https://slipstreamui.com/llm/components/message.md) — A chat message component that displays messages from users, assistants, or system prompts with optional avatars
- [MessageActions](https://slipstreamui.com/llm/components/message-actions.md) — Feedback toolbar for an AI response: copy to clipboard, thumbs up/down rating, and regenerate. Every action is a callback; the component holds no conversation state.
- [PromptInput](https://slipstreamui.com/llm/components/prompt-input.md) — A textarea input for entering chat prompts with auto-resize, keyboard shortcuts, and send button
- [Reasoning](https://slipstreamui.com/llm/components/reasoning.md) — A collapsible component for displaying AI reasoning steps and chain-of-thought processes
- [Response](https://slipstreamui.com/llm/components/response.md) — Streaming-optimized markdown renderer for AI responses with GFM support, streaming-safe repair of incomplete syntax, and highlighted code blocks with copy.
- [Source / Sources](https://slipstreamui.com/llm/components/source.md) — Displays citations and references for an AI response. `Source` renders a single citation; `Sources` renders a numbered list with an overflow count.
- [StreamingIndicator](https://slipstreamui.com/llm/components/streaming-indicator.md) — Shows that an AI response is currently streaming.
- [Suggestions](https://slipstreamui.com/llm/components/suggestions.md) — Displays clickable follow-up prompts for AI interactions.
- [ToolCall](https://slipstreamui.com/llm/components/tool-call.md) — A component for displaying AI tool/function calls with status, arguments, and results

## Usage guidance

1. Read the component .md page before generating code — it lists exact prop names,
   required props, anti-patterns, and accessibility requirements.
2. Never invent props not present in the Props table.
3. Components are stateless and uncontrolled unless documented otherwise;
   consumers own conversation/thread state.
