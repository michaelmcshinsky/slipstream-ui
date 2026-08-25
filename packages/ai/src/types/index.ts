/**
 * AI Component Types
 * 
 * Shared types for AI interaction components like Message, Conversation, etc.
 */

export type MessageRole = 'user' | 'assistant' | 'system' | 'tool';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp?: Date;
  metadata?: Record<string, unknown>;
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  result?: string | number | boolean | Record<string, unknown> | unknown[];
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export interface ReasoningStep {
  id: string;
  content: string;
  timestamp?: Date;
}

export interface StreamingStatus {
  isStreaming: boolean;
  progress?: number;
}

/** A single citation or reference attached to an AI response. */
export interface SourceItem {
  id: string;
  title: string;
  url?: string;
  snippet?: string;
}
