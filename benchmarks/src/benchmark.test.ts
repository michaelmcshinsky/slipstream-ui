import { describe, expect, it } from 'vitest';
import { allCases, assertCaseSet } from './cases';
import { buildPrompt, buildRepairPrompt } from './conditions';
import { MockProvider } from './providers';
import { finalValidation, summarize } from './score';
import type { CaseRun } from './types';
import { validateCode } from './validate';

describe('benchmark case set', () => {
  const cases = allCases();

  it('contains exactly 100 reviewed cases', () => {
    expect(cases).toHaveLength(100);
    expect(() => assertCaseSet(cases)).not.toThrow();
  });

  it('has 30 valid cases and at least 10 of every defect class', () => {
    expect(cases.filter((entry) => entry.expectedValid)).toHaveLength(30);
    const classes = ['unknown-prop', 'invalid-enum', 'missing-required', 'invalid-composition', 'invalid-a11y', 'unsupported-state', 'streaming-state'];
    for (const defectClass of classes) {
      expect(cases.filter((entry) => entry.defectClass === defectClass).length).toBeGreaterThanOrEqual(10);
    }
  });

  it('gives every case a unique id, prompt, candidate and fixed code', () => {
    expect(new Set(cases.map((entry) => entry.id)).size).toBe(cases.length);
    for (const entry of cases) {
      expect(entry.prompt.trim().length).toBeGreaterThan(0);
      expect(entry.candidateCode.trim().length).toBeGreaterThan(0);
      expect(entry.fixedCode.trim().length).toBeGreaterThan(0);
    }
  });
});

describe('validator coverage on generated cases', () => {
  const cases = allCases();

  it('accepts every generated valid usage', async () => {
    const valid = cases.filter((entry) => entry.defectClass === 'none');
    for (const entry of valid) {
      const result = await validateCode(entry.componentId, entry.candidateCode);
      expect(result.valid, `${entry.id}: ${result.issues.map((issue) => issue.message).join(' | ')}`).toBe(true);
    }
  });

  it('rejects every generated unknown-prop, missing-required and invalid-enum case', async () => {
    const generatedDefects = cases.filter((entry) =>
      entry.defectClass === 'unknown-prop' || entry.defectClass === 'missing-required' || entry.defectClass === 'invalid-enum',
    );
    expect(generatedDefects).toHaveLength(30);
    for (const entry of generatedDefects) {
      const result = await validateCode(entry.componentId, entry.candidateCode);
      expect(result.valid, `${entry.id} should be rejected`).toBe(false);
    }
  });

  it('reports the specific defect for representative cases', async () => {
    const unknown = await validateCode('accordion', '<Accordion defaultValue={[]} data-hallucinated="true">x</Accordion>');
    expect(unknown.issues.some((issue) => issue.message.includes('Unknown prop "data-hallucinated"'))).toBe(true);

    const missing = await validateCode('app-shell', '<AppShell>Content</AppShell>');
    expect(missing.issues.some((issue) => issue.message.includes('Missing required prop'))).toBe(true);

    const badEnum = await validateCode('accordion', '<Accordion defaultValue={[]} variant="__invalid__">x</Accordion>');
    expect(badEnum.issues.some((issue) => issue.message.includes('Invalid value "__invalid__"'))).toBe(true);
  });
});

