export type ChatRole = 'user' | 'assistant' | 'system';

export type ChatToolStatus = 'pending' | 'running' | 'completed' | 'failed';

export type ChatTool = {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  result?: string | number | boolean | Record<string, unknown> | unknown[];
  status: ChatToolStatus;
  error?: string;
};

export type ChatCitation = {
  id: string;
  title: string;
  url?: string;
  snippet?: string;
};

export type ChatApproval = {
  id: string;
  title: string;
  description?: string;
  toolName?: string;
  status: 'pending' | 'approved' | 'rejected';
};

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  reasoning: string;
  reasoningStreaming: boolean;
  tools: ChatTool[];
  citations: ChatCitation[];
  approval?: ChatApproval;
  status: 'streaming' | 'complete' | 'error';
  error?: string;
};

export type ChatEvent =
  | { type: 'text'; delta: string }
  | { type: 'reasoning'; delta: string }
  | { type: 'reasoning-done' }
  | { type: 'tool'; tool: ChatTool }
  | { type: 'citation'; citation: ChatCitation }
  | { type: 'approval'; approval: ChatApproval }
  | { type: 'done' }
  | { type: 'error'; message: string };

export type ChatAdapter = {
  name: string;
  stream(messages: ChatMessage[], signal?: AbortSignal): AsyncGenerator<ChatEvent>;
};

export function createAssistantMessage(id: string): ChatMessage {
  return {
    id,
    role: 'assistant',
    text: '',
    reasoning: '',
    reasoningStreaming: false,
    tools: [],
    citations: [],
    status: 'streaming',
  };
}
