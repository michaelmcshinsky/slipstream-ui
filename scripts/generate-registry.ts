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
import { execSync } from 'node:child_process';

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'apps', 'docs', 'public', 'registry');
const PACKAGES = [
  { name: '@slipstream-ui/core', dir: path.join(ROOT, 'packages', 'core') },
  { name: '@slipstream-ui/ai', dir: path.join(ROOT, 'packages', 'ai') },
];

/** Runtime deps the generated code needs beyond react. */
function dependenciesFor(manifest) {
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
      }));
  }).sort((a, b) => a.manifest.id.localeCompare(b.manifest.id));
}

/** Map core exports to the registry item that provides them. */
const CORE_EXPORT_SOURCES = {
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
function rewriteImports(content) {
  let needsUtils = false;
  const usedComponents = new Set();

  content = content.replace(
    /import\s+(type\s+)?\{([^}]*)\}\s+from\s+'(@slipstream-ui\/core|\.\.\/\.\.\/utils\/cn)';/g,
    (_match, typeModifier, specifiers, source) => {
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
function collectSourceFiles(packageDir, sourceDir) {
  const componentDir = path.join(packageDir, 'src', 'components', sourceDir);
  if (!fs.existsSync(componentDir)) return [];

  const files = [];
  for (const entry of fs.readdirSync(componentDir, { withFileTypes: true })) {
    if (!entry.isFile() || !/\.(tsx|ts)$/.test(entry.name) || entry.name.endsWith('.test.tsx')) {
      continue;
    }
    const { content } = rewriteImports(fs.readFileSync(path.join(componentDir, entry.name), 'utf8'));
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
      content: fs.readFileSync(manifestPath, 'utf8'),
      type: 'registry:item',
    });
  }
  return files;
}

const SOURCE_DIR_TO_MANIFEST_ID = {
  suggestion: 'suggestions',
  chainthought: 'chain-thought',
  streaming: 'streaming-indicator',
  messageactions: 'message-actions',
};

function sourceManifestName(sourceDir) {
  return SOURCE_DIR_TO_MANIFEST_ID[sourceDir] ?? sourceDir;
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const entries = loadManifests();

  for (const { manifest, packageDir, packageName } of entries) {
    const sourceDir = manifest.sourceDir ?? manifest.id;
    const files = collectSourceFiles(packageDir, sourceDir);
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
            content: fs.readFileSync(coreUtilsPath, 'utf8'),
            type: 'registry:utils',
          },
        ],
      },
      null,
      2
    ) + '\n'
  );

  // A build-time timestamp would make the committed output differ on every
  // rebuild; the source revision keeps the payload byte-identical for a given
  // tree while still recording which commit generated it.
  const sourceRevision = (() => {
    try {
      return execSync('git rev-parse --short HEAD', { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] })
        .toString()
        .trim();
    } catch {
      return null;
    }
  })();

  const index = {
    name: 'slipstream-ui',
    schemaVersion: 1,
    ...(sourceRevision ? { sourceRevision } : {}),
    count: entries.length,
    install: 'npx shadcn@latest add https://slipstreamui.com/registry/<id>.json',
    components: entries.map(({ manifest }) => ({
      id: manifest.id,
      name: manifest.name,
      package: manifest.package,
      tier: manifest.tier,
      description: manifest.description,
      registry: `/registry/${manifest.id}.json`,
    })),
  };
  fs.writeFileSync(path.join(OUT_DIR, 'all.json'), JSON.stringify(index, null, 2) + '\n');

  console.log(`Registry generated: ${entries.length} installable components -> ${path.relative(ROOT, OUT_DIR)}`);
}

main();
