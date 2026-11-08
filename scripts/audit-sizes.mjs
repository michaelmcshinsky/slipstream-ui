#!/usr/bin/env node
/**
 * Bundle and stylesheet size audit.
 *
 * Records the shipped CSS and the tree-shaken cost of a small core import,
 * then fails when a budget is exceeded. Run after `pnpm build`.
 *
 * The minimal consumer imports Button + Card parts, which is the smallest
 * realistic page shell. React is external, as it is for consumers.
 */
import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const root = path.resolve(import.meta.dirname, '..');
const entry = path.join(root, '.size-audit-entry.mjs');
const outfile = path.join(root, '.size-audit-out.mjs');

const budgets = {
  'packages/core/dist/index.mjs': { rawKb: 280, gzipKb: 60 },
  'packages/core/dist/styles.css': { rawKb: 55, gzipKb: 12 },
  'packages/core/dist/styles-full.css': { rawKb: 60, gzipKb: 14 },
  'packages/themes/dist/styles.css': { rawKb: 6, gzipKb: 2 },
  'minimal import': { rawKb: 180, gzipKb: 50 },
};

function kb(bytes) {
  return bytes / 1024;
}

function format(bytes) {
  return `${kb(bytes).toFixed(1)} KB`;
}

function findEsbuild() {
  const store = path.join(root, 'node_modules', '.pnpm');
  const match = readdirSync(store).find((entry) => entry.startsWith('esbuild@'));
  if (!match) throw new Error('esbuild is not installed');
  const bin = path.join(store, match, 'node_modules', 'esbuild', 'bin', 'esbuild');
  if (!existsSync(bin)) throw new Error(`esbuild binary missing at ${bin}`);
  return bin;
}

function measure(file) {
  const bytes = readFileSync(file);
  return { raw: bytes.length, gzip: zlib.gzipSync(bytes).length };
}

function check(label, measured) {
  const budget = budgets[label];
  if (!budget) return true;
  const ok = kb(measured.raw) <= budget.rawKb && kb(measured.gzip) <= budget.gzipKb;
  const verdict = ok ? 'ok' : 'OVER BUDGET';
  console.log(
    `${label.padEnd(38)} ${format(measured.raw).padStart(10)} raw  ${format(measured.gzip).padStart(9)} gzip  ${verdict}`
  );
  return ok;
}

const results = {};
let failed = false;

for (const relative of [
  'packages/core/dist/index.mjs',
  'packages/core/dist/styles.css',
  'packages/core/dist/styles-full.css',
  'packages/themes/dist/styles.css',
]) {
  const file = path.join(root, relative);
  if (!existsSync(file)) {
    console.error(`Missing ${relative}. Run pnpm build first.`);
    process.exit(1);
  }
  results[relative] = measure(file);
}

try {
  writeFileSync(
    entry,
    "import { Button, Card, CardContent, CardHeader, CardTitle } from './packages/core/dist/index.mjs';\n" +
      'globalThis.__slipstreamSizeAudit = [Button, Card, CardContent, CardHeader, CardTitle];\n'
  );
  const esbuildBin = findEsbuild();
  const bundlerArgs = [
    entry,
    '--bundle',
    '--format=esm',
    '--minify',
    '--external:react',
    '--external:react-dom',
    `--outfile=${outfile}`,
    '--log-level=error',
  ];
  // On Windows the esbuild bin is a Node shim; on Linux/macOS it is the
  // platform binary itself and must be executed directly.
  const runner = process.platform === 'win32' ? process.execPath : esbuildBin;
  const runnerArgs = process.platform === 'win32' ? [esbuildBin, ...bundlerArgs] : bundlerArgs;
  execFileSync(runner, runnerArgs, { cwd: root, stdio: 'pipe' });
  results['minimal import'] = measure(outfile);
} finally {
  rmSync(entry, { force: true });
  rmSync(outfile, { force: true });
}

for (const [label, measured] of Object.entries(results)) {
  if (!check(label, measured)) failed = true;
}

if (failed) {
  console.error('\nSize audit failed: one or more artifacts exceeded its budget.');
  process.exit(1);
}

console.log('\nSize audit passed.');
