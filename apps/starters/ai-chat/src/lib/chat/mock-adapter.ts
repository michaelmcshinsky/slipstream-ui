import { DEFAULT_LOCALE, getMessages, translate, type Locale } from '@slipstream-ui/i18n';
import type { ChatEvent } from './types';

type MockOptions = {
  delayMs?: number;
  locale?: Locale;
};

function splitWords(text: string): string[] {
  return text.match(/\S+\s*/g) ?? [text];
}

function sleep(ms: number): Promise<void> {
  return ms <= 0 ? Promise.resolve() : new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Deterministic SSE source used when no provider key is configured.
 * Emits reasoning, streamed text, a tool call, a citation, and (for deploy
 * requests) a human approval gate. Strings are localized via the same catalog
 * as the client.
 */
export async function* streamMock(prompt: string, options: MockOptions = {}): AsyncGenerator<ChatEvent> {
  const delay = options.delayMs ?? 18;
  const locale = options.locale ?? DEFAULT_LOCALE;
  const messages = getMessages(locale);
  const wantsDeploy = /\b(deploy|delete|drop|production)\b/i.test(prompt);

  yield { type: 'reasoning', delta: translate(messages, 'mock.reasoning1') };
  await sleep(delay);
  yield { type: 'reasoning', delta: translate(messages, 'mock.reasoning2') };
  await sleep(delay);
  yield { type: 'reasoning-done' };

  const toolId = `tool-${Date.now().toString(36)}`;
  yield {
    type: 'tool',
    tool: { id: toolId, name: 'search_docs', arguments: { query: prompt.slice(0, 80) }, status: 'running' },
  };
  await sleep(delay);
  yield {
    type: 'tool',
    tool: {
      id: toolId,
      name: 'search_docs',
      arguments: { query: prompt.slice(0, 80) },
      status: 'completed',
      result: { matches: 3, top: translate(messages, 'mock.toolResult') },
    },
  };

  const answer = translate(messages, 'mock.answer', { prompt });
  for (const word of splitWords(answer)) {
    yield { type: 'text', delta: word };
    await sleep(Math.max(4, delay / 2));
  }

  yield {
    type: 'citation',
    citation: {
      id: 'source-1',
      title: translate(messages, 'mock.citationTitle'),
      url: 'https://slipstreamui.com/docs/ai-manifests',
      snippet: translate(messages, 'mock.citationSnippet'),
    },
  };

  if (wantsDeploy) {
    yield {
      type: 'approval',
      approval: {
        id: `approval-${Date.now().toString(36)}`,
        title: translate(messages, 'mock.approvalTitle'),
        description: translate(messages, 'mock.approvalDescription'),
        toolName: 'deploy',
        status: 'pending',
      },
    };
  }

  yield { type: 'done' };
}
