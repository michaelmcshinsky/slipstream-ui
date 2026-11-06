import fs from 'node:fs';
import path from 'node:path';
import { allCases, assertCaseSet } from './cases';
import { buildPrompt, buildRepairPrompt } from './conditions';
import { createProvider } from './providers';
import { summarize, summaryToMarkdown } from './score';
import type { CaseRun, Condition, ValidationResult } from './types';
import { REPO_ROOT } from './manifests';
import { validateCode } from './validate';

const CONDITIONS: Condition[] = ['A', 'B', 'C', 'D'];

function arg(name: string, fallback: string): string {
  const index = process.argv.indexOf(name);
  if (index === -1) return fallback;
  const value = process.argv[index + 1];
  return value && !value.startsWith('--') ? value : fallback;
}

function safeName(value: string): string {
  return value.replace(/[^A-Za-z0-9._-]+/g, '-');
}

async function main(): Promise<void> {
  const providerName = arg('--provider', 'mock');
  const conditionArg = arg('--condition', 'all');
  const limit = Number.parseInt(arg('--limit', '0'), 10);
  const outDir = path.join(REPO_ROOT, 'benchmarks', 'results');

  if (conditionArg !== 'all' && !CONDITIONS.includes(conditionArg as Condition)) {
    throw new Error(`Unknown condition "${conditionArg}". Use A, B, C, D or all.`);
  }
  const conditions = conditionArg === 'all' ? CONDITIONS : [conditionArg as Condition];

  const cases = allCases();
  assertCaseSet(cases);
  const selected = limit > 0 ? cases.slice(0, limit) : cases;
  const provider = createProvider(providerName, cases);

  const runs: CaseRun[] = [];
  for (const benchmarkCase of selected) {
    for (const condition of conditions) {
      const prompt = buildPrompt(benchmarkCase, condition);
      const base = {
        caseId: benchmarkCase.id,
        componentId: benchmarkCase.componentId,
        defectClass: benchmarkCase.defectClass,
        expectedValid: benchmarkCase.expectedValid,
        condition,
        provider: provider.name,
      };

      try {
        const response = await provider.complete({ caseId: benchmarkCase.id, condition, ...prompt });
        const validation = await validateCodeSafe(benchmarkCase.componentId, response.text);
        let repaired = false;
        let repairValidation: CaseRun['repairValidation'];
        let output = response.text;
        let inputTokens = response.inputTokens;
        let outputTokens = response.outputTokens;
        let latencyMs = response.latencyMs;

        if (condition === 'D' && !validation.valid) {
          const repair = buildRepairPrompt(benchmarkCase, condition, response.text, validation.issues.map((issue) => issue.message));
          const repairedResponse = await provider.complete({
            caseId: benchmarkCase.id,
            condition,
            ...repair,
            repair: true,
          });
          repairValidation = await validateCodeSafe(benchmarkCase.componentId, repairedResponse.text);
          repaired = true;
          output = repairedResponse.text;
          inputTokens += repairedResponse.inputTokens;
          outputTokens += repairedResponse.outputTokens;
          latencyMs += repairedResponse.latencyMs;
        }

        runs.push({
          ...base,
          output,
          initialOutput: repaired ? response.text : undefined,
          validation,
          repaired,
          repairValidation,
          inputTokens,
          outputTokens,
          latencyMs,
        });
      } catch (error) {
        runs.push({
          ...base,
          output: '',
          validation: { valid: false, usageCount: 0, issues: [] },
          repaired: false,
          inputTokens: 0,
          outputTokens: 0,
          latencyMs: 0,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  const summary = summarize(runs);
  fs.mkdirSync(outDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const stem = `${safeName(provider.name)}-${stamp}`;
  fs.writeFileSync(path.join(outDir, `${stem}.json`), `${JSON.stringify({ summary, runs }, null, 2)}\n`);
  fs.writeFileSync(path.join(outDir, `${stem}.md`), summaryToMarkdown(summary));

  console.log(summaryToMarkdown(summary));
  console.log(`Results: benchmarks/results/${stem}.json`);

  const failedRuns = runs.filter((run) => run.error);
  if (failedRuns.length > 0) {
    console.error(`${failedRuns.length} run(s) failed; see the JSON for details.`);
    process.exitCode = 1;
  }
}

async function validateCodeSafe(componentId: string, code: string): Promise<ValidationResult> {
  if (!code.trim()) return { valid: false, usageCount: 0, issues: [{ severity: 'error', message: 'Empty output.' }] };
  return validateCode(componentId, code);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
