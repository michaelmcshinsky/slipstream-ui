import type { ChatEvent } from './types';

/** Parses `data: {...}\n\n` frames. Returns complete events plus the unparsed tail. */
export function parseSseChunk(buffer: string): { events: ChatEvent[]; rest: string } {
  const events: ChatEvent[] = [];
  const frames = buffer.split('\n\n');
  const rest = frames.pop() ?? '';

  for (const frame of frames) {
    const data = frame
      .split('\n')
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice(5).trim())
      .join('\n');
    if (!data || data === '[DONE]') continue;
    try {
      const parsed: unknown = JSON.parse(data);
      if (isChatEvent(parsed)) events.push(parsed);
    } catch {
      // Ignore malformed frames; a broken chunk must not kill the stream.
    }
  }

  return { events, rest };
}

function isChatEvent(value: unknown): value is ChatEvent {
  return typeof value === 'object' && value !== null && typeof (value as { type?: unknown }).type === 'string';
}

/** Reads a fetch Response body as ChatEvents. */
export async function* streamSse(response: Response): AsyncGenerator<ChatEvent> {
  if (!response.body) throw new Error('Response has no body');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parsed = parseSseChunk(buffer);
      buffer = parsed.rest;
      for (const event of parsed.events) yield event;
    }
    buffer += decoder.decode();
    const parsed = parseSseChunk(`${buffer}\n\n`);
    for (const event of parsed.events) yield event;
  } finally {
    reader.releaseLock();
  }
}

export function createFetchAdapter(endpoint = '/api/chat'): {
  name: string;
  stream: (messages: import('./types').ChatMessage[], signal?: AbortSignal) => AsyncGenerator<ChatEvent>;
} {
  return {
    name: 'sse',
    async *stream(messages, signal) {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages }),
        signal,
      });
      if (!response.ok) {
        yield { type: 'error', message: `Chat request failed: HTTP ${response.status}` };
        return;
      }
      yield* streamSse(response);
    },
  };
}
