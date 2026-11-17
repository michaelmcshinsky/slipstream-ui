import { describe, expect, it } from 'vitest';
import { recommendComponentsTool } from './recommend-components';

type Recommendation = { id: string; name: string; docs: string; reason: string; score: number };

function payloadOf(result: { content: { type: string; text: string }[] }) {
  return JSON.parse(result.content[0]!.text) as {
    goal: string;
    count: number;
    recommendations: Recommendation[];
    notes: string[];
  };
}

describe('recommend_components tool', () => {
  it('recommends the chat composition for a chat goal', async () => {
    const payload = payloadOf(await recommendComponentsTool.handler({ goal: 'build a chat UI' }));
    const ids = payload.recommendations.map((entry) => entry.id);
    expect(ids).toContain('conversation');
    expect(ids).toContain('prompt-input');
    expect(ids).toContain('response');
    expect(payload.recommendations[0]!.reason.length).toBeGreaterThan(5);
    expect(payload.recommendations[0]!.docs).toMatch(/^https:\/\/slipstreamui\.com\/docs\/components\//);
  });

  it('recommends the table composition for a filterable table goal', async () => {
    const payload = payloadOf(
      await recommendComponentsTool.handler({ goal: 'a sortable table with filters and pagination' })
    );
    const ids = payload.recommendations.map((entry) => entry.id);
    expect(ids).toContain('data-table');
    expect(ids).toContain('filter-bar');
  });

  it('recommends the form composition for a settings form goal', async () => {
    const payload = payloadOf(
      await recommendComponentsTool.handler({ goal: 'settings form with toggles' })
    );
    const ids = payload.recommendations.map((entry) => entry.id);
    expect(ids).toContain('form');
    expect(ids).toContain('switch');
  });

  it('honours the limit and the package filter', async () => {
    const limited = payloadOf(
      await recommendComponentsTool.handler({ goal: 'agent dashboard with tool calls', limit: 3 })
    );
    expect(limited.recommendations).toHaveLength(3);

    const aiOnly = payloadOf(
      await recommendComponentsTool.handler({
        goal: 'agent dashboard with tool calls',
        package: '@slipstream-ui/ai',
      })
    );
    expect(aiOnly.recommendations.every((entry) => entry.id !== 'app-shell')).toBe(true);
  });

  it('falls back to lexical matching for an unlisted goal', async () => {
    const payload = payloadOf(await recommendComponentsTool.handler({ goal: 'timeline of events' }));
    expect(payload.count).toBeGreaterThan(0);
    expect(payload.recommendations.map((entry) => entry.id)).toContain('timeline');
  });

  it('returns no recommendations rather than inventing one', async () => {
    const payload = payloadOf(await recommendComponentsTool.handler({ goal: 'quantum flux capacitor' }));
    expect(payload.count).toBe(0);
    expect(payload.recommendations).toEqual([]);
  });

  it('rejects an empty goal', async () => {
    const result = await recommendComponentsTool.handler({ goal: '   ' });
    expect(result.isError).toBe(true);
  });
});
