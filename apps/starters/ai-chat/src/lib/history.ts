import type { ChatMessage } from './chat/types';

const STORAGE_KEY = 'slipstream-ai-chat-history-v1';
const MAX_MESSAGES = 50;

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isMessage(value: unknown): value is ChatMessage {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    (value.role === 'user' || value.role === 'assistant' || value.role === 'system') &&
    typeof value.text === 'string' &&
    Array.isArray(value.tools) &&
    Array.isArray(value.citations)
  );
}

export function loadHistory(storage: StorageLike): ChatMessage[] {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isMessage).slice(-MAX_MESSAGES);
  } catch {
    return [];
  }
}

export function saveHistory(storage: StorageLike, messages: ChatMessage[]): void {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_MESSAGES)));
  } catch {
    // Storage can be full or blocked (private mode). Rendering must not fail.
  }
}

export function clearHistory(storage: StorageLike): void {
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore blocked storage.
  }
}
