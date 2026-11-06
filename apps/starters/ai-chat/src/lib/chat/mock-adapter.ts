import type { ChatEvent } from './types';

type MockOptions = {
  delayMs?: number;
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
 * requests) a human approval gate.
 */
export async function* streamMock(prompt: string, options: MockOptions = {}): AsyncGenerator<ChatEvent> {
  const delay = options.delayMs ?? 18;
  const wantsDeploy = /\b(deploy|delete|drop|production)\b/i.test(prompt);

  yield { type: 'reasoning', delta: 'Reading the request. ' };
  await sleep(delay);
  yield { type: 'reasoning', delta: 'Selecting a response shape and checking the component contract.' };
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
      result: { matches: 3, top: 'Slipstream UI manifests and validation' },
    },
  };

  const answer = `This is the mock backend. You asked: "${prompt}". Replace it with your own adapter by setting OPENAI_API_KEY or pointing the SSE adapter at your endpoint. The surface is stateless: streaming, reasoning, tool calls, approvals and citations are all rendered from events.`;
  for (const word of splitWords(answer)) {
    yield { type: 'text', delta: word };
    await sleep(Math.max(4, delay / 2));
  }

  yield {
    type: 'citation',
    citation: {
      id: 'source-1',
      title: 'Slipstream UI manifests',
      url: 'https://slipstreamui.com/docs/ai-manifests',
      snippet: 'Every component ships a machine-readable manifest with props, anti-patterns and accessibility requirements.',
    },
  };

  if (wantsDeploy) {
    yield {
      type: 'approval',
      approval: {
        id: `approval-${Date.now().toString(36)}`,
        title: 'Deploy to production?',
        description: 'The mock agent wants to run a production deployment. Approval is required before the action continues.',
        toolName: 'deploy',
        status: 'pending',
      },
    };
  }

  yield { type: 'done' };
}
