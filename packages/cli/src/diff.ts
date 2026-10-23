import path from 'node:path';
import { createHash } from 'node:crypto';
import fs from 'fs-extra';
import type { RegistryEntry } from './registry';

export interface InstalledManifest {
  id: string;
  version?: string;
}

export interface FileDelta {
  file: string;
  status: 'missing' | 'modified' | 'extra';
}

export interface ComponentDiff {
  id: string;
  status: 'ok' | 'outdated' | 'unknown';
  installedVersion?: string;
  registryVersion?: string;
  versionOutdated: boolean;
  files: FileDelta[];
}

function hashFile(file: string): string {
  return createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function sourceFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => /\.(tsx|ts)$/.test(file) && !/\.test\.(tsx|ts)$/.test(file))
    .sort();
}

/**
 * Content-based, read-only comparison of a consumer's installed components
 * against the registry (KC-027 / KC-045: compare file contents, not versions
 * alone; never modify anything).
 */
export async function diffInstalledComponents(options: {
  installedRoot: string;
  entries: RegistryEntry[];
}): Promise<ComponentDiff[]> {
  const manifestsDir = path.join(options.installedRoot, 'manifests');
  if (!(await fs.pathExists(manifestsDir))) return [];

  const installed = (
    await fs.readdir(manifestsDir)
  )
    .filter((file) => file.endsWith('.manifest.json'))
    .sort()
    .map(
      (file) =>
        JSON.parse(fs.readFileSync(path.join(manifestsDir, file), 'utf8')) as InstalledManifest
    );

  const diffs: ComponentDiff[] = [];
  for (const manifest of installed) {
    const entry = options.entries.find((candidate) => candidate.manifest.id === manifest.id);
    if (!entry) {
      diffs.push({ id: manifest.id, status: 'unknown', installedVersion: manifest.version, versionOutdated: false, files: [] });
      continue;
    }
    const sourceDirName = entry.manifest.sourceDir ?? entry.manifest.id;
    const registryDir = path.join(entry.packageDir, 'src', 'components', sourceDirName);
    const installedDir = path.join(options.installedRoot, sourceDirName);

    const files: FileDelta[] = [];
    for (const file of sourceFiles(registryDir)) {
      const installedFile = path.join(installedDir, file);
      if (!(await fs.pathExists(installedFile))) {
        files.push({ file, status: 'missing' });
      } else if (hashFile(path.join(registryDir, file)) !== hashFile(installedFile)) {
        files.push({ file, status: 'modified' });
      }
    }
    for (const file of sourceFiles(installedDir)) {
      if (!sourceFiles(registryDir).includes(file)) {
        files.push({ file, status: 'extra' });
      }
    }

    const versionOutdated = manifest.version !== entry.manifest.version;
    diffs.push({
      id: manifest.id,
      status: versionOutdated || files.some((delta) => delta.status !== 'extra') ? 'outdated' : 'ok',
      installedVersion: manifest.version,
      registryVersion: entry.manifest.version,
      versionOutdated,
      files: files.sort((a, b) => a.file.localeCompare(b.file)),
    });
  }
  return diffs;
}
