import fs from 'node:fs';
import path from 'node:path';

export type RegistryManifest = {
  id: string;
  name: string;
  package: string;
  tier: string;
  description: string;
  sourceDir?: string;
  exportName?: string;
  [key: string]: unknown;
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
 * Locate a package directory via Node resolution so the registry works
 * from an installed npm package, not just inside the monorepo.
 */
function resolvePackageDir(packageName: string): string | undefined {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const entry = require.resolve(packageName);
    return path.dirname(entry);
  } catch {
    return undefined;
  }
}

/** Monorepo development fallback when packages are not installed. */
function monorepoPackageDirs(): string[] {
  const root =
    process.env.SLIPSTREAM_UI_ROOT ??
    path.resolve(__dirname, '../../../');
  return ['core', 'ai'].map((pkg) => path.join(root, 'packages', pkg));
}

let cache: RegistryManifest[] | undefined;

export function loadRegistry(): RegistryManifest[] {
  if (cache) return cache;

  for (const packageName of PACKAGE_NAMES) {
    let packageDir = resolvePackageDir(packageName);

    if (!packageDir) {
      packageDir = monorepoPackageDirs().find(
        (dir) =>
          fs.existsSync(path.join(dir, 'package.json')) &&
          JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8')).name === packageName
      );
    }

    if (!packageDir) continue;

    const manifests = [
      ...readManifestsFrom(path.join(packageDir, 'src', 'manifests')),
      ...readManifestsFrom(path.join(packageDir, 'manifests')),
      ...readManifestsFrom(path.join(packageDir, 'dist', 'manifests')),
    ];

    if (manifests.length) {
      cache = manifests;
      return cache;
    }
  }

  return [];
}

export function getManifest(componentId: string) {
  return loadRegistry().find((manifest) => manifest.id === componentId);
}
