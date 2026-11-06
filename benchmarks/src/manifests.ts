import fs from 'node:fs';
import path from 'node:path';

export type ManifestProp = {
  name: string;
  type?: string;
  required?: boolean;
  enum?: string[];
  defaultValue?: unknown;
  description?: string;
};

export type Manifest = {
  id: string;
  name: string;
  exportName?: string;
  sourceDir?: string;
  package?: string;
  description?: string;
  props?: ManifestProp[];
  examples?: { title: string; code: string }[];
  antiPatterns?: { title: string; explanation: string }[];
};

function findRoot(start: string = process.cwd()): string {
  let dir = path.resolve(start);
  for (let i = 0; i < 8; i++) {
    if (fs.existsSync(path.join(dir, 'pnpm-workspace.yaml'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error('Could not locate repository root (pnpm-workspace.yaml not found).');
}

export const REPO_ROOT = findRoot();

const MANIFEST_DIRS = [
  { packageName: '@slipstream-ui/core', dir: path.join(REPO_ROOT, 'packages', 'core', 'src', 'manifests') },
  { packageName: '@slipstream-ui/ai', dir: path.join(REPO_ROOT, 'packages', 'ai', 'src', 'manifests') },
];

export function loadManifests(): Manifest[] {
  const manifests: Manifest[] = [];
  for (const entry of MANIFEST_DIRS) {
    if (!fs.existsSync(entry.dir)) continue;
    for (const file of fs.readdirSync(entry.dir).filter((name) => name.endsWith('.manifest.json'))) {
      const manifest = JSON.parse(fs.readFileSync(path.join(entry.dir, file), 'utf8')) as Manifest;
      manifests.push({ ...manifest, package: manifest.package ?? entry.packageName });
    }
  }
  return manifests.sort((a, b) => a.id.localeCompare(b.id));
}

export function manifestById(id: string): Manifest {
  const manifest = loadManifests().find((entry) => entry.id === id);
  if (!manifest) throw new Error(`Unknown component id: ${id}`);
  return manifest;
}

export function readComponentMarkdown(id: string): string {
  const file = path.join(REPO_ROOT, 'apps', 'docs', 'public', 'llm', 'components', `${id}.md`);
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

export function readComponentSource(manifest: Manifest): string {
  if (!manifest.sourceDir) return '';
  const packageDir = manifest.package === '@slipstream-ui/core' ? 'core' : 'ai';
  const dir = path.join(REPO_ROOT, 'packages', packageDir, 'src', 'components', manifest.sourceDir);
  if (!fs.existsSync(dir)) return '';
  return fs
    .readdirSync(dir)
    .filter((name) => (name.endsWith('.tsx') || name.endsWith('.ts')) && !name.startsWith('index.') && !name.includes('.test.'))
    .map((name) => fs.readFileSync(path.join(dir, name), 'utf8'))
    .join('\n\n');
}
