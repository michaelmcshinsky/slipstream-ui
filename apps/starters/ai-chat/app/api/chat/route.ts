import { streamMock } from '@/src/lib/chat/mock-adapter';
import { streamOpenAI } from '@/src/lib/chat/openai-adapter';
import type { ChatEvent, ChatMessage } from '@/src/lib/chat/types';

export const runtime = 'nodejs';

type Body = { messages?: ChatMessage[] };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readMessages(value: unknown): ChatMessage[] {
  if (!isRecord(value) || !Array.isArray(value.messages)) return [];
  return value.messages.filter(
    (entry): entry is ChatMessage =>
      isRecord(entry) && typeof entry.id === 'string' && typeof entry.role === 'string' && typeof entry.text === 'string',
  );
}

async function* eventsFor(messages: ChatMessage[], signal: AbortSignal): AsyncGenerator<ChatEvent> {
  const backend = process.env.CHAT_BACKEND ?? (process.env.OPENAI_API_KEY ? 'openai' : 'mock');
  if (backend === 'openai') {
    yield* streamOpenAI(messages, signal);
    return;
  }
  const prompt = [...messages].reverse().find((message) => message.role === 'user')?.text ?? '';
  yield* streamMock(prompt, { delayMs: Number.parseInt(process.env.MOCK_DELAY_MS ?? '18', 10) });
}

export async function POST(request: Request): Promise<Response> {
  let body: Body = {};
  try {
    const parsed: unknown = await request.json();
    body = { messages: readMessages(parsed) };
  } catch {
    body = { messages: [] };
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of eventsFor(body.messages ?? [], request.signal)) {
          if (request.signal.aborted) break;
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        }
      } catch (error) {
        const event: ChatEvent = { type: 'error', message: error instanceof Error ? error.message : String(error) };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-cache, no-transform',
      connection: 'keep-alive',
    },
  });
}
