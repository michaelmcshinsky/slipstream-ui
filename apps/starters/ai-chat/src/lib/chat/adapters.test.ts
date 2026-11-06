import { describe, expect, it } from 'vitest';
import { streamMock } from './mock-adapter';
import { applyEvent, runChat } from './runner';
import { parseSseChunk } from './sse-adapter';
import { createAssistantMessage, type ChatEvent } from './types';

async function collect(events: AsyncGenerator<ChatEvent>): Promise<ChatEvent[]> {
  const collected: ChatEvent[] = [];
  for await (const event of events) collected.push(event);
  return collected;
}

describe('mock adapter', () => {
  it('emits reasoning, text, a completed tool, a citation and done', async () => {
    const events = await collect(streamMock('Summarize the docs', { delayMs: 0 }));
    expect(events.some((event) => event.type === 'reasoning')).toBe(true);
    expect(events.some((event) => event.type === 'reasoning-done')).toBe(true);
    expect(events.some((event) => event.type === 'text')).toBe(true);
    expect(events.some((event) => event.type === 'tool' && event.tool.status === 'completed')).toBe(true);
    expect(events.some((event) => event.type === 'citation')).toBe(true);
    expect(events.at(-1)?.type).toBe('done');
  });

  it('adds an approval gate for deploy-like requests only', async () => {
    const deploy = await collect(streamMock('Deploy to production', { delayMs: 0 }));
    const readOnly = await collect(streamMock('Summarize the docs', { delayMs: 0 }));
    expect(deploy.some((event) => event.type === 'approval')).toBe(true);
    expect(readOnly.some((event) => event.type === 'approval')).toBe(false);
  });
});

describe('applyEvent', () => {
  it('accumulates text and reasoning and closes reasoning', () => {
    let message = createAssistantMessage('m1');
    message = applyEvent(message, { type: 'text', delta: 'Hello' });
    message = applyEvent(message, { type: 'text', delta: ' world' });
    message = applyEvent(message, { type: 'reasoning', delta: 'thinking' });
    message = applyEvent(message, { type: 'reasoning-done' });
    expect(message.text).toBe('Hello world');
    expect(message.reasoning).toBe('thinking');
    expect(message.reasoningStreaming).toBe(false);
    expect(message.status).toBe('streaming');
  });

  it('replaces a tool by id instead of duplicating it', () => {
    let message = createAssistantMessage('m1');
    message = applyEvent(message, {
      type: 'tool',
      tool: { id: 't1', name: 'search', arguments: {}, status: 'running' },
    });
    message = applyEvent(message, {
      type: 'tool',
      tool: { id: 't1', name: 'search', arguments: {}, status: 'completed', result: { ok: true } },
    });
    expect(message.tools).toHaveLength(1);
    expect(message.tools[0].status).toBe('completed');
  });

  it('marks errors and completion', () => {
    const errored = applyEvent(createAssistantMessage('m1'), { type: 'error', message: 'boom' });
    expect(errored.status).toBe('error');
    expect(errored.error).toBe('boom');
    const done = applyEvent(createAssistantMessage('m1'), { type: 'done' });
    expect(done.status).toBe('complete');
  });
});

describe('runChat', () => {
  it('consumes an adapter and returns the final message', async () => {
    async function* fake(): AsyncGenerator<ChatEvent> {
      yield { type: 'text', delta: 'Hi' };
      yield { type: 'done' };
    }
    const seen: string[] = [];
    const final = await runChat(
      { stream: () => fake() },
      [],
      'assistant-1',
      (message) => seen.push(message.text),
    );
    expect(final.text).toBe('Hi');
    expect(final.status).toBe('complete');
    expect(seen).toContain('Hi');
  });

  it('marks partial output complete when aborted', async () => {
    const controller = new AbortController();
    async function* fake(): AsyncGenerator<ChatEvent> {
      yield { type: 'text', delta: 'Partial' };
      controller.abort();
      throw new DOMException('Aborted', 'AbortError');
    }
    const final = await runChat({ stream: () => fake() }, [], 'assistant-2', undefined, controller.signal);
    expect(final.text).toBe('Partial');
    expect(final.status).toBe('complete');
    expect(final.error).toBeUndefined();
  });
});

describe('SSE parser', () => {
  it('parses complete frames and keeps the tail', () => {
    const first = parseSseChunk('data: {"type":"text","delta":"a"}\n\ndata: {"type":"text","delta":"b"}\n\ndata: {"type":"te');
    expect(first.events).toHaveLength(2);
    expect(first.events[0]).toEqual({ type: 'text', delta: 'a' });
    expect(first.rest).toContain('{"type":"te');

    const second = parseSseChunk(`${first.rest}xt","delta":"c"}\n\n`);
    expect(second.events).toEqual([{ type: 'text', delta: 'c' }]);
    expect(second.rest).toBe('');
  });

  it('ignores malformed and DONE frames', () => {
    const parsed = parseSseChunk('data: not-json\n\ndata: [DONE]\n\ndata: {"type":"done"}\n\n');
    expect(parsed.events).toEqual([{ type: 'done' }]);
  });
});
