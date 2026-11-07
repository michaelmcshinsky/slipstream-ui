#!/usr/bin/env node
/**
 * Fail when a source manifest version diverges from its package version.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const packages = [
  { name: '@slipstream-ui/core', dir: path.join(root, 'packages', 'core') },
  { name: '@slipstream-ui/ai', dir: path.join(root, 'packages', 'ai') },
];

const mismatches: string[] = [];
for (const { name, dir } of packages) {
  const version = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8')).version;
  const manifestDir = path.join(dir, 'src', 'manifests');
  if (!fs.existsSync(manifestDir)) continue;

  for (const file of fs.readdirSync(manifestDir).filter((entry) => entry.endsWith('.json'))) {
    const manifest = JSON.parse(fs.readFileSync(path.join(manifestDir, file), 'utf8'));
    if (manifest.version !== version) {
      mismatches.push(`${name}/${file}: ${String(manifest.version)} != ${version}`);
    }
  }
}

if (mismatches.length > 0) {
  console.error('Manifest versions do not match their package version:');
  for (const mismatch of mismatches) console.error(`  ${mismatch}`);
  console.error('Run `pnpm stamp:manifests` after bumping the packages.');
  process.exit(1);
}

console.log('Manifest versions match their package versions.');
