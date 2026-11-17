import { describe, expect, it } from 'vitest';
import { COMPONENT_COUNT } from './component-count';
import { buildAccessibilityScorecard } from './a11y-scorecard';

const { rows, summary } = buildAccessibilityScorecard();

describe('accessibility scorecard', () => {
  it('covers every component in the manifests', () => {
    expect(rows).toHaveLength(COMPONENT_COUNT);
    expect(new Set(rows.map((row) => row.id)).size).toBe(COMPONENT_COUNT);
  });

  it('fails if any component lacks an axe assertion', () => {
    const missing = rows.filter((row) => !row.axe).map((row) => row.id);
    expect(missing).toEqual([]);
    expect(summary.withAxe).toBe(COMPONENT_COUNT);
  });

  it('reports manifest accessibility requirements for every component', () => {
    const missing = rows.filter((row) => row.notes === 0).map((row) => row.id);
    expect(missing).toEqual([]);
    expect(summary.withNotes).toBe(COMPONENT_COUNT);
    expect(summary.totalNotes).toBeGreaterThan(COMPONENT_COUNT);
  });

  it('links every row to human docs and the canonical manifest', () => {
    for (const row of rows) {
      expect(row.docs).toMatch(/^\/docs\/components\/[a-z0-9-]+$/);
      expect(row.manifest).toMatch(/^\/llm\/components\/[a-z0-9-]+\.md$/);
      expect(['@slipstream-ui/core', '@slipstream-ui/ai']).toContain(row.package);
    }
  });

  it('counts interaction tests without pretending they cover every component', () => {
    expect(summary.withInteraction).toBeGreaterThan(0);
    expect(summary.withInteraction).toBeLessThanOrEqual(COMPONENT_COUNT);
  });
});
