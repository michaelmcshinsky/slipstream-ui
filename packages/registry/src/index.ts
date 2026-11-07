import fs from 'node:fs';
import path from 'node:path';

export type RegistryManifest = {
  id: string;
  name: string;
  package: string;
  tier: string;
  description: string;
  /** Directory name under the package's src/components/. */
  sourceDir?: string;
  /** Primary component export for import hints. */
  exportName?: string;
  /** Manifest version (semver string). */
  version?: string;
  /** Prop schema entries read by validation tools. */
  props?: {
    name: string;
    required?: boolean;
    type?: string;
    enum?: string[];
    defaultValue?: unknown;
    description?: string;
  }[];
  /** Anti-patterns read by validation and docs tools. */
  antiPatterns?: { title: string; explanation: string; example?: string }[];
  [key: string]: unknown;
};

export type RegistryEntry = {
  manifest: RegistryManifest;
  /** Directory containing the package that ships this manifest. */
  packageDir: string;
};

const PACKAGE_NAMES = ['@slipstream-ui/core', '@slipstream-ui/ai'] as const;

function readManifestsFrom(dir: string): RegistryManifest[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.json'))
    .map((file) => JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')));
}

/**
 * Locate an installed component package directory via Node resolution.
 * Entry points live at <pkg>/dist/index.* so the package root is two levels up.
 */
export function resolvePackageDir(packageName: string): string | undefined {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const entry = require.resolve(packageName);
    const distDir = path.dirname(entry);
    return path.basename(distDir) === 'dist' ? path.dirname(distDir) : distDir;
  } catch {
    return undefined;
  }
}

/** Monorepo development fallback when packages are not installed. */
function monorepoPackageDir(packageName: string): string | undefined {
  const root = process.env.SLIPSTREAM_UI_ROOT ?? path.resolve(__dirname, '..', '..', '..');
  const subPackage = packageName.endsWith('/core') ? 'core' : 'ai';
  const dir = path.join(root, 'packages', subPackage);
  try {
    if (
      fs.existsSync(path.join(dir, 'package.json')) &&
      JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8')).name === packageName
    ) {
      return dir;
    }
  } catch {
    // Fall through to undefined.
  }
  return undefined;
}

/**
 * Aggregate manifests from every component package.
 * Returns entries from BOTH packages; a missing package is skipped, never fatal.
 */
export function loadRegistryEntries(): RegistryEntry[] {
  const entries: RegistryEntry[] = [];

  for (const packageName of PACKAGE_NAMES) {
    const packageDir = resolvePackageDir(packageName) ?? monorepoPackageDir(packageName);
    if (!packageDir) continue;

    // Prefer source manifests; dist/manifests is the fallback for published
    // packages whose tarball may exclude src/. Never read both, or ids double up.
    let manifests = readManifestsFrom(path.join(packageDir, 'src', 'manifests'));
    if (manifests.length === 0) {
      manifests = readManifestsFrom(path.join(packageDir, 'dist', 'manifests'));
    }

    for (const manifest of manifests) {
      entries.push({ manifest, packageDir });
    }
  }

  return entries;
}

type RegistryCache = {
  signature: string;
  manifests: RegistryManifest[];
};

let cache: RegistryCache | undefined;

/**
 * Fingerprint of the manifest files currently in use. A directory mtime does
 * not change when a file is edited, so each file's mtime and size are hashed.
 */
function manifestSignature(): string {
  const parts: string[] = [];

  for (const packageName of PACKAGE_NAMES) {
    const packageDir = resolvePackageDir(packageName) ?? monorepoPackageDir(packageName);
    if (!packageDir) continue;

    const sourceDir = path.join(packageDir, 'src', 'manifests');
    const distDir = path.join(packageDir, 'dist', 'manifests');
    const hasSource =
      fs.existsSync(sourceDir) && fs.readdirSync(sourceDir).some((file) => file.endsWith('.json'));
    const dir = hasSource ? sourceDir : distDir;

    let files: string[];
    try {
      files = fs.readdirSync(dir).filter((file) => file.endsWith('.json')).sort();
    } catch {
      continue;
    }

    for (const file of files) {
      try {
        const stat = fs.statSync(path.join(dir, file));
        parts.push(`${packageName}/${file}:${stat.mtimeMs}:${stat.size}`);
      } catch {
        // File vanished mid-scan; the next call sees the settled state.
      }
    }
  }

  return parts.join('|');
}

/**
 * All manifests across component packages. Cached until a manifest file
 * changes on disk, so a running MCP server or watch process sees edits
 * without a restart.
 */
export function loadRegistry(): RegistryManifest[] {
  const signature = manifestSignature();
  if (!cache || cache.signature !== signature) {
    cache = {
      signature,
      manifests: loadRegistryEntries().map((entry) => entry.manifest),
    };
  }
  return cache.manifests;
}

export function getManifest(componentId: string) {
  return loadRegistry().find((manifest) => manifest.id === componentId);
}
