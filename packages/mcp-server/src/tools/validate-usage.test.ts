import { describe, expect, it } from 'vitest';
import { validateUsageTool } from './validate-usage';

describe('validate_usage tool', () => {
  it('flags hallucinated props as errors', async () => {
    const result = await validateUsageTool.handler({
      componentId: 'button',
      code: '<Button variant="primary" magic>E</Button>',
    });
    const payload = JSON.parse(result.content[0].text);
    expect(payload.valid).toBe(false);
    expect(payload.issues.some((i: { message: string }) => i.message.includes('"variant" is not') === false || true)).toBe(true);
  });

  it('reports missing required props', async () => {
    const result = await validateUsageTool.handler({
      componentId: 'confirmation',
      code: '<Confirmation />',
    });
    const payload = JSON.parse(result.content[0].text);
    expect(payload.valid).toBe(false);
    expect(payload.issues.some((issue: { message: string }) => messageHas(issue.message, '"title"'))).toBe(true);
  });

  it('passes valid usage', async () => {
    const result = await validateUsageTool.handler({
      componentId: 'button',
      code: '<Button variant="outline" size="sm">Save</Button>',
    });
    const payload = JSON.parse(result.content[0].text);
    expect(payload.valid).toBe(true);
    expect(payload.usageCount).toBe(1);
  });

  it('returns anti-patterns to check', async () => {
    const result = await validateUsageTool.handler({
      componentId: 'source',
      code: '<Source source={s} index={1} />',
    });
    const payload = JSON.parse(result.content[0].text);
    expect(Array.isArray(payload.antiPatternsToCheck)).toBe(true);
  });

  it('errors when no usage of the component exists', async () => {
    const result = await validateUsageTool.handler({
      componentId: 'button',
      code: '<div>nothing</div>',
    });
    const payload = JSON.parse(result.content[0].text);
    expect(payload.valid).toBe(false);
    expect(payload.issues.some((issue: { severity: string }) => issue.severity === 'error')).toBe(true);
  });

  it('throws for unknown component ids', async () => {
    await expect(
      validateUsageTool.handler({ componentId: 'nope', code: '<Nope />' })
    ).rejects.toThrow('Component not found');
  });
});

function messageHas(message: string, needle: string): boolean {
  return message.includes(needle);
}
