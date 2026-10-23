'use client';

import { useMemo } from 'react';
import type { Message as MessageData } from '../types';
import { toSlipstreamMessages } from './messages';
import type { AiSdkMessage, AiSdkStatus } from './types';

export interface UseSlipstreamMessagesOptions {
  /** `messages` from the AI SDK's useChat()/useCompletion() state. */
  messages: AiSdkMessage[];
}

export interface UseSlipstreamMessagesResult {
  messages: MessageData[];
}

/**
 * Bridge AI SDK chat messages to Slipstream `<Conversation>`/`<Message>`
 * input. Pure derivation of the current state — safe to call from any
 * runtime that provides the structural message shape (KC-025).
 */
export function useSlipstreamMessages({ messages }: UseSlipstreamMessagesOptions): UseSlipstreamMessagesResult {
  const mapped = useMemo(() => toSlipstreamMessages(messages), [messages]);
  return { messages: mapped };
}

export interface UseSlipstreamStreamOptions {
  /** `status` from the AI SDK chat state. */
  status?: AiSdkStatus;
  /** `error` from the AI SDK chat state. */
  error?: unknown;
  /** Retry handler wired to the SDK's reload/retry (e.g. `reload`). */
  onRetry?: () => void;
  /** Messages from the SDK chat state; used to locate the streaming id. */
  messages?: AiSdkMessage[];
}

export interface UseSlipstreamStreamResult {
  isLoading: boolean;
  streamingMessageId?: string;
  messageErrors?: Record<string, string>;
  onRetryMessage?: (messageId: string) => void;
}

/**
 * Bridge AI SDK stream status/error to Slipstream Conversation props:
 * `isLoading` gates the loading row, `streamingMessageId` drives the typing
 * cursor on the last assistant message, and errors map to retryable
 * per-message failures (KC-025 streaming/tool states).
 */
export function useSlipstreamStream({
  status,
  error,
  onRetry,
  messages = [],
}: UseSlipstreamStreamOptions): UseSlipstreamStreamResult {
  const isLoading = status === 'submitted' || status === 'streaming';
  const streamingMessageId = useMemo(() => {
    if (status !== 'streaming') return undefined;
    for (let index = messages.length - 1; index >= 0; index--) {
      const message = messages[index];
      if (message?.role === 'assistant') return message.id;
    }
    return messages.at(-1)?.id;
  }, [status, messages]);

  const messageErrors = useMemo(() => {
    if (status !== 'error' || !error) return undefined;
    const last = messages.at(-1);
    if (!last) return undefined;
    return {
      [last.id]: error instanceof Error ? error.message : String(error),
    };
  }, [status, error, messages]);

  return {
    isLoading,
    ...(streamingMessageId ? { streamingMessageId } : {}),
    ...(messageErrors ? { messageErrors } : {}),
    ...(onRetry ? { onRetryMessage: onRetry } : {}),
  };
}
