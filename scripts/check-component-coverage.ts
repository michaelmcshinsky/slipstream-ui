#!/usr/bin/env node
/**
 * Component delivery coverage: every manifest must have a component test, a
 * docs page, examples and an accessibility section. This is the release gate
 * for "every component is verified and documented", not a substitute for the
 * per-component test suite.
 */

import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '..');
const PACKAGES = ['core', 'ai'];
const DOCS_ALIASES: Record<string, string> = {
  source: 'sources',
};

type Manifest = {
  id: string;
  sourceDir?: string;
  examples?: unknown[];
  accessibility?: unknown[];
};

function readManifests(pkg: string): Manifest[] {
  const dir = path.join(ROOT, 'packages', pkg, 'src', 'manifests');
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.manifest.json'))
    .map((file) => JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')) as Manifest);
}

function main(): void {
  const failures: string[] = [];
  let total = 0;

  for (const pkg of PACKAGES) {
    for (const manifest of readManifests(pkg)) {
      total += 1;
      const id = manifest.id;
      if (!manifest.sourceDir) {
        failures.push(`${id}: missing sourceDir`);
        continue;
      }

      const componentDir = path.join(ROOT, 'packages', pkg, 'src', 'components', manifest.sourceDir);
      if (!fs.existsSync(componentDir)) {
        failures.push(`${id}: component dir missing (${manifest.sourceDir})`);
        continue;
      }

      const tests = fs.readdirSync(componentDir).filter((file) => /\.test\.(ts|tsx)$/.test(file));
      if (tests.length === 0) failures.push(`${id}: no component test file`);

      if (!Array.isArray(manifest.examples) || manifest.examples.length === 0) {
        failures.push(`${id}: no usage examples in manifest`);
      }
      if (!Array.isArray(manifest.accessibility) || manifest.accessibility.length === 0) {
        failures.push(`${id}: no accessibility section in manifest`);
      }

      const docsId = DOCS_ALIASES[id] ?? id;
      const docsPage = path.join(ROOT, 'apps', 'docs', 'app', 'docs', 'components', docsId, 'page.tsx');
      if (!fs.existsSync(docsPage)) failures.push(`${id}: no docs page at /docs/components/${docsId}`);
    }
  }

  if (failures.length > 0) {
    console.error('Component coverage FAILED:\n');
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Component coverage passed: ${total} components with tests, examples, accessibility and docs.`);
}

main();
