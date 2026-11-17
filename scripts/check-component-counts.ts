#!/usr/bin/env node
/**
 * Fails when a published component count disagrees with the manifests.
 *
 * The manifests in `packages/<pkg>/src/manifests` are the source of truth.
 * `scripts/generate-llm-docs.ts` derives the public counts from them, but
 * nothing currently stops a hand-edited or stale value from being committed.
 * This check runs in CI after generation and compares every published surface:
 *
 * - `apps/docs/lib/component-count.ts` (generated module)
 * - `README.md` generated stats block
 * - `apps/docs/public/llms.txt`
 * - `apps/docs/public/llm/index.md`
 *
 * Exits non-zero with a per-surface diff.
 */

import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '..');

const RELEASE = JSON.parse(fs.readFileSync(path.join(ROOT, 'release.json'), 'utf8')) as {
  schemaVersion: number;
  manifestVersion: number;
  registrySchemaVersion: number;
  releaseDate: string;
};
const CORE_VERSION = (
  JSON.parse(fs.readFileSync(path.join(ROOT, 'packages', 'core', 'package.json'), 'utf8')) as {
    version: string;
  }
).version;

const PACKAGES = [
  { name: 'core', dir: path.join(ROOT, 'packages', 'core') },
  { name: 'ai', dir: path.join(ROOT, 'packages', 'ai') },
] as const;

type Counts = {
  core: number;
  ai: number;
  total: number;
};

type Failure = {
  surface: string;
  expected: string;
  actual: string;
};

function countManifests(packageDir: string): number {
  const manifestDir = path.join(packageDir, 'src', 'manifests');
  if (!fs.existsSync(manifestDir)) return 0;
  return fs.readdirSync(manifestDir).filter((file) => file.endsWith('.manifest.json')).length;
}

