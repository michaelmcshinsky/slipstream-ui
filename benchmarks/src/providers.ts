import type { BenchmarkCase, ModelProvider, ProviderRequest, ProviderResponse } from './types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export class MockProvider implements ModelProvider {
  readonly name = 'mock';
  private readonly byId: Map<string, BenchmarkCase>;

  constructor(cases: BenchmarkCase[]) {
    this.byId = new Map(cases.map((entry) => [entry.id, entry]));
  }

  async complete(request: ProviderRequest): Promise<ProviderResponse> {
    const benchmarkCase = this.byId.get(request.caseId);
    if (!benchmarkCase) throw new Error(`MockProvider: unknown case ${request.caseId}`);
    const text = request.repair ? benchmarkCase.fixedCode : benchmarkCase.candidateCode;
    return {
      text,
      inputTokens: estimateTokens(`${request.system}\n${request.user}`),
      outputTokens: estimateTokens(text),
      latencyMs: 0,
    };
  }
}

type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string };

async function postJson(url: string, headers: Record<string, string>, body: unknown): Promise<unknown> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`${url} -> HTTP ${response.status}: ${text.slice(0, 400)}`);
  return JSON.parse(text) as unknown;
}

export class OpenAIProvider implements ModelProvider {
  readonly name: string;
  private readonly model: string;
  private readonly apiKey: string;

  constructor(model = process.env.OPENAI_MODEL ?? 'gpt-4.1-mini') {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error('OPENAI_API_KEY is required for the openai provider.');
    this.apiKey = key;
    this.model = model;
    this.name = `openai:${model}`;
  }

  async complete(request: ProviderRequest): Promise<ProviderResponse> {
    const started = Date.now();
    const messages: ChatMessage[] = [
      { role: 'system', content: request.system },
      { role: 'user', content: request.user },
    ];
    const payload = await postJson(
      'https://api.openai.com/v1/chat/completions',
      { authorization: `Bearer ${this.apiKey}` },
      { model: this.model, messages, temperature: 0 },
    );
    if (!isRecord(payload) || !Array.isArray(payload.choices)) throw new Error('OpenAI: unexpected response shape');
    const first = payload.choices[0];
    if (!isRecord(first) || !isRecord(first.message) || typeof first.message.content !== 'string') {
      throw new Error('OpenAI: missing message content');
    }
    const usage = isRecord(payload.usage) ? payload.usage : {};
    return {
      text: first.message.content,
      inputTokens: typeof usage.prompt_tokens === 'number' ? usage.prompt_tokens : 0,
      outputTokens: typeof usage.completion_tokens === 'number' ? usage.completion_tokens : 0,
      latencyMs: Date.now() - started,
    };
  }
}

export class AnthropicProvider implements ModelProvider {
  readonly name: string;
  private readonly model: string;
  private readonly apiKey: string;

  constructor(model = process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-5') {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) throw new Error('ANTHROPIC_API_KEY is required for the anthropic provider.');
    this.apiKey = key;
    this.model = model;
    this.name = `anthropic:${model}`;
  }

  async complete(request: ProviderRequest): Promise<ProviderResponse> {
    const started = Date.now();
    const payload = await postJson(
      'https://api.anthropic.com/v1/messages',
      { 'x-api-key': this.apiKey, 'anthropic-version': '2023-06-01' },
      {
        model: this.model,
        max_tokens: 2048,
        temperature: 0,
        system: request.system,
        messages: [{ role: 'user', content: request.user }],
      },
    );
    if (!isRecord(payload) || !Array.isArray(payload.content)) throw new Error('Anthropic: unexpected response shape');
    const text = payload.content
      .filter(isRecord)
      .filter((block) => block.type === 'text' && typeof block.text === 'string')
      .map((block) => String(block.text))
      .join('\n');
    if (!text) throw new Error('Anthropic: missing text content');
    const usage = isRecord(payload.usage) ? payload.usage : {};
    return {
      text,
      inputTokens: typeof usage.input_tokens === 'number' ? usage.input_tokens : 0,
      outputTokens: typeof usage.output_tokens === 'number' ? usage.output_tokens : 0,
      latencyMs: Date.now() - started,
    };
  }
}

export function createProvider(name: string, cases: BenchmarkCase[]): ModelProvider {
  if (name === 'mock') return new MockProvider(cases);
  if (name === 'openai') return new OpenAIProvider();
  if (name === 'anthropic') return new AnthropicProvider();
  throw new Error(`Unknown provider "${name}". Use mock, openai or anthropic.`);
}
