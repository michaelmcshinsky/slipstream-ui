import type { Message as MessageData, ToolCall as ToolCallData } from '../types';
import type { AiSdkMessage, AiSdkToolInvocation } from './types';

/** Map one AI SDK tool invocation to a Slipstream ToolCall data object. */
export function toSlipstreamToolCall(invocation: AiSdkToolInvocation): ToolCallData {
  const status =
    invocation.state === 'result' ? 'completed'
    : invocation.state === 'error' ? 'failed'
    : invocation.state === 'call' ? 'pending'
    : 'pending';
  return {
    id: invocation.toolCallId,
    name: invocation.toolName,
    arguments: invocation.args ?? {},
    status,
    ...(status === 'completed' && invocation.result !== undefined
      ? { result: invocation.result as ToolCallData['result'] }
      : {}),
    ...(status === 'failed'
      ? { error: invocation.error instanceof Error ? invocation.error.message : String(invocation.error ?? 'Tool call failed') }
      : {}),
  };
}

/** Extract every tool call carried by an AI SDK message. */
export function toSlipstreamToolCalls(message: AiSdkMessage): ToolCallData[] {
  return (message.toolInvocations ?? []).map(toSlipstreamToolCall);
}

/**
 * Map one AI SDK message onto a Slipstream Message. Tool invocations are
 * preserved under `metadata.toolCalls` (and via toSlipstreamToolCalls) so
 * ToolCall components can render them.
 */
export function toSlipstreamMessage(message: AiSdkMessage): MessageData {
  return {
    id: message.id,
    role: message.role,
    content: message.content,
    ...(message.toolInvocations?.length
      ? { metadata: { toolCalls: toSlipstreamToolCalls(message) } }
      : {}),
  };
}

/** Map a useChat/useCompletion message list into Slipstream messages. */
export function toSlipstreamMessages(messages: AiSdkMessage[]): MessageData[] {
  return messages.map(toSlipstreamMessage);
}
