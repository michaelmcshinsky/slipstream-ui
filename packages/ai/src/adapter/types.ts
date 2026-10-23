/**
 * Structural types mirroring the parts of the Vercel AI SDK's chat state the
 * adapter consumes. Declared locally (instead of importing the SDK) so the
 * adapter stays runtime-independent: any chat library that produces this
 * shape can be bridged, and consumers install the SDK themselves (KC-025).
 */
export interface AiSdkToolInvocation {
  toolCallId: string;
  toolName: string;
  args?: Record<string, unknown>;
  /** AI SDK states: 'call' (pending), 'result' (completed), 'error'. */
  state?: string;
  result?: unknown;
  error?: unknown;
}

export interface AiSdkMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  toolInvocations?: AiSdkToolInvocation[];
}

export type AiSdkStatus = string;
