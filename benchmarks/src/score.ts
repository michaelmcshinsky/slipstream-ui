import type { CaseRun, Condition, DefectClass, ValidationResult } from './types';

export type ConditionSummary = {
  condition: Condition;
  runs: number;
  expectedInvalid: number;
  detected: number;
  missed: number;
  falsePositives: number;
  recall: number;
  precision: number;
  invalidRate: number;
};

export type ClassSummary = {
  defectClass: DefectClass;
  total: number;
  detected: number;
  recall: number;
};

export type BenchmarkSummary = {
  provider: string;
  runs: number;
  expectedInvalid: number;
  detected: number;
  missed: number;
  falsePositives: number;
  trueNegatives: number;
  recall: number;
  precision: number;
  falsePositiveRate: number;
  invalidRate: number;
  repaired: number;
  repairSuccessRate: number;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  byCondition: ConditionSummary[];
  byClass: ClassSummary[];
};

export function finalValidation(run: CaseRun): ValidationResult {
  return run.repaired && run.repairValidation ? run.repairValidation : run.validation;
}

function ratio(numerator: number, denominator: number): number {
  return denominator === 0 ? 0 : numerator / denominator;
}

function summarizeCondition(runs: CaseRun[], condition: Condition): ConditionSummary {
  const scoped = runs.filter((run) => run.condition === condition);
  const expectedInvalid = scoped.filter((run) => !run.expectedValid);
  const expectedValid = scoped.filter((run) => run.expectedValid);
  const detected = expectedInvalid.filter((run) => !run.validation.valid).length;
  const falsePositives = expectedValid.filter((run) => !run.validation.valid).length;
  return {
    condition,
    runs: scoped.length,
    expectedInvalid: expectedInvalid.length,
    detected,
    missed: expectedInvalid.length - detected,
    falsePositives,
    recall: ratio(detected, expectedInvalid.length),
    precision: ratio(detected, detected + falsePositives),
    invalidRate: ratio(scoped.filter((run) => !finalValidation(run).valid).length, scoped.length),
  };
}

export function summarize(runs: CaseRun[]): BenchmarkSummary {
  const expectedInvalid = runs.filter((run) => !run.expectedValid);
  const expectedValid = runs.filter((run) => run.expectedValid);
  const detected = expectedInvalid.filter((run) => !run.validation.valid).length;
  const falsePositives = expectedValid.filter((run) => !run.validation.valid).length;
  const trueNegatives = expectedValid.length - falsePositives;
  const repairedRuns = runs.filter((run) => run.repaired);
  const repairSuccess = repairedRuns.filter((run) => finalValidation(run).valid).length;
  const classes: DefectClass[] = [
    'unknown-prop',
    'invalid-enum',
    'missing-required',
    'invalid-composition',
    'invalid-a11y',
    'unsupported-state',
    'streaming-state',
  ];

  return {
    provider: runs[0]?.provider ?? 'unknown',
    runs: runs.length,
    expectedInvalid: expectedInvalid.length,
    detected,
    missed: expectedInvalid.length - detected,
    falsePositives,
    trueNegatives,
    recall: ratio(detected, expectedInvalid.length),
    precision: ratio(detected, detected + falsePositives),
    falsePositiveRate: ratio(falsePositives, expectedValid.length),
    invalidRate: ratio(runs.filter((run) => !finalValidation(run).valid).length, runs.length),
    repaired: repairedRuns.length,
    repairSuccessRate: ratio(repairSuccess, repairedRuns.length),
    inputTokens: runs.reduce((sum, run) => sum + run.inputTokens, 0),
    outputTokens: runs.reduce((sum, run) => sum + run.outputTokens, 0),
    latencyMs: runs.reduce((sum, run) => sum + run.latencyMs, 0),
    byCondition: (['A', 'B', 'C', 'D'] as Condition[]).map((condition) => summarizeCondition(runs, condition)),
    byClass: classes.map((defectClass) => {
      const scoped = expectedInvalid.filter((run) => run.defectClass === defectClass);
      const caught = scoped.filter((run) => !run.validation.valid).length;
      return { defectClass, total: scoped.length, detected: caught, recall: ratio(caught, scoped.length) };
    }),
  };
}

function pct(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function summaryToMarkdown(summary: BenchmarkSummary): string {
  const lines: string[] = [
    '# Slipstream UI validation benchmark',
    '',
    `Provider: **${summary.provider}**`,
    `Runs: **${summary.runs}** (${summary.expectedInvalid} expected-invalid, ${summary.runs - summary.expectedInvalid} expected-valid)`,
    `Repairs attempted: **${summary.repaired}**`,
    '',
    '## Headline',
    '',
    '| Metric | Value |',
    '|---|---|',
    `| Recall (defects caught before repair) | ${pct(summary.recall)} |`,
    `| Precision | ${pct(summary.precision)} |`,
    `| False-positive rate | ${pct(summary.falsePositiveRate)} |`,
    `| Invalid-output rate (validator-flagged, post-repair) | ${pct(summary.invalidRate)} |`,
    `| Repair success | ${pct(summary.repairSuccessRate)} (${summary.repaired} attempted) |`,
    `| Detected / missed | ${summary.detected} / ${summary.missed} |`,
    `| Tokens (in / out) | ${summary.inputTokens} / ${summary.outputTokens} |`,
    '',
    '## By condition',
    '',
    '| Condition | Runs | Recall (pre-repair) | Precision | Validator-flagged (post-repair) |',
    '|---|---|---|---|---|',
    ...summary.byCondition.map(
      (entry) => `| ${entry.condition} | ${entry.runs} | ${pct(entry.recall)} | ${pct(entry.precision)} | ${pct(entry.invalidRate)} |`,
    ),
    '',
    '## By defect class',
    '',
    '| Class | Cases | Detected | Recall |',
    '|---|---|---|---|',
    ...summary.byClass.map((entry) => `| ${entry.defectClass} | ${entry.total} | ${entry.detected} | ${pct(entry.recall)} |`),
    '',
    '## Limitations',
    '',
    '- A validator-clean output is not proof of semantic correctness. The benchmark measures the validator, not a human judge; classes the validator does not model (accessibility, state, streaming) can pass while remaining defective.',
    '- The validator currently checks prop existence, required props, enum values, and missing root usage. It does not model accessibility, state-machine contradictions, or streaming semantics; low recall in those classes is expected and is the product gap the benchmark exists to expose.',
    '- `inject` conditions A-C use static context (docs, source, manifest). Condition D adds a validation-and-repair step.',
    '- Scores are only comparable within the same case set, provider and model version.',
    '',
  ];
  return `${lines.join('\n')}\n`;
}
