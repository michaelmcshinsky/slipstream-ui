import { describe, expect, it } from 'vitest';
import { listComponentsTool } from './list-components';

describe('list_components tool', () => {
  it('reports the manifest version with each component', async () => {
    const result = await listComponentsTool.handler({ package: '@slipstream-ui/core' });
    const components = JSON.parse(result.content[0].text) as Array<{ id: string; version?: string }>;
    expect(components.length).toBeGreaterThan(0);
    for (const component of components) {
      expect(component.version, component.id).toMatch(/^\d+\.\d+\.\d+/);
    }
  });

  it('filters by package and tier', async () => {
    const result = await listComponentsTool.handler({ tier: 'atom' });
    const components = JSON.parse(result.content[0].text) as Array<{ tier: string }>;
    expect(components.length).toBeGreaterThan(0);
    expect(components.every((component) => component.tier === 'atom')).toBe(true);
  });
});
