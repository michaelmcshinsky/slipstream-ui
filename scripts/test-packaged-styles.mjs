#!/usr/bin/env node
/**
 * Packaged stylesheet smoke test.
 *
 * Packs @slipstream-ui/core and @slipstream-ui/themes, extracts the tarballs
 * into a throwaway consumer, and resolves the stylesheet entry points the same
 * way a consumer does. Catches a missing dist file, a broken export map, a
 * lost class, a missing theme variable, or preflight leaking into the
 * utilities-only sheet.
 */
import { execFileSync, execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = path.resolve(import.meta.dirname, '..');
const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const consumer = mkdtempSync(path.join(tmpdir(), 'slipstream-styles-'));
const tarballDir = path.join(consumer, 'tarballs');
mkdirSync(tarballDir, { recursive: true });

function pack(packageDir) {
  execSync(`"${pnpm}" pack --pack-destination "${tarballDir}"`, {
    cwd: packageDir,
    stdio: 'pipe',
    shell: true,
  });
}

function findTarball(prefix) {
  const file = readdirSync(tarballDir).find(
    (entry) => entry.startsWith(prefix) && entry.endsWith('.tgz')
  );
  assert.ok(file, `missing tarball for ${prefix}`);
  return path.join(tarballDir, file);
}

function extract(tarball, destination) {
  mkdirSync(destination, { recursive: true });
  execFileSync('tar', ['-xzf', tarball, '-C', destination, '--strip-components=1']);
}

function assertContains(haystack, needle, label) {
  assert.ok(haystack.includes(needle), `${label} is missing ${needle}`);
}

try {
  pack(path.join(root, 'packages', 'core'));
  pack(path.join(root, 'packages', 'themes'));

  const coreDir = path.join(consumer, 'node_modules', '@slipstream-ui', 'core');
  const themesDir = path.join(consumer, 'node_modules', '@slipstream-ui', 'themes');
  extract(findTarball('slipstream-ui-core-'), coreDir);
  extract(findTarball('slipstream-ui-themes-'), themesDir);

  const requireFromConsumer = createRequire(path.join(consumer, 'index.js'));

  const coreStylesPath = requireFromConsumer.resolve('@slipstream-ui/core/styles.css');
  const coreFullPath = requireFromConsumer.resolve('@slipstream-ui/core/styles-full.css');
  const themeStylesPath = requireFromConsumer.resolve('@slipstream-ui/themes/styles.css');

  assert.ok(existsSync(coreStylesPath), 'core/styles.css does not exist');
  assert.ok(existsSync(coreFullPath), 'core/styles-full.css does not exist');
  assert.ok(existsSync(themeStylesPath), 'themes/styles.css does not exist');

  const utilities = readFileSync(coreStylesPath, 'utf8');
  const full = readFileSync(coreFullPath, 'utf8');
  const theme = readFileSync(themeStylesPath, 'utf8');

  for (const className of ['.bg-card', '.text-muted-foreground', '.rounded-md', '.flex']) {
    assertContains(utilities, className, 'utilities stylesheet');
  }

  // The utilities-only sheet ships a small reset, not Tailwind Preflight.
  assert.ok(
    !utilities.includes('--tw-border-spacing-x'),
    'utilities stylesheet unexpectedly contains Tailwind Preflight'
  );
  assert.ok(
    utilities.includes('box-sizing:border-box'),
    'utilities stylesheet is missing its minimal reset'
  );
  assert.ok(
    full.includes('--tw-border-spacing-x'),
    'styles-full.css is missing Tailwind Preflight'
  );

  for (const token of ['--background:', '--primary:', '--border:', '--radius:']) {
    assertContains(theme, token, 'theme stylesheet');
  }
  assert.ok(
    theme.includes('.dark') || theme.includes('[data-theme=dark]'),
    'theme stylesheet is missing the dark selector'
  );

  const coreManifest = JSON.parse(readFileSync(path.join(coreDir, 'package.json'), 'utf8'));
  assert.ok(coreManifest.exports?.['./styles.css'], 'core export map is missing ./styles.css');
  assert.ok(
    coreManifest.exports?.['./styles-full.css'],
    'core export map is missing ./styles-full.css'
  );

  const themeManifest = JSON.parse(readFileSync(path.join(themesDir, 'package.json'), 'utf8'));
  assert.ok(
    themeManifest.exports?.['./styles.css'],
    'themes export map is missing ./styles.css'
  );

  console.log('Packaged styles OK: core/styles.css, core/styles-full.css, themes/styles.css');
} finally {
  rmSync(consumer, { recursive: true, force: true });
}
