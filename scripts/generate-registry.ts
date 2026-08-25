#!/usr/bin/env node
/**
 * Generates the static registry payload served from /registry/* on the docs site.
 *
 * Consumers can install components via the manifest-driven registry without
 * publishing anything: each <id>.json contains the COMPONENT_MANIFEST plus
 * install metadata; all.json is the combined index used by agents and CLIs.
 *
 * Output: apps/docs/public/registry/{all.json,<id>.json}
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'apps', 'docs', 'public', 'registry');
const MANIFEST_DIRS = [
  path.join(ROOT, 'packages', 'core', 'src', 'manifests'),
  path.join(ROOT, 'packages', 'ai', 'src', 'manifests'),
];

function loadManifests() {
  return MANIFEST_DIRS.flatMap((dir) =>
    fs
      .readdirSync(dir)
      .filter((file) => file.endsWith('.json'))
      .map((file) => JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')))
  ).sort((a, b) => a.id.localeCompare(b.id));
}

function main() {
  const manifests = loadManifests();
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const manifest of manifests) {
    const payload = {
      $schema: 'https://slipstreamui.com/schemas/manifest-v1.json',
      ...manifest,
    };
    fs.writeFileSync(
      path.join(OUT_DIR, `${manifest.id}.json`),
      JSON.stringify(payload, null, 2) + '\n'
    );
  }

  const index = {
    name: 'slipstream-ui',
    schemaVersion: 1,
    updated: new Date().toISOString(),
    count: manifests.length,
    components: manifests.map(({ id, name, package: pkg, tier, description }) => ({
      id,
      name,
      package: pkg,
      tier,
      description,
      registry: `/registry/${id}.json`,
    })),
  };
  fs.writeFileSync(path.join(OUT_DIR, 'all.json'), JSON.stringify(index, null, 2) + '\n');

  console.log(`Registry generated: ${manifests.length} component manifests -> ${path.relative(ROOT, OUT_DIR)}`);
}

main();
