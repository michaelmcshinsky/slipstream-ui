import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import {
  toSlipstreamMessage,
  toSlipstreamMessages,
  toSlipstreamToolCall,
  toSlipstreamToolCalls,
  useSlipstreamMessages,
  useSlipstreamStream,
} from './index';
import type { AiSdkMessage } from './index';

describe('AI SDK adapter (KC-025)', () => {
  const assistantWithTools: AiSdkMessage = {
    id: 'msg-1',
    role: 'assistant',
    content: 'Let me look that up.',
    toolInvocations: [
      { toolCallId: 'call-1', toolName: 'search', args: { q: 'react' }, state: 'call' },
      { toolCallId: 'call-2', toolName: 'fetch', args: { url: '/x' }, state: 'result', result: { ok: true } },
      { toolCallId: 'call-3', toolName: 'boom', args: {}, state: 'error', error: new Error('tool exploded') },
    ],
  };

  it('maps roles and content onto Slipstream messages', () => {
    const mapped = toSlipstreamMessage({ id: 'm', role: 'user', content: 'hi' });
    expect(mapped).toEqual({ id: 'm', role: 'user', content: 'hi' });
  });

  it('maps tool invocation states onto ToolCall statuses', () => {
    const calls = toSlipstreamToolCalls(assistantWithTools);
    expect(calls.map((call) => call.status)).toEqual(['pending', 'completed', 'failed']);
    expect(calls[1]).toMatchObject({ result: { ok: true } });
    expect(calls[2]).toMatchObject({ error: 'tool exploded' });
  });

  it('preserves tool calls in message metadata for Message components', () => {
    const mapped = toSlipstreamMessage(assistantWithTools);
    expect(mapped.metadata?.toolCalls).toHaveLength(3);
  });

  it('maps lists and keeps ids stable', () => {
    const mapped = toSlipstreamMessages([
      { id: 'a', role: 'user', content: 'q' },
      assistantWithTools,
    ]);
    expect(mapped.map((message) => message.id)).toEqual(['a', 'msg-1']);
  });

  it('useSlipstreamMessages derives the current message list', () => {
    const { result } = renderHook(() => useSlipstreamMessages({ messages: [{ id: 'a', role: 'user', content: 'q' }] }));
    expect(result.current.messages).toHaveLength(1);
  });

  it('useSlipstreamStream exposes loading, streaming id, errors and retry', () => {
    const streaming = renderHook(() =>
      useSlipstreamStream({ status: 'streaming', messages: [{ id: 'a', role: 'user', content: 'q' }, assistantWithTools] }),
    );
    expect(streaming.result.current.isLoading).toBe(true);
    expect(streaming.result.current.streamingMessageId).toBe('msg-1');

    const failed = renderHook(() =>
      useSlipstreamStream({
        status: 'error',
        error: new Error('network down'),
        messages: [assistantWithTools],
        onRetry: () => undefined,
      }),
    );
    expect(failed.result.current.isLoading).toBe(false);
    expect(failed.result.current.messageErrors).toEqual({ 'msg-1': 'network down' });
    expect(failed.result.current.onRetryMessage).toBeTypeOf('function');

    const ready = renderHook(() => useSlipstreamStream({ status: 'ready', messages: [] }));
    expect(ready.result.current.isLoading).toBe(false);
    expect(ready.result.current.streamingMessageId).toBeUndefined();
    expect(ready.result.current.messageErrors).toBeUndefined();
  });

  it('toSlipstreamToolCall tolerates missing args', () => {
    expect(toSlipstreamToolCall({ toolCallId: 'c', toolName: 't' })).toMatchObject({ arguments: {}, status: 'pending' });
  });
});
