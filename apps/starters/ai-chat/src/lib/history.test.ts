import { describe, expect, it } from 'vitest';
import { clearHistory, loadHistory, saveHistory } from './history';
import type { ChatMessage } from './chat/types';

function memoryStorage(seed?: string) {
  const map = new Map<string, string>();
  if (seed !== undefined) map.set('slipstream-ai-chat-history-v1', seed);
  return {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => void map.set(key, value),
    removeItem: (key: string) => void map.delete(key),
  };
}

const message: ChatMessage = {
  id: 'm1',
  role: 'user',
  text: 'Hello',
  reasoning: '',
  reasoningStreaming: false,
  tools: [],
  citations: [],
  status: 'complete',
};

describe('conversation history', () => {
  it('round-trips messages', () => {
    const storage = memoryStorage();
    saveHistory(storage, [message]);
    expect(loadHistory(storage)).toEqual([message]);
  });

  it('returns an empty list for malformed JSON or non-arrays', () => {
    expect(loadHistory(memoryStorage('{not json'))).toEqual([]);
    expect(loadHistory(memoryStorage('{"messages":[]}'))).toEqual([]);
  });

  it('drops malformed entries and caps the transcript', () => {
    const many = Array.from({ length: 60 }, (_, index) => ({ ...message, id: `m${index}` }));
    const storage = memoryStorage();
    saveHistory(storage, many);
    const loaded = loadHistory(storage);
    expect(loaded).toHaveLength(50);
    expect(loaded[0].id).toBe('m10');
    expect(loaded.at(-1)?.id).toBe('m59');
  });

  it('clears the transcript', () => {
    const storage = memoryStorage();
    saveHistory(storage, [message]);
    clearHistory(storage);
    expect(loadHistory(storage)).toEqual([]);
  });

  it('does not throw when storage is blocked', () => {
    const blocked = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
      removeItem: () => {
        throw new Error('blocked');
      },
    };
    expect(loadHistory(blocked)).toEqual([]);
    expect(() => saveHistory(blocked, [message])).not.toThrow();
    expect(() => clearHistory(blocked)).not.toThrow();
  });
});
