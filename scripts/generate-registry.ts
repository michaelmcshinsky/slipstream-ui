#!/usr/bin/env node
/**
 * Generates the static registry payload served from /registry/* on the docs site.
 *
 * Two consumers:
 * 1. Agents/CLIs reading COMPONENT_MANIFESTs (all.json + <id>.json metadata).
 * 2. shadcn-compatible installers: <id>.json additionally embeds the component
 *    source files so `npx shadcn@latest add <url>/registry/<id>.json` writes
 *    real code into the consumer's project — no package install required.
 *
 * Output: apps/docs/public/registry/{all.json,<id>.json}
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'apps', 'docs', 'public', 'registry');
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
/** Manifest id -> docs route id, for the two names that differ. */
const DOCS_ROUTE_ID: Record<string, string> = { source: 'sources' };
const PACKAGES = [
  { name: '@slipstream-ui/core', dir: path.join(ROOT, 'packages', 'core') },
  { name: '@slipstream-ui/ai', dir: path.join(ROOT, 'packages', 'ai') },
];

/** Runtime deps the generated code needs beyond react. */
function dependenciesFor(manifest: { package: string }) {
  const deps = [];
  if (manifest.package === '@slipstream-ui/core') {
    deps.push(
      'class-variance-authority',
      'clsx',
      'tailwind-merge'
    );
  } else {
    deps.push('@slipstream-ui/core');
  }
  return [...new Set(deps)];
}

function loadManifests() {
  return PACKAGES.flatMap(({ name, dir }) => {
    const manifestDir = path.join(dir, 'src', 'manifests');
    if (!fs.existsSync(manifestDir)) return [];
    return fs
      .readdirSync(manifestDir)
      .filter((file) => file.endsWith('.json'))
      .map((file) => JSON.parse(fs.readFileSync(path.join(manifestDir, file), 'utf8')))
      .map((manifest) => ({
        manifest,
        packageDir: dir,
        packageName: name,
        packageVersion: JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8')).version,
      }));
  }).sort((a, b) => a.manifest.id.localeCompare(b.manifest.id));
}

/** Map core exports to the registry item that provides them. */
const CORE_EXPORT_SOURCES: Record<string, string> = {
  Button: 'button',
  buttonVariants: 'button',
  Input: 'input',
  Badge: 'badge',
  badgeVariants: 'badge',
  Avatar: 'avatar',
  AvatarImage: 'avatar',
  AvatarFallback: 'avatar',
  Spinner: 'spinner',
  spinnerVariants: 'spinner',
  Select: 'select',
  Dialog: 'dialog',
  ToastProvider: 'toast',
  useToast: 'toast',
};

/**
 * Rewrite workspace imports so generated files compile in the consumer's project:
 * - cn() -> @/lib/utils (provided by the utils registry item)
 * - core component imports -> relative imports of previously-installed
 *   registry items, which are declared as registryDependencies.
 */
function rewriteImports(content: string) {
  let needsUtils = false;
  const usedComponents = new Set<string>();

  content = content.replace(
    /import\s+(type\s+)?\{([^}]*)\}\s+from\s+'(@slipstream-ui\/core|\.\.\/\.\.\/utils\/cn)';/g,
    (_match: string, typeModifier: string | undefined, specifiers: string, source: string) => {
      const names = specifiers.split(',').map((s) => s.trim()).filter(Boolean);
      const lines = [];
      if (source === '../../utils/cn') {
        needsUtils = true;
        lines.push(`import ${typeModifier ?? ''}{ ${names.join(', ')} } from '@/lib/utils';`);
        return lines.join('\n');
      }
      const cnNames = [];
      const componentNames = [];
      for (const name of names) {
        if (name === 'cn' || name === 'type ComponentManifest' || name === 'isComponentManifest') {
          if (name === 'cn') { needsUtils = true; cnNames.push(name); }
          else { continue; }
        } else {
          const itemId = CORE_EXPORT_SOURCES[name];
          if (itemId) { usedComponents.add(itemId); componentNames.push(name); }
        }
      }
      if (cnNames.length) lines.push(`import { ${cnNames.join(', ')} } from '@/lib/utils';`);
      if (componentNames.length) {
        // All provided components live under one barrel per registry item.
        const dirs = [...new Set(componentNames.map((n) => CORE_EXPORT_SOURCES[n]))];
        for (const dir of dirs) {
          const members = componentNames.filter((n) => CORE_EXPORT_SOURCES[n] === dir);
          lines.push(`import { ${members.join(', ')} } from '@/components/slipstream/${dir}';`);
        }
      }
      return lines.join('\n');
    }
  );

  return { content, needsUtils, usedComponents };
}

