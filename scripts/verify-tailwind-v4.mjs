#!/usr/bin/env node
/**
 * Compiles the Tailwind v4 theme contract against the real component sources.
 *
 * This is the fixture CI uses to prove that v4 consumers can generate the
 * semantic utilities Slipstream components rely on. It runs the v4 CLI through
 * npx, so the workspace does not need a second Tailwind major installed.
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'slipstream-v4-'));
const INPUT = path.join(TMP, 'input.css');
const OUTPUT = path.join(TMP, 'output.css');

const toPosix = (value) => value.replace(/\\/g, '/');
const themes = toPosix(path.join(ROOT, 'packages', 'themes', 'tailwind-v4.css'));
const core = toPosix(path.join(ROOT, 'packages', 'core', 'src'));
const ai = toPosix(path.join(ROOT, 'packages', 'ai', 'src'));

fs.writeFileSync(path.join(TMP, 'package.json'), JSON.stringify({ private: true }, null, 2));
fs.writeFileSync(
  INPUT,
  [
    '@import "tailwindcss";',
    `@import "${themes}";`,
    `@source "${core}";`,
    `@source "${ai}";`,
    '',
  ].join('\n'),
);

console.log('Installing the Tailwind v4 CLI in a temporary fixture...');
execFileSync('npm', ['install', '--no-save', '--no-package-lock', 'tailwindcss@4', '@tailwindcss/cli@4'], {
  cwd: TMP,
  stdio: 'inherit',
  shell: process.platform === 'win32',
  timeout: 180_000,
});

console.log('Compiling Tailwind v4 theme against component sources...');
try {
  // Run the installed CLI directly. `npx --no-install @tailwindcss/cli` fails
  // on Windows because npx treats the scoped package as a subcommand.
  const cli = path.join(TMP, 'node_modules', '@tailwindcss', 'cli', 'dist', 'index.mjs');
  execFileSync(process.execPath, [cli, '-i', INPUT, '-o', OUTPUT], {
    cwd: TMP,
    stdio: 'inherit',
    timeout: 180_000,
  });

  const css = fs.readFileSync(OUTPUT, 'utf8');
  const required = [
    '.bg-card',
    '.bg-primary',
    '.bg-inverse',
    '.text-inverse-foreground',
    '.text-muted-foreground',
    '.border-border',
    '.rounded-lg',
  ];
  const missing = required.filter((selector) => !css.includes(selector));
  if (missing.length > 0) {
    console.error(`Tailwind v4 output is missing: ${missing.join(', ')}`);
    process.exit(1);
  }
  if (
    !/\.bg-card\s*\{[^}]*hsl\(var\(--card\)\)/.test(css) ||
    !/\.text-muted-foreground\s*\{[^}]*hsl\(var\(--muted-foreground\)\)/.test(css) ||
    !/\.bg-inverse\s*\{[^}]*hsl\(var\(--inverse\)\)/.test(css)
  ) {
    console.error('Tailwind v4 output does not resolve the semantic tokens.');
    process.exit(1);
  }
  console.log(`Tailwind v4 fixture compiled (${Math.round(css.length / 1024)} KB, ${required.length} selectors verified).`);
} finally {
  fs.rmSync(TMP, { recursive: true, force: true });
}
