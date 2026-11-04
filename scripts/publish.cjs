#!/usr/bin/env node
/**
 * Publishes versioned packages through changesets.
 *
 * Packages declare `publishConfig.provenance: true`, so CI publishes with
 * npm provenance attestations (release.yml grants id-token: write). npm
 * refuses to generate provenance outside a supported CI provider, so a
 * local run explicitly disables it instead of failing with EUSAGE.
 *
 * Usage: pnpm release   (from the repo root, after `pnpm version-packages`)
 */
const { spawnSync } = require('node:child_process');

const inSupportedCi = process.env.GITHUB_ACTIONS === 'true';
const env = { ...process.env };

if (!inSupportedCi && env.NPM_CONFIG_PROVENANCE === undefined) {
  env.NPM_CONFIG_PROVENANCE = 'false';
  console.log('publish: local run detected — provenance disabled for this publish');
}

const result = spawnSync('changeset', ['publish', ...process.argv.slice(2)], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env,
});

process.exit(result.status ?? 1);