describe('mock provider and repair loop', () => {
  const cases = allCases();
  const provider = new MockProvider(cases);

  it('returns the candidate code, and the fixed code when repairing', async () => {
    const benchmarkCase = cases.find((entry) => entry.id === 'unknown-prop-accordion');
    if (!benchmarkCase) throw new Error('Fixtures missing unknown-prop-accordion');
    const prompt = buildPrompt(benchmarkCase, 'D');
    const initial = await provider.complete({ caseId: benchmarkCase.id, condition: 'D', ...prompt });
    expect(initial.text).toBe(benchmarkCase.candidateCode);
    const repair = buildRepairPrompt(benchmarkCase, 'D', initial.text, ['Unknown prop']);
    const fixed = await provider.complete({ caseId: benchmarkCase.id, condition: 'D', ...repair, repair: true });
    expect(fixed.text).toBe(benchmarkCase.fixedCode);
  });

  it('keeps A/B/C invalid and repairs under D for detectable defects', async () => {
    const fixtureIds = ['valid-accordion', 'unknown-prop-accordion', 'missing-required-app-shell', 'invalid-enum-accordion'];
    const fixtures = fixtureIds.map((id) => {
      const entry = cases.find((candidate) => candidate.id === id);
      if (!entry) throw new Error(`Missing fixture ${id}`);
      return entry;
    });

    for (const entry of fixtures) {
      for (const condition of ['A', 'B', 'C'] as const) {
        const prompt = buildPrompt(entry, condition);
        const response = await provider.complete({ caseId: entry.id, condition, ...prompt });
        const validation = await validateCode(entry.componentId, response.text);
        expect(validation.valid, `${entry.id}/${condition} should not be repaired`).toBe(entry.expectedValid);
      }

      const prompt = buildPrompt(entry, 'D');
      const initial = await provider.complete({ caseId: entry.id, condition: 'D', ...prompt });
      const initialValidation = await validateCode(entry.componentId, initial.text);
      if (initialValidation.valid) {
        expect(entry.expectedValid).toBe(true);
        continue;
      }

      const repair = buildRepairPrompt(entry, 'D', initial.text, initialValidation.issues.map((issue) => issue.message));
      const repaired = await provider.complete({ caseId: entry.id, condition: 'D', ...repair, repair: true });
      const repairedValidation = await validateCode(entry.componentId, repaired.text);
      expect(repairedValidation.valid, `${entry.id}/D should repair`).toBe(true);
    }
  });
});

describe('scoring', () => {
  const base = {
    componentId: 'button',
    provider: 'fixture',
    output: '',
    inputTokens: 0,
    outputTokens: 0,
    latencyMs: 0,
  };

  function run(overrides: Partial<CaseRun>): CaseRun {
    return {
      ...base,
      caseId: 'x',
      defectClass: 'unknown-prop',
      expectedValid: false,
      condition: 'A',
      validation: { valid: false, usageCount: 1, issues: [] },
      repaired: false,
      ...overrides,
    } as CaseRun;
  }

  it('computes recall, precision and false-positive rate from final validation', () => {
    const runs: CaseRun[] = [
      run({ caseId: '1', expectedValid: false, validation: { valid: false, usageCount: 1, issues: [] } }),
      run({ caseId: '2', expectedValid: false, validation: { valid: true, usageCount: 1, issues: [] } }),
      run({ caseId: '3', expectedValid: true, defectClass: 'none', validation: { valid: true, usageCount: 1, issues: [] } }),
      run({ caseId: '4', expectedValid: true, defectClass: 'none', validation: { valid: false, usageCount: 1, issues: [] } }),
    ];
    const summary = summarize(runs);
    expect(summary.recall).toBe(0.5);
    expect(summary.precision).toBe(0.5);
    expect(summary.falsePositiveRate).toBe(0.5);
    expect(summary.detected).toBe(1);
    expect(summary.missed).toBe(1);
  });

  it('uses the repair validation when a repair was attempted', () => {
    const runs: CaseRun[] = [
      run({
        caseId: 'repair',
        repaired: true,
        validation: { valid: false, usageCount: 1, issues: [] },
        repairValidation: { valid: true, usageCount: 1, issues: [] },
      }),
    ];
    expect(finalValidation(runs[0]).valid).toBe(true);
    const summary = summarize(runs);
    expect(summary.recall).toBe(1);
    expect(summary.invalidRate).toBe(0);
    expect(summary.repairSuccessRate).toBe(1);
  });
});
