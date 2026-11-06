import type { ChatEvent, ChatMessage } from './types';

const DEFAULT_BASE_URL = 'https://api.openai.com/v1';
const DEFAULT_MODEL = 'gpt-4.1-mini';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** OpenAI-compatible streaming adapter (raw SSE, no SDK dependency). */
export async function* streamOpenAI(messages: ChatMessage[], signal?: AbortSignal): AsyncGenerator<ChatEvent> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    yield { type: 'error', message: 'OPENAI_API_KEY is not configured.' };
    return;
  }

  const baseUrl = (process.env.OPENAI_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/$/, '');
  const model = process.env.OPENAI_MODEL ?? DEFAULT_MODEL;
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      stream: true,
      temperature: 0.2,
      messages: messages
        .filter((message) => message.role === 'user' || message.role === 'assistant')
        .map((message) => ({ role: message.role, content: message.text })),
    }),
    signal,
  });

  if (!response.ok || !response.body) {
    const detail = await response.text().catch(() => '');
    yield { type: 'error', message: `OpenAI error: HTTP ${response.status} ${detail.slice(0, 200)}` };
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line.startsWith('data:')) continue;
        const data = line.slice(5).trim();
        if (!data || data === '[DONE]') continue;
        try {
          const parsed: unknown = JSON.parse(data);
          if (!isRecord(parsed) || !Array.isArray(parsed.choices)) continue;
          const first = parsed.choices[0];
          if (!isRecord(first) || !isRecord(first.delta)) continue;
          const content = first.delta.content;
          if (typeof content === 'string' && content.length > 0) {
            yield { type: 'text', delta: content };
          }
        } catch {
          // Malformed frame: ignore, keep streaming.
        }
      }
    }
    yield { type: 'done' };
  } catch (error) {
    yield { type: 'error', message: error instanceof Error ? error.message : String(error) };
  } finally {
    reader.releaseLock();
  }
}
