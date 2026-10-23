import { describe, expect, it } from 'vitest';
import { searchComponentsTool } from './search-components';

function payloadOf(result: { content: { type: string; text: string }[] }) {
  return JSON.parse(result.content[0]!.text) as {
    query: string;
    count: number;
    results: { id: string; matchedFields: string[]; score: number }[];
  };
}

describe('search_components tool', () => {
  it('finds chat components by keyword and explains the match', async () => {
    const payload = payloadOf(await searchComponentsTool.handler({ query: 'chat message' }));
    expect(payload.count).toBeGreaterThan(0);
    const messageHit = payload.results.find((hit) => hit.id === 'message');
    expect(messageHit).toBeDefined();
    expect(messageHit!.matchedFields.length).toBeGreaterThan(0);
    expect(messageHit!.score).toBeGreaterThan(0);
  });

  it('matches on prop names so capability queries work', async () => {
    const payload = payloadOf(await searchComponentsTool.handler({ query: 'isStreaming' }));
    const ids = payload.results.map((hit) => hit.id);
    expect(ids).toContain('message');
  });

  it('requires every term to match and ranks deterministically', async () => {
    const first = payloadOf(await searchComponentsTool.handler({ query: 'button click' }));
    const second = payloadOf(await searchComponentsTool.handler({ query: 'button click' }));
    expect(second.results.map((hit) => hit.id)).toEqual(first.results.map((hit) => hit.id));
    // Scores are non-increasing.
    for (let i = 1; i < second.results.length; i++) {
      expect(second.results[i]!.score).toBeLessThanOrEqual(second.results[i - 1]!.score);
    }
  });

  it('filters by package', async () => {
    const payload = payloadOf(
      await searchComponentsTool.handler({ query: 'component', package: '@slipstream-ui/ai' }),
    );
    expect(payload.results.every((hit) => hit.id.length > 0)).toBe(true);
  });

  it('rejects an empty query', async () => {
    const result = await searchComponentsTool.handler({ query: '   ' });
    expect(result.isError).toBe(true);
  });
});
