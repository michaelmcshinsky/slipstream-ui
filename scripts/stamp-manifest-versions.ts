#!/usr/bin/env node
/**
 * Stamp every source manifest with its package version.
 *
 * Release flow: changesets bump package.json, then this script writes the same
 * version into src/manifests/*.manifest.json. The registry generator also
 * stamps payloads, so both surfaces stay aligned.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const packages = [
  { name: '@slipstream-ui/core', dir: path.join(root, 'packages', 'core') },
  { name: '@slipstream-ui/ai', dir: path.join(root, 'packages', 'ai') },
];

let updated = 0;
for (const { name, dir } of packages) {
  const version = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8')).version;
  const manifestDir = path.join(dir, 'src', 'manifests');
  if (!fs.existsSync(manifestDir)) continue;

  for (const file of fs.readdirSync(manifestDir).filter((entry) => entry.endsWith('.json'))) {
    const manifestPath = path.join(manifestDir, file);
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    if (manifest.version === version) continue;
    manifest.version = version;
    fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    updated += 1;
  }
  console.log(`${name}: ${version}`);
}

console.log(`Updated ${updated} manifest version(s).`);
