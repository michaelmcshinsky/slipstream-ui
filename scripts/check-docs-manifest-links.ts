#!/usr/bin/env node
/**
 * Every component docs page fetches `/registry/<manifestId ?? id>.json` to
 * render anti-patterns, composition rules and the Copy-for-AI instruction.
 * A page with no matching registry payload silently renders without those
 * sections (and Copy for AI fails), which is exactly the kind of docs drift a
 * reader notices before a test does.
 *
 * This gate walks every `apps/docs/app/docs/components/*\/page.tsx` (the
 * server scaffold that renders `ComponentPage`), reads the `id` /
 * `manifestId` passed to it, and verifies the generated registry payload
 * exists and carries that id. `demo.tsx` files are client islands and no
 * longer carry the page props.
 *
 * Run: pnpm check:docs-links (also part of validate:manifests / CI).
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '..');
const COMPONENTS_DIR = path.join(ROOT, 'apps', 'docs', 'app', 'docs', 'components');
const REGISTRY_DIR = path.join(ROOT, 'apps', 'docs', 'public', 'registry');

type Failure = { page: string; detail: string };

function pageFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return pageFiles(full);
    return entry.name === 'page.tsx' || entry.name === 'demo.tsx' ? [full] : [];
  });
}

function attribute(source: string, name: string): string | undefined {
  const match = new RegExp(`${name}="([^"]+)"`).exec(source);
  return match?.[1];
}

const failures: Failure[] = [];
const checked = new Set<string>();
for (const file of pageFiles(COMPONENTS_DIR)) {
  const dir = path.relative(COMPONENTS_DIR, path.dirname(file)).split(path.sep).join('/');
  if (checked.has(dir)) continue;
  const source = fs.readFileSync(file, 'utf8');
  if (!source.includes('<ComponentPage')) continue;
  checked.add(dir);
  const page = dir;
  const id = attribute(source, 'id');
  if (!id) {
    failures.push({ page, detail: 'ComponentPage has no id' });
    continue;
  }
  const manifestId = attribute(source, 'manifestId') ?? id;
  const registryPath = path.join(REGISTRY_DIR, `${manifestId}.json`);
  if (!fs.existsSync(registryPath)) {
    failures.push({
      page,
      detail: `missing registry/${manifestId}.json — set manifestId= to the manifest id`,
    });
    continue;
  }
  try {
    const payload = JSON.parse(fs.readFileSync(registryPath, 'utf8')) as { id?: string };
    if (payload.id !== manifestId) {
      failures.push({
        page,
        detail: `registry/${manifestId}.json carries id "${payload.id ?? '?'}"`,
      });
    }
  } catch (error) {
    failures.push({
      page,
      detail: `registry/${manifestId}.json is not valid JSON (${String(error)})`,
    });
  }
}

if (failures.length > 0) {
  console.error('Docs pages and registry payloads disagree:');
  for (const failure of failures) console.error(`  ${failure.page}: ${failure.detail}`);
  process.exit(1);
}

console.log(`Docs links: every component page resolves to a registry payload (${checked.size} pages).`);