function readRequired(filePath: string): string {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Expected file not found: ${path.relative(ROOT, filePath)}`);
  }
  return fs.readFileSync(filePath, 'utf8');
}

function matchNumber(source: string, pattern: RegExp, surface: string): number {
  const match = pattern.exec(source);
  if (!match) {
    throw new Error(`${surface} does not contain the expected count pattern ${pattern}`);
  }
  return Number.parseInt(match[1], 10);
}

function readCounts(): Counts {
  const core = countManifests(PACKAGES[0].dir);
  const ai = countManifests(PACKAGES[1].dir);
  return { core, ai, total: core + ai };
}

function check(actual: Counts): Failure[] {
  const failures: Failure[] = [];

  const countModulePath = path.join(ROOT, 'apps', 'docs', 'lib', 'component-count.ts');
  const countModule = readRequired(countModulePath);
  const moduleTotal = matchNumber(countModule, /\bCOMPONENT_COUNT\s*=\s*(\d+)/, countModulePath);
  const moduleCore = matchNumber(countModule, /\bCORE_COMPONENT_COUNT\s*=\s*(\d+)/, countModulePath);
  const moduleAi = matchNumber(countModule, /\bAI_COMPONENT_COUNT\s*=\s*(\d+)/, countModulePath);

  if (moduleTotal !== actual.total) {
    failures.push({ surface: 'apps/docs/lib/component-count.ts (total)', expected: String(actual.total), actual: String(moduleTotal) });
  }
  if (moduleCore !== actual.core) {
    failures.push({ surface: 'apps/docs/lib/component-count.ts (core)', expected: String(actual.core), actual: String(moduleCore) });
  }
  if (moduleAi !== actual.ai) {
    failures.push({ surface: 'apps/docs/lib/component-count.ts (ai)', expected: String(actual.ai), actual: String(moduleAi) });
  }

  const readme = readRequired(path.join(ROOT, 'README.md'));
  const statsBlock = /<!-- generated:stats:start -->([\s\S]*?)<!-- generated:stats:end -->/.exec(readme);
  if (!statsBlock) {
    failures.push({ surface: 'README.md', expected: 'generated:stats block', actual: 'missing' });
  } else {
    const numbers = [...statsBlock[1].matchAll(/(\d+)\s+(?:components|machine-readable)/g)].map((m) => Number.parseInt(m[1], 10));
    if (numbers.length < 2 || numbers[0] !== actual.total || numbers[1] !== actual.total) {
      failures.push({ surface: 'README.md stats block', expected: `${actual.total} components / ${actual.total} specs`, actual: numbers.join(', ') || 'no counts' });
    }
  }

  const llmsPath = path.join(ROOT, 'apps', 'docs', 'public', 'llms.txt');
  const llms = readRequired(llmsPath);
  const llmsCore = matchNumber(llms, /## Core components \(@slipstream-ui\/core\)\s*[\u2013\u2014-]\s*(\d+)/, llmsPath);
  const llmsAi = matchNumber(llms, /## AI components \(@slipstream-ui\/ai\)\s*[\u2013\u2014-]\s*(\d+)/, llmsPath);
  if (llmsCore !== actual.core) failures.push({ surface: 'apps/docs/public/llms.txt (core)', expected: String(actual.core), actual: String(llmsCore) });
  if (llmsAi !== actual.ai) failures.push({ surface: 'apps/docs/public/llms.txt (ai)', expected: String(actual.ai), actual: String(llmsAi) });

  // The release block is the only place a version or a headline count may
  // appear in llms.txt. A stale hand-written summary (the audit's P0 finding)
  // now fails here instead of shipping.
  const releaseBlock = /<!-- generated:release:start -->([\s\S]*?)<!-- generated:release:end -->/.exec(llms);
  if (!releaseBlock) {
    failures.push({ surface: 'apps/docs/public/llms.txt release block', expected: 'generated release block', actual: 'missing' });
  } else {
    const block = releaseBlock[1];
    if (!block.includes(`Version: ${CORE_VERSION} (${RELEASE.releaseDate})`)) {
      failures.push({
        surface: 'apps/docs/public/llms.txt release version',
        expected: `${CORE_VERSION} (${RELEASE.releaseDate})`,
        actual: (block.match(/Version:[^\n]*/) ?? ['missing'])[0],
      });
    }
    const summary = new RegExp(
      `>\\s*${actual.total} components: ${actual.core} in \`@slipstream-ui/core\` and ${actual.ai} in \`@slipstream-ui/ai\``
    );
    if (!summary.test(block)) {
      failures.push({
        surface: 'apps/docs/public/llms.txt release counts',
        expected: `${actual.total} components: ${actual.core} core / ${actual.ai} ai`,
        actual: (block.match(/>\s*\d+ components:[^\n]*/) ?? ['missing'])[0],
      });
    }
  }

  const llmIndexPath = path.join(ROOT, 'apps', 'docs', 'public', 'llm', 'index.md');
  const llmIndex = readRequired(llmIndexPath);
  const indexTotal = matchNumber(llmIndex, /The AI-first React component library\.\s*(\d+)\s+components/, llmIndexPath);
  const indexCore = matchNumber(llmIndex, /## Core components \(@slipstream-ui\/core\)\s*[\u2013\u2014-]\s*(\d+)/, llmIndexPath);
  const indexAi = matchNumber(llmIndex, /## AI components \(@slipstream-ui\/ai\)\s*[\u2013\u2014-]\s*(\d+)/, llmIndexPath);
  if (indexTotal !== actual.total) failures.push({ surface: 'apps/docs/public/llm/index.md (total)', expected: String(actual.total), actual: String(indexTotal) });
  if (indexCore !== actual.core) failures.push({ surface: 'apps/docs/public/llm/index.md (core)', expected: String(actual.core), actual: String(indexCore) });
  if (indexAi !== actual.ai) failures.push({ surface: 'apps/docs/public/llm/index.md (ai)', expected: String(actual.ai), actual: String(indexAi) });

  const indexVersion = /^>\s*Version:\s*([^\s]+)\s+\(([^)]+)\)/m.exec(llmIndex);
  if (!indexVersion || indexVersion[1] !== CORE_VERSION || indexVersion[2] !== RELEASE.releaseDate) {
    failures.push({
      surface: 'apps/docs/public/llm/index.md release version',
      expected: `${CORE_VERSION} (${RELEASE.releaseDate})`,
      actual: indexVersion ? `${indexVersion[1]} (${indexVersion[2]})` : 'missing',
    });
  }

  const llmsFullPath = path.join(ROOT, 'apps', 'docs', 'public', 'llms-full.txt');
  const llmsFull = readRequired(llmsFullPath);
  if (!llmsFull.includes(`Version: ${CORE_VERSION} (${RELEASE.releaseDate})`)) {
    failures.push({ surface: 'apps/docs/public/llms-full.txt release version', expected: `${CORE_VERSION} (${RELEASE.releaseDate})`, actual: 'missing or stale' });
  }

  const registryPath = path.join(ROOT, 'apps', 'docs', 'public', 'registry', 'all.json');
  const registry = JSON.parse(readRequired(registryPath)) as {
    version?: string;
    count?: number;
    counts?: { core?: number; ai?: number };
    schemaVersion?: number;
    manifestVersion?: number;
  };
  if (registry.version !== CORE_VERSION) {
    failures.push({ surface: 'apps/docs/public/registry/all.json version', expected: CORE_VERSION, actual: String(registry.version) });
  }
  if (registry.count !== actual.total) {
    failures.push({ surface: 'apps/docs/public/registry/all.json count', expected: String(actual.total), actual: String(registry.count) });
  }
  if (registry.counts?.core !== actual.core || registry.counts?.ai !== actual.ai) {
    failures.push({
      surface: 'apps/docs/public/registry/all.json counts',
      expected: `${actual.core} core / ${actual.ai} ai`,
      actual: `${registry.counts?.core ?? '?'} core / ${registry.counts?.ai ?? '?'} ai`,
    });
  }
  if (registry.schemaVersion !== RELEASE.registrySchemaVersion || registry.manifestVersion !== RELEASE.manifestVersion) {
    failures.push({
      surface: 'apps/docs/public/registry/all.json schema versions',
      expected: `schema ${RELEASE.registrySchemaVersion} / manifest ${RELEASE.manifestVersion}`,
      actual: `schema ${registry.schemaVersion ?? '?'} / manifest ${registry.manifestVersion ?? '?'}`,
    });
  }

  const graphPath = path.join(ROOT, 'apps', 'docs', 'public', 'registry', 'graph.json');
  const graph = JSON.parse(readRequired(graphPath)) as {
    nodeCount?: number;
    nodes?: { id?: string }[];
    edges?: { from?: string; to?: string }[];
  };
  const graphNodes = graph.nodes ?? [];
  if (graph.nodeCount !== actual.total || graphNodes.length !== actual.total) {
    failures.push({
      surface: 'apps/docs/public/registry/graph.json nodes',
      expected: String(actual.total),
      actual: `${graph.nodeCount ?? '?'} declared / ${graphNodes.length} listed`,
    });
  }
  const ids = new Set(graphNodes.map((node) => node.id));
  const dangling = (graph.edges ?? []).filter((edge) => !ids.has(edge.from ?? '') || !ids.has(edge.to ?? ''));
  if (dangling.length > 0) {
    failures.push({
      surface: 'apps/docs/public/registry/graph.json edges',
      expected: 'every edge resolves to a node',
      actual: `${dangling.length} dangling edge(s)`,
    });
  }

  const recommendationsPath = path.join(ROOT, 'apps', 'docs', 'public', 'registry', 'recommendations.json');
  const recommendations = JSON.parse(readRequired(recommendationsPath)) as {
    count?: number;
    recipes?: { keywords?: string[]; components?: { id?: string }[] }[];
  };
  const recipes = recommendations.recipes ?? [];
  if (recommendations.count !== recipes.length || recipes.length === 0) {
    failures.push({
      surface: 'apps/docs/public/registry/recommendations.json count',
      expected: `>0 recipes matching count`,
      actual: `${recommendations.count ?? '?'} declared / ${recipes.length} listed`,
    });
  }
  const unknownComponents = recipes
    .flatMap((recipe) => recipe.components ?? [])
    .filter((component) => !ids.has(component.id ?? ''))
    .map((component) => component.id ?? '?');
  if (unknownComponents.length > 0) {
    failures.push({
      surface: 'apps/docs/public/registry/recommendations.json components',
      expected: 'every recommendation resolves to a graph node',
      actual: [...new Set(unknownComponents)].join(', '),
    });
  }
  const emptyKeywords = recipes.filter((recipe) => (recipe.keywords ?? []).length === 0).length;
  if (emptyKeywords > 0) {
    failures.push({
      surface: 'apps/docs/public/registry/recommendations.json keywords',
      expected: 'every recipe has at least one keyword',
      actual: `${emptyKeywords} recipe(s) without keywords`,
    });
  }

  return failures;
}

function main(): void {
  const actual = readCounts();
  const failures = check(actual);

  if (failures.length > 0) {
    console.error('Component count drift detected. Manifests are the source of truth.');
    console.error(`Manifests: ${actual.total} total (${actual.core} core + ${actual.ai} ai)\n`);
    for (const failure of failures) {
      console.error(`- ${failure.surface}: expected ${failure.expected}, found ${failure.actual}`);
    }
    console.error('\nRun `pnpm generate:llm-docs` and commit the regenerated files.');
    process.exit(1);
  }

  console.log(`Component counts match manifests: ${actual.total} total (${actual.core} core + ${actual.ai} ai).`);
}

main();
