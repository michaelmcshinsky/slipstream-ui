import type { ChatEvent, ChatMessage } from './types';

/**
 * Applies one stream event to an assistant message. Pure: returns a new message.
 * Unknown tools are appended; repeated tool ids replace the prior entry.
 */
export function applyEvent(message: ChatMessage, event: ChatEvent): ChatMessage {
  switch (event.type) {
    case 'text':
      return { ...message, text: message.text + event.delta };
    case 'reasoning':
      return { ...message, reasoning: message.reasoning + event.delta, reasoningStreaming: true };
    case 'reasoning-done':
      return { ...message, reasoningStreaming: false };
    case 'tool': {
      const index = message.tools.findIndex((tool) => tool.id === event.tool.id);
      const tools = index === -1 ? [...message.tools, event.tool] : message.tools.map((tool) => (tool.id === event.tool.id ? event.tool : tool));
      return { ...message, tools };
    }
    case 'citation':
      return { ...message, citations: [...message.citations, event.citation] };
    case 'approval':
      return { ...message, approval: event.approval };
    case 'done':
      return { ...message, status: 'complete', reasoningStreaming: false };
    case 'error':
      return { ...message, status: 'error', error: event.message, reasoningStreaming: false };
  }
}

/** Consumes an adapter and returns the final assistant message. */
export async function runChat(
  adapter: { stream(messages: ChatMessage[], signal?: AbortSignal): AsyncGenerator<ChatEvent> },
  messages: ChatMessage[],
  assistantId: string,
  onEvent?: (message: ChatMessage, event: ChatEvent) => void,
  signal?: AbortSignal,
): Promise<ChatMessage> {
  let current: ChatMessage = {
    id: assistantId,
    role: 'assistant',
    text: '',
    reasoning: '',
    reasoningStreaming: false,
    tools: [],
    citations: [],
    status: 'streaming',
  };

  try {
    for await (const event of adapter.stream(messages, signal)) {
      current = applyEvent(current, event);
      onEvent?.(current, event);
      if (event.type === 'done' || event.type === 'error') break;
    }
  } catch (error) {
    if (signal?.aborted) {
      current = { ...current, status: 'complete', reasoningStreaming: false };
    } else {
      current = applyEvent(current, { type: 'error', message: error instanceof Error ? error.message : String(error) });
    }
  }

  return current.status === 'streaming' ? { ...current, status: 'complete' } : current;
}
