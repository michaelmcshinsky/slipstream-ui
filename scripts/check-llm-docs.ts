#!/usr/bin/env node
/**
 * Verifies that the published agent surfaces match the manifests:
 * - every manifest has `public/llm/components/<id>.md`
 * - no orphan component markdown exists
 * - `public/llm/index.md` links every component
 * - `public/llms.txt` mentions every component name
 * - every component page has a heading
 *
 * Runs in CI after `pnpm generate:llm-docs`.
 */

import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '..');
const PACKAGES = ['core', 'ai'];
const PUBLIC = path.join(ROOT, 'apps', 'docs', 'public');
const COMPONENT_DIR = path.join(PUBLIC, 'llm', 'components');
const INDEX = path.join(PUBLIC, 'llm', 'index.md');
const LLMS = path.join(PUBLIC, 'llms.txt');

type Manifest = { id: string; name: string };

function loadManifests(): Manifest[] {
  const manifests: Manifest[] = [];
  for (const pkg of PACKAGES) {
    const dir = path.join(ROOT, 'packages', pkg, 'src', 'manifests');
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir).filter((entry) => entry.endsWith('.manifest.json'))) {
      const manifest = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')) as Manifest;
      manifests.push({ id: manifest.id, name: manifest.name });
    }
  }
  return manifests.sort((a, b) => a.id.localeCompare(b.id));
}

function main(): void {
  const failures: string[] = [];
  const manifests = loadManifests();
  const ids = new Set(manifests.map((manifest) => manifest.id));

  if (!fs.existsSync(COMPONENT_DIR)) {
    failures.push(`Missing directory: ${path.relative(ROOT, COMPONENT_DIR)}`);
  } else {
    const files = fs.readdirSync(COMPONENT_DIR).filter((entry) => entry.endsWith('.md'));
    const publishedIds = new Set(files.map((file) => file.replace(/\.md$/, '')));

    for (const manifest of manifests) {
      if (!publishedIds.has(manifest.id)) failures.push(`Missing markdown for component "${manifest.id}"`);
    }
    for (const id of publishedIds) {
      if (!ids.has(id)) failures.push(`Orphan markdown for unknown component "${id}"`);
    }
    for (const file of files) {
      const content = fs.readFileSync(path.join(COMPONENT_DIR, file), 'utf8');
      if (!/^#\s+\S/m.test(content)) failures.push(`No heading in ${file}`);
    }
  }

  const index = fs.existsSync(INDEX) ? fs.readFileSync(INDEX, 'utf8') : '';
  if (!index) failures.push('Missing apps/docs/public/llm/index.md');
  for (const manifest of manifests) {
    if (!index.includes(`/llm/components/${manifest.id}.md`)) {
      failures.push(`llm/index.md does not link component "${manifest.id}"`);
    }
  }

  const llms = fs.existsSync(LLMS) ? fs.readFileSync(LLMS, 'utf8') : '';
  if (!llms) failures.push('Missing apps/docs/public/llms.txt');
  for (const manifest of manifests) {
    if (!llms.includes(manifest.name)) failures.push(`llms.txt does not mention "${manifest.name}"`);
  }

  if (failures.length > 0) {
    console.error('LLM documentation audit failed:\n');
    for (const failure of failures) console.error(`- ${failure}`);
    console.error('\nRun `pnpm generate:llm-docs` and commit the regenerated files.');
    process.exit(1);
  }

  console.log(`LLM docs match ${manifests.length} manifests.`);
}

main();
