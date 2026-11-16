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
}

// The MCP registry descriptor is a second published surface for the same
// package; keep its version and the nested package entry in lockstep.
const mcpDir = path.join(root, 'packages', 'mcp-server');
const mcpVersion = JSON.parse(fs.readFileSync(path.join(mcpDir, 'package.json'), 'utf8')).version;
const serverJson = JSON.parse(fs.readFileSync(path.join(mcpDir, 'server.json'), 'utf8')) as {
  version?: string;
  packages?: { identifier?: string; version?: string }[];
};
const serverPackage = serverJson.packages?.find((entry) => entry.identifier === '@slipstream-ui/mcp-server');
if (serverJson.version !== mcpVersion) {
  mismatches.push(`mcp-server/server.json: ${String(serverJson.version)} != ${mcpVersion}`);
}
if (serverPackage && serverPackage.version !== mcpVersion) {
  mismatches.push(`mcp-server/server.json packages[].version: ${String(serverPackage.version)} != ${mcpVersion}`);
}

if (mismatches.length > 0) {
  console.error('Published version surfaces disagree with their packages:');
  for (const mismatch of mismatches) console.error(`  ${mismatch}`);
  process.exit(1);
}

console.log('Manifest and MCP registry versions match their package versions.');
