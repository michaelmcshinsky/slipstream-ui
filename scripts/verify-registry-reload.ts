#!/usr/bin/env node
/**
 * Verify that the registry cache notices manifest changes without a restart.
 *
 * Add a temporary manifest, read the registry, then remove it. The running MCP
 * server uses the same loader, so this covers the reload contract.
 */
import fs from 'node:fs';
import path from 'node:path';
import { loadRegistry } from '../packages/registry/src/index';

const root = path.resolve(import.meta.dirname, '..');
const manifestDir = path.join(root, 'packages', 'core', 'src', 'manifests');
const fixture = path.join(manifestDir, '__reload-test.manifest.json');

const before = loadRegistry();
if (before.some((manifest) => manifest.id === '__reload-test')) {
  throw new Error('fixture manifest already present');
}

const manifest = {
  id: '__reload-test',
  name: 'ReloadTest',
  tier: 'atom',
  package: '@slipstream-ui/core',
  version: JSON.parse(fs.readFileSync(path.join(root, 'packages', 'core', 'package.json'), 'utf8')).version,
  description: 'Temporary manifest used to verify cache invalidation.',
  designIntent: 'Test only.',
  props: [],
  examples: [],
  accessibility: [],
  sourceDir: 'button',
  exportName: 'Button',
};

try {
  fs.writeFileSync(fixture, `${JSON.stringify(manifest, null, 2)}\n`);
  const after = loadRegistry();
  if (!after.some((entry) => entry.id === '__reload-test')) {
    throw new Error('registry did not see the manifest added after the first read');
  }
  if (after.length <= before.length) {
    throw new Error(`registry length did not grow: ${before.length} -> ${after.length}`);
  }
} finally {
  fs.rmSync(fixture, { force: true });
}

const restored = loadRegistry();
if (restored.some((entry) => entry.id === '__reload-test')) {
  throw new Error('registry kept the removed manifest');
}

console.log('Registry reload verification passed.');
