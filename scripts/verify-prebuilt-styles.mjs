#!/usr/bin/env node
/**
 * Verify the prebuilt stylesheet carries the reset rules components need when
 * the host does not run Tailwind Preflight.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const file = path.join(root, 'packages', 'core', 'dist', 'styles.css');
if (!fs.existsSync(file)) {
  console.error(`Missing ${path.relative(root, file)}. Run the core build first.`);
  process.exit(1);
}

const css = fs.readFileSync(file, 'utf8');
const checks = [
  ['box sizing', /box-sizing:\s*border-box/],
  ['border style', /border-style:\s*solid/],
  ['form font inheritance', /button,[\s\S]*?font-family:\s*inherit/],
  ['media block display', /(?:img|svg|video)[\s\S]*?display:\s*block/],
  ['list reset', /list-style:\s*none/],
];

const missing = checks.filter(([, pattern]) => !pattern.test(css)).map(([name]) => name);
if (missing.length > 0) {
  console.error(`Prebuilt stylesheet is missing: ${missing.join(', ')}`);
  process.exit(1);
}

console.log(`Prebuilt stylesheet reset verified: ${checks.length} checks.`);
