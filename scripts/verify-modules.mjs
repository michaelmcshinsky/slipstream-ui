#!/usr/bin/env node
/**
 * Verify the per-file module build and subpath exports.
 *
 * The root entry is a client bundle for compatibility. Subpaths must preserve
 * per-file directives so Card and Text can render on the server while Dialog
 * stays a client boundary.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const core = path.join(root, 'packages', 'core');
const dist = path.join(core, 'dist');
const pkg = JSON.parse(fs.readFileSync(path.join(core, 'package.json'), 'utf8'));

const checks = [];

function expectFile(file) {
  if (!fs.existsSync(file)) checks.push(`missing ${path.relative(core, file)}`);
}

function firstStatement(file) {
  return fs.readFileSync(file, 'utf8').split('\n').map((line) => line.trim()).find(Boolean) ?? '';
}

expectFile(path.join(dist, 'index.mjs'));
expectFile(path.join(dist, 'src', 'components', 'card', 'index.mjs'));
expectFile(path.join(dist, 'src', 'components', 'dialog', 'index.mjs'));
expectFile(path.join(dist, 'src', 'components', 'button', 'index.d.ts'));

if (firstStatement(path.join(dist, 'index.mjs')) !== "'use client';") {
  checks.push('root bundle should keep the use client banner');
}
if (firstStatement(path.join(dist, 'src', 'components', 'card', 'Card.mjs')).includes('use client')) {
  checks.push('Card module must not be a client boundary');
}
if (!firstStatement(path.join(dist, 'src', 'components', 'dialog', 'Dialog.mjs')).includes('use client')) {
  checks.push('Dialog module must keep its use client directive');
}
if (!pkg.exports?.['./*']?.import?.includes('dist/src/components/*/index.mjs')) {
  checks.push('package exports are missing the component subpath map');
}

const buttonModule = fs.readFileSync(path.join(dist, 'src', 'components', 'button', 'Button.mjs'), 'utf8');
if (!buttonModule.includes('../../utils/cn.mjs')) {
  checks.push('relative imports should carry explicit .mjs extensions');
}

if (checks.length > 0) {
  console.error('Module verification failed:');
  for (const check of checks) console.error(`  ${check}`);
  process.exit(1);
}

console.log('Module verification passed: root client bundle, server-safe subpaths, explicit imports.');
