#!/usr/bin/env node
/**
 * Fails when component source hardcodes a Tailwind palette color instead of a
 * semantic token.
 *
 * The design-system contract says components use `bg-card`, `text-muted-foreground`,
 * `border-border`, etc. A raw `bg-blue-500` breaks theming, dark mode and the
 * token contract consumers override. The only allowed exceptions are the
 * Button's `contrast` and `onDark` variants, which deliberately pin white for
 * legibility on a colored surface.
 *
 * Run: pnpm check:tokens (also part of validate:manifests / CI).
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '..');
const ROOTS = [
  path.join(ROOT, 'packages', 'core', 'src', 'components'),
  path.join(ROOT, 'packages', 'ai', 'src', 'components'),
];

const PALETTE =
  /\b(?:bg|text|border|ring|from|to|via|fill|stroke|decoration|outline|divide|accent|caret|shadow)-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone|white|black)(?:-\d{2,3})?\b/g;

const ALLOWLIST: { file: string; reason: string; line: RegExp }[] = [
  {
    file: 'packages/core/src/components/button/Button.tsx',
    reason: 'contrast/onDark variants pin white for legibility on colored surfaces',
    line: /^\s*contrast:/,
  },
  {
    file: 'packages/core/src/components/button/Button.tsx',
    reason: 'onDark variant pins white for legibility on a dark surface',
    line: /border-white\/45/,
  },
];

type Violation = { file: string; line: number; token: string; source: string };

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? [full] : [];
  });
}

function allowed(relative: string, line: string): boolean {
  return ALLOWLIST.some((entry) => entry.file === relative && entry.line.test(line));
}

const violations: Violation[] = [];
for (const root of ROOTS) {
  for (const file of walk(root)) {
    const relative = path.relative(ROOT, file).split(path.sep).join('/');
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
    lines.forEach((line, index) => {
      if (allowed(relative, line)) return;
      for (const token of line.match(PALETTE) ?? []) {
        violations.push({ file: relative, line: index + 1, token, source: line.trim() });
      }
    });
  }
}

if (violations.length > 0) {
  console.error('Hardcoded Tailwind palette colors found in component source.');
  console.error('Use semantic tokens (bg-card, text-muted-foreground, border-border, ...) instead.\n');
  for (const violation of violations) {
    console.error(`  ${violation.file}:${violation.line}  ${violation.token}`);
    console.error(`    ${violation.source}`);
  }
  console.error(
    `\nAllowed exceptions:\n${ALLOWLIST.map((entry) => `  ${entry.file} — ${entry.reason}`).join('\n')}`
  );
  process.exit(1);
}

console.log('Token compliance: no hardcoded palette colors in component source.');
