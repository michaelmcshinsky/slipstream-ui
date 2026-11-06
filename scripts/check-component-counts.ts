#!/usr/bin/env node
/**
 * Fails when a published component count disagrees with the manifests.
 *
 * The manifests in `packages/<pkg>/src/manifests` are the source of truth.
 * `scripts/generate-llm-docs.ts` derives the public counts from them, but
 * nothing currently stops a hand-edited or stale value from being committed.
 * This check runs in CI after generation and compares every published surface:
 *
 * - `apps/docs/lib/component-count.ts` (generated module)
 * - `README.md` generated stats block
 * - `apps/docs/public/llms.txt`
 * - `apps/docs/public/llm/index.md`
 *
 * Exits non-zero with a per-surface diff.
 */

import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '..');

const PACKAGES = [
  { name: 'core', dir: path.join(ROOT, 'packages', 'core') },
  { name: 'ai', dir: path.join(ROOT, 'packages', 'ai') },
] as const;

type Counts = {
  core: number;
  ai: number;
  total: number;
};

type Failure = {
  surface: string;
  expected: string;
  actual: string;
};

function countManifests(packageDir: string): number {
  const manifestDir = path.join(packageDir, 'src', 'manifests');
  if (!fs.existsSync(manifestDir)) return 0;
  return fs.readdirSync(manifestDir).filter((file) => file.endsWith('.manifest.json')).length;
}

function readRequired(filePath: string): string {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Expected file not found: ${path.relative(ROOT, filePath)}`);
  }
  return fs.readFileSync(filePath, 'utf8');
}

function matchNumber(source: string, pattern: RegExp, surface: string): number {
  const match = pattern.exec(source);
  if (!match) {
    throw new Error(`${surface} does not contain the expected count pattern ${pattern}`);
  }
  return Number.parseInt(match[1], 10);
}

function readCounts(): Counts {
  const core = countManifests(PACKAGES[0].dir);
  const ai = countManifests(PACKAGES[1].dir);
  return { core, ai, total: core + ai };
}

function check(actual: Counts): Failure[] {
  const failures: Failure[] = [];

  const countModulePath = path.join(ROOT, 'apps', 'docs', 'lib', 'component-count.ts');
  const countModule = readRequired(countModulePath);
  const moduleTotal = matchNumber(countModule, /\bCOMPONENT_COUNT\s*=\s*(\d+)/, countModulePath);
  const moduleCore = matchNumber(countModule, /\bCORE_COMPONENT_COUNT\s*=\s*(\d+)/, countModulePath);
  const moduleAi = matchNumber(countModule, /\bAI_COMPONENT_COUNT\s*=\s*(\d+)/, countModulePath);

  if (moduleTotal !== actual.total) {
    failures.push({ surface: 'apps/docs/lib/component-count.ts (total)', expected: String(actual.total), actual: String(moduleTotal) });
  }
  if (moduleCore !== actual.core) {
    failures.push({ surface: 'apps/docs/lib/component-count.ts (core)', expected: String(actual.core), actual: String(moduleCore) });
  }
  if (moduleAi !== actual.ai) {
    failures.push({ surface: 'apps/docs/lib/component-count.ts (ai)', expected: String(actual.ai), actual: String(moduleAi) });
  }

  const readme = readRequired(path.join(ROOT, 'README.md'));
  const statsBlock = /<!-- generated:stats:start -->([\s\S]*?)<!-- generated:stats:end -->/.exec(readme);
  if (!statsBlock) {
    failures.push({ surface: 'README.md', expected: 'generated:stats block', actual: 'missing' });
  } else {
    const numbers = [...statsBlock[1].matchAll(/(\d+)\s+(?:components|machine-readable)/g)].map((m) => Number.parseInt(m[1], 10));
    if (numbers.length < 2 || numbers[0] !== actual.total || numbers[1] !== actual.total) {
      failures.push({ surface: 'README.md stats block', expected: `${actual.total} components / ${actual.total} specs`, actual: numbers.join(', ') || 'no counts' });
    }
  }

  const llmsPath = path.join(ROOT, 'apps', 'docs', 'public', 'llms.txt');
  const llms = readRequired(llmsPath);
  const llmsCore = matchNumber(llms, /## Core components \(@slipstream-ui\/core\)\s*[\u2013\u2014-]\s*(\d+)/, llmsPath);
  const llmsAi = matchNumber(llms, /## AI components \(@slipstream-ui\/ai\)\s*[\u2013\u2014-]\s*(\d+)/, llmsPath);
  if (llmsCore !== actual.core) failures.push({ surface: 'apps/docs/public/llms.txt (core)', expected: String(actual.core), actual: String(llmsCore) });
  if (llmsAi !== actual.ai) failures.push({ surface: 'apps/docs/public/llms.txt (ai)', expected: String(actual.ai), actual: String(llmsAi) });

  const llmIndexPath = path.join(ROOT, 'apps', 'docs', 'public', 'llm', 'index.md');
  const llmIndex = readRequired(llmIndexPath);
  const indexTotal = matchNumber(llmIndex, /The AI-first React component library\.\s*(\d+)\s+components/, llmIndexPath);
  const indexCore = matchNumber(llmIndex, /## Core components \(@slipstream-ui\/core\)\s*[\u2013\u2014-]\s*(\d+)/, llmIndexPath);
  const indexAi = matchNumber(llmIndex, /## AI components \(@slipstream-ui\/ai\)\s*[\u2013\u2014-]\s*(\d+)/, llmIndexPath);
  if (indexTotal !== actual.total) failures.push({ surface: 'apps/docs/public/llm/index.md (total)', expected: String(actual.total), actual: String(indexTotal) });
  if (indexCore !== actual.core) failures.push({ surface: 'apps/docs/public/llm/index.md (core)', expected: String(actual.core), actual: String(indexCore) });
  if (indexAi !== actual.ai) failures.push({ surface: 'apps/docs/public/llm/index.md (ai)', expected: String(actual.ai), actual: String(indexAi) });

  return failures;
}

function main(): void {
  const actual = readCounts();
  const failures = check(actual);

  if (failures.length > 0) {
    console.error('Component count drift detected. Manifests are the source of truth.');
    console.error(`Manifests: ${actual.total} total (${actual.core} core + ${actual.ai} ai)\n`);
    for (const failure of failures) {
      console.error(`- ${failure.surface}: expected ${failure.expected}, found ${failure.actual}`);
    }
    console.error('\nRun `pnpm generate:llm-docs` and commit the regenerated files.');
    process.exit(1);
  }

  console.log(`Component counts match manifests: ${actual.total} total (${actual.core} core + ${actual.ai} ai).`);
}

main();