/** Collect the component's source files, rewriting workspace imports. */
function collectSourceFiles(packageDir: string, sourceDir: string) {
  const componentDir = path.join(packageDir, 'src', 'components', sourceDir);
  if (!fs.existsSync(componentDir)) return [];

  const files = [];
  const entries = fs
    .readdirSync(componentDir, { withFileTypes: true })
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  for (const entry of entries) {
    if (!entry.isFile() || !/\.(tsx|ts)$/.test(entry.name) || entry.name.endsWith('.test.tsx')) {
      continue;
    }
    const { content } = rewriteImports(fs.readFileSync(path.join(componentDir, entry.name), 'utf8').replace(/\r\n/g, '\n'));
    files.push({
      path: `components/slipstream/${sourceDir}/${entry.name}`,
      content,
      type: 'registry:component',
    });
  }

  // Every component also ships its manifest so installed projects keep the
  // AI-readable spec alongside the code.
  const manifestPath = path.join(packageDir, 'src', 'manifests', `${sourceManifestName(sourceDir)}.manifest.json`);
  if (fs.existsSync(manifestPath)) {
    files.push({
      path: `components/slipstream/manifests/${path.basename(manifestPath)}`,
      content: fs.readFileSync(manifestPath, 'utf8').replace(/\r\n/g, '\n'),
      type: 'registry:item',
    });
  }
  return files;
}

const SOURCE_DIR_TO_MANIFEST_ID: Record<string, string> = {
  suggestion: 'suggestions',
  chainthought: 'chain-thought',
  streaming: 'streaming-indicator',
  messageactions: 'message-actions',
};

