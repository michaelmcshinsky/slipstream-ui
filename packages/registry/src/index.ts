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
  /** Prop schema entries read by validation tools. */
  props?: { name: string; required?: boolean }[];
  /** Anti-patterns read by validation and docs tools. */
  antiPatterns?: { title: string; explanation: string; example?: string }[];
  [key: string]: unknown;
};

export interface RegistryEntry {
  manifest: RegistryManifest;
  /** Directory containing the package that ships this manifest. */
  packageDir: string;
}

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

let cache: RegistryManifest[] | undefined;

/** All manifests across component packages (cached per process). */
export function loadRegistry(): RegistryManifest[] {
  if (!cache) cache = loadRegistryEntries().map((entry) => entry.manifest);
  return cache;
}

export function getManifest(componentId: string) {
  return loadRegistry().find((manifest) => manifest.id === componentId);
}
