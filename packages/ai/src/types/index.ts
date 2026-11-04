/**
 * AI Component Types
 * 
 * Shared types for AI interaction components like Message, Conversation, etc.
 */

export type MessageRole = 'user' | 'assistant' | 'system' | 'tool';

export type Message = {
  id: string;
  role: MessageRole;
  content: string;
  timestamp?: Date;
  metadata?: Record<string, unknown>;
};

export type ToolCall = {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  result?: string | number | boolean | Record<string, unknown> | unknown[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  /** Error detail rendered when status is failed. */
  error?: string;
};

export type ReasoningStep = {
  id: string;
  content: string;
  timestamp?: Date;
};


/** A single citation or reference attached to an AI response. */
export type SourceItem = {
  id: string;
  title: string;
  url?: string;
  snippet?: string;
};