function sourceManifestName(sourceDir: string) {
  return SOURCE_DIR_TO_MANIFEST_ID[sourceDir] ?? sourceDir;
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const entries = loadManifests();

  for (const { manifest, packageDir, packageName, packageVersion } of entries) {
    const sourceDir = manifest.sourceDir ?? manifest.id;
    const files = collectSourceFiles(packageDir, sourceDir).map((file) => {
      if (!file.path.includes('/manifests/')) return file;
      const data = JSON.parse(file.content);
      return { ...file, content: `${JSON.stringify({ ...data, version: packageVersion }, null, 2)}\n` };
    });
    // AI components import core primitives; declare those registry items so
    // shadcn-compatible installers pull them in automatically.
    const registryDependencies = files
      .flatMap((file) => [...file.content.matchAll(/@\/components\/slipstream\/([\w-]+)'/g)])
      .map((match) => match[1])
      .filter((id, index, all) => all.indexOf(id) === index)
      .filter((id) => id !== (manifest.sourceDir ?? manifest.id))
      .map((id) => `https://slipstreamui.com/registry/${id}.json`);
    if (packageName === '@slipstream-ui/ai') {
      registryDependencies.unshift('https://slipstreamui.com/registry/utils.json');
    }

    const payload = {
      $schema: 'https://slipstreamui.com/schemas/manifest-v1.json',
      ...manifest,
      // Release contract: an agent must never combine a manifest from one
      // version with docs from another.
      componentId: manifest.id,
      schemaVersion: RELEASE.schemaVersion,
      manifestVersion: RELEASE.manifestVersion,
      packageVersion: packageVersion,
      docs: `https://slipstreamui.com/docs/components/${DOCS_ROUTE_ID[manifest.id] ?? manifest.id}`,
      // Stamped from the published package so the registry never advertises a
      // stale per-component version.
      version: packageVersion,
      // shadcn-compatible installer fields:
      name: manifest.id,
      type: 'registry:component',
      dependencies: [
        ...dependenciesFor(manifest),
        // Scan for third-party imports (e.g. @radix-ui/*) used by the source.
        ...files
          .flatMap((file) => [...file.content.matchAll(/from '(@radix-ui\/[\w-]+)'/g)])
          .map((match) => match[1])
          .filter((id, index, all) => all.indexOf(id) === index),
      ],
      registryDependencies,
      files,
    };
    fs.writeFileSync(
      path.join(OUT_DIR, `${manifest.id}.json`),
      JSON.stringify(payload, null, 2) + '\n'
    );
  }

  // Shared utils item: cn() helper required by all components.
  const coreUtilsPath = path.join(ROOT, 'packages', 'core', 'src', 'utils', 'cn.ts');
  fs.writeFileSync(
    path.join(OUT_DIR, 'utils.json'),
    JSON.stringify(
      {
        $schema: 'https://slipstreamui.com/schemas/manifest-v1.json',
        name: 'utils',
        type: 'registry:utils',
        dependencies: ['clsx', 'tailwind-merge'],
        files: [
          {
            path: 'lib/utils.ts',
            content: fs.readFileSync(coreUtilsPath, 'utf8').replace(/\r\n/g, '\n'),
            type: 'registry:utils',
          },
        ],
      },
      null,
      2
    ) + '\n'
  );

  const index = {
    name: 'slipstream-ui',
    schemaVersion: RELEASE.registrySchemaVersion,
    manifestVersion: RELEASE.manifestVersion,
    version: CORE_VERSION,
    releaseDate: RELEASE.releaseDate,
    count: entries.length,
    counts: {
      core: entries.filter(({ manifest }) => manifest.package === '@slipstream-ui/core').length,
      ai: entries.filter(({ manifest }) => manifest.package === '@slipstream-ui/ai').length,
    },
    install: 'npx shadcn@latest add https://slipstreamui.com/registry/<id>.json',
    cliInstall: 'npx @slipstream-ui/cli@latest init',
    docs: 'https://slipstreamui.com/docs/components',
    components: entries.map(({ manifest }) => ({
      id: manifest.id,
      name: manifest.name,
      package: manifest.package,
      tier: manifest.tier,
      description: manifest.description,
      docs: `https://slipstreamui.com/docs/components/${DOCS_ROUTE_ID[manifest.id] ?? manifest.id}`,
      registry: `/registry/${manifest.id}.json`,
    })),
  };
  fs.writeFileSync(path.join(OUT_DIR, 'all.json'), JSON.stringify(index, null, 2) + '\n');

  // Machine-readable component relationship graph. Manifests already declare
  // composition rules and related components; this exposes them as one edge
  // list an agent can traverse before choosing a set of components.
  const toId = (name: string) =>
    name
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/\s+/g, '-')
      .toLowerCase();
  const nameToId = new Map<string, string>();
  for (const { manifest } of entries) {
    nameToId.set(manifest.name.toLowerCase(), manifest.id);
    nameToId.set(toId(manifest.name), manifest.id);
  }

  const edgeKeys = new Set<string>();
  for (const { manifest } of entries) {
    const from = manifest.id;
    const rules = (manifest.compositionRules ?? []) as { component?: string }[];
    for (const rule of rules) {
      if (!rule.component) continue;
      const to = nameToId.get(rule.component.toLowerCase()) ?? nameToId.get(toId(rule.component));
      if (to && to !== from) edgeKeys.add(JSON.stringify({ from, to, type: 'composition' }));
    }
    for (const related of (manifest.relatedComponents ?? []) as string[]) {
      const to = nameToId.get(related.toLowerCase()) ?? nameToId.get(toId(related));
      if (to && to !== from) edgeKeys.add(JSON.stringify({ from, to, type: 'related' }));
    }
  }
  const edges = [...edgeKeys]
    .map((key) => JSON.parse(key) as { from: string; to: string; type: 'composition' | 'related' })
    .sort((a, b) => `${a.from}:${a.to}:${a.type}`.localeCompare(`${b.from}:${b.to}:${b.type}`));

  const graph = {
    name: 'slipstream-ui',
    version: CORE_VERSION,
    releaseDate: RELEASE.releaseDate,
    schemaVersion: RELEASE.schemaVersion,
    manifestVersion: RELEASE.manifestVersion,
    nodeCount: entries.length,
    edgeCount: edges.length,
    docs: 'https://slipstreamui.com/docs/ai-manifests',
    nodes: entries.map(({ manifest }) => ({
      id: manifest.id,
      name: manifest.name,
      package: manifest.package,
      tier: manifest.tier,
      docs: `https://slipstreamui.com/docs/components/${DOCS_ROUTE_ID[manifest.id] ?? manifest.id}`,
    })),
    edges,
  };
  fs.writeFileSync(path.join(OUT_DIR, 'graph.json'), JSON.stringify(graph, null, 2) + '\n');

  console.log(
    `Registry generated: ${entries.length} installable components and ${edges.length} graph edges -> ${path.relative(ROOT, OUT_DIR)}`
  );
}

main();
