import fs from 'node:fs';
import path from 'node:path';
import { allCases, assertCaseSet } from './src/cases';
import { REPO_ROOT } from './src/manifests';

const cases = allCases();
assertCaseSet(cases);

const payload = `${JSON.stringify({ version: 1, count: cases.length, cases }, null, 2)}\n`;
const outDir = path.join(REPO_ROOT, 'benchmarks', 'cases');
const outFile = path.join(outDir, 'cases.json');

if (process.argv.includes('--check')) {
  if (!fs.existsSync(outFile)) {
    console.error('benchmarks/cases/cases.json is missing. Run pnpm bench:generate.');
    process.exit(1);
  }
  const existing = fs.readFileSync(outFile, 'utf8');
  if (existing !== payload) {
    console.error('benchmarks/cases/cases.json is stale. Run pnpm bench:generate.');
    process.exit(1);
  }
  console.log(`Benchmark cases match: ${cases.length}.`);
} else {
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, payload);
  console.log(`Wrote ${cases.length} cases to benchmarks/cases/cases.json.`);
}
