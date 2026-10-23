import { describe, expect, it, afterAll } from 'vitest';
import path from 'node:path';
import os from 'node:os';
import fs from 'fs-extra';
import { loadRegistryEntries } from './registry';
import { diffInstalledComponents } from './diff';

const tempRoots: string[] = [];

async function fakeInstall(options: { id: string; version: string; files: Record<string, string>; manifestExtra?: Record<string, unknown> }) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'slip-diff-'));
  tempRoots.push(root);
  const entries = loadRegistryEntries();
  const entry = entries.find((candidate) => candidate.manifest.id === options.id);
  if (!entry) throw new Error(`Registry is missing fixture component "${options.id}"`);
  const sourceDirName = entry.manifest.sourceDir ?? entry.manifest.id;
  const sourceDir = path.join(root, sourceDirName);
  await fs.outputJson(path.join(root, 'manifests', `${options.id}.manifest.json`), {
    ...entry.manifest,
    version: options.version,
    ...options.manifestExtra,
  });
  for (const [file, content] of Object.entries(options.files)) {
    await fs.outputFile(path.join(sourceDir, file), content);
  }
  return { root, entry, sourceDirName };
}

afterAll(async () => {
  for (const root of tempRoots) await fs.remove(root);
});

describe('diffInstalledComponents (KC-027)', () => {
  it('reports ok for a fresh identical install', async () => {
    const entries = loadRegistryEntries();
    const button = entries.find((entry) => entry.manifest.id === 'button')!;
    const sourceDirName = button.manifest.sourceDir ?? 'button';
    const registryDir = path.join(button.packageDir, 'src', 'components', sourceDirName);
    const files: Record<string, string> = {};
    for (const file of fs.readdirSync(registryDir).filter((f) => /\.(tsx|ts)$/.test(f) && !f.includes('.test.'))) {
      files[file] = fs.readFileSync(path.join(registryDir, file), 'utf8');
    }
    const { root } = await fakeInstall({ id: 'button', version: button.manifest.version!, files });

    const diffs = await diffInstalledComponents({ installedRoot: root, entries });
    expect(diffs).toHaveLength(1);
    expect(diffs[0]).toMatchObject({ id: 'button', status: 'ok', versionOutdated: false });
  });

  it('detects modified, missing and extra files without writing anything', async () => {
    const entries = loadRegistryEntries();
    const button = entries.find((entry) => entry.manifest.id === 'button')!;
    const sourceDirName = button.manifest.sourceDir ?? 'button';
    const registryDir = path.join(button.packageDir, 'src', 'components', sourceDirName);
    const sourceFile = fs.readdirSync(registryDir).find((f) => /\.tsx$/.test(f) && !f.includes('.test.'))!;
    const { root } = await fakeInstall({
      id: 'button',
      version: button.manifest.version!,
      files: {
        [sourceFile]: '// locally modified\nexport const Button = () => null;\n',
        'extra-local.tsx': '// consumer-added helper\n',
      },
    });
    const before = await fs.readJson(path.join(root, 'manifests', 'button.manifest.json'));

    const diffs = await diffInstalledComponents({ installedRoot: root, entries });
    const statuses = Object.fromEntries(diffs[0]!.files.map((delta) => [delta.file, delta.status]));
    expect(statuses[sourceFile]).toBe('modified');
    expect(statuses['extra-local.tsx']).toBe('extra');
    expect(diffs[0]!.status).toBe('outdated');

    // Read-only guarantee: nothing changed on disk.
    expect(await fs.readJson(path.join(root, 'manifests', 'button.manifest.json'))).toEqual(before);
  });

  it('flags version drift even when file contents match', async () => {
    const entries = loadRegistryEntries();
    const button = entries.find((entry) => entry.manifest.id === 'button')!;
    const sourceDirName = button.manifest.sourceDir ?? 'button';
    const registryDir = path.join(button.packageDir, 'src', 'components', sourceDirName);
    const files: Record<string, string> = {};
    for (const file of fs.readdirSync(registryDir).filter((f) => /\.(tsx|ts)$/.test(f) && !f.includes('.test.'))) {
      files[file] = fs.readFileSync(path.join(registryDir, file), 'utf8');
    }
    const { root } = await fakeInstall({ id: 'button', version: '0.0.0-old', files });

    const diffs = await diffInstalledComponents({ installedRoot: root, entries });
    expect(diffs[0]).toMatchObject({ id: 'button', status: 'outdated', versionOutdated: true, registryVersion: button.manifest.version });
  });

  it('marks installed components missing from the registry as unknown', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'slip-diff-'));
    tempRoots.push(root);
    await fs.outputJson(path.join(root, 'manifests', 'ghost.manifest.json'), { id: 'ghost', version: '1.0.0' });

    const diffs = await diffInstalledComponents({ installedRoot: root, entries: loadRegistryEntries() });
    expect(diffs[0]).toMatchObject({ id: 'ghost', status: 'unknown' });
  });

  it('returns an empty list when nothing is installed', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'slip-diff-'));
    tempRoots.push(root);
    expect(await diffInstalledComponents({ installedRoot: root, entries: loadRegistryEntries() })).toEqual([]);
  });
});
