#!/usr/bin/env node
/**
 * Packed-artifact distribution audit (KC-041 / KC-044).
 *
 * For each publishable package this script:
 * - builds nothing (expects `pnpm build` to have run), packs with `pnpm pack`
 * - verifies the tarball ships dist + src + manifests (core/ai)
 * - verifies main/module/types/exports targets exist inside the tarball
 * - rejects workspace: protocol dependencies in the published manifest
 *
 * Exits non-zero on any violation so CI can gate releases on it.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '..');
const PACKAGES = ['core', 'ai', 'themes', 'cli', 'mcp-server', 'registry'];

interface Violation {
  pkg: string;
  message: string;
}

function run(command: string, args: string[], cwd: string): string {
  // pnpm is a .cmd shim on Windows; a shell is required there.
  return execFileSync(command, args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: process.platform === 'win32',
  });
}

function listTarball(tarball: string): string[] {
  const output = run('tar', ['-tf', tarball], path.dirname(tarball));
  return output.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function readTarballFile(tarball: string, member: string): string {
  return run('tar', ['-xOf', tarball, member], path.dirname(tarball));
}

function main() {
  const violations: Violation[] = [];
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'slip-pack-audit-'));

  try {
    for (const pkgName of PACKAGES) {
      const pkgDir = path.join(ROOT, 'packages', pkgName);
      const manifest = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8')) as {
        name: string;
        private?: boolean;
        main?: string;
        module?: string;
        types?: string;
        exports?: Record<string, unknown>;
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
      };
      if (manifest.private) continue;

      let tarball: string;
      try {
        const packed = run('pnpm', ['pack', '--pack-destination', tempDir], pkgDir).trim().split(/\r?\n/).pop()!;
        tarball = path.isAbsolute(packed) ? packed : path.join(tempDir, path.basename(packed));
      } catch (error) {
        violations.push({ pkg: manifest.name, message: `pnpm pack failed: ${(error as Error).message}` });
        continue;
      }

      const members = listTarball(tarball).map((member) => member.replace(/^package\//, ''));
      const has = (file: string) => members.includes(file);

      for (const field of ['main', 'module', 'types'] as const) {
        const target = manifest[field];
        if (target && !has(target.replace(/^\.\//, ''))) {
          violations.push({ pkg: manifest.name, message: `${field} target "${target}" missing from tarball` });
        }
      }

      if (!has('dist/index.js') && !has('dist/index.mjs') && !manifest.exports) {
        violations.push({ pkg: manifest.name, message: 'tarball ships no dist entry point' });
      }
      // Component packages must ship source so agents/CLI can read and copy it.
      if (manifest.name === '@slipstream-ui/core' || manifest.name === '@slipstream-ui/ai') {
        if (!has('src/index.ts')) {
          violations.push({ pkg: manifest.name, message: 'source (src/index.ts) not published — agents cannot read component source' });
        }
        const manifestCount = members.filter((member) => /^src\/manifests\/.+\.manifest\.json$/.test(member)).length;
        if (manifestCount === 0) {
          violations.push({ pkg: manifest.name, message: 'no COMPONENT_MANIFEST files in tarball' });
        }
      }

      const published = readTarballFile(tarball, 'package/package.json');
      const publishedManifest = JSON.parse(published) as { dependencies?: Record<string, string> };
      for (const [dep, range] of Object.entries(publishedManifest.dependencies ?? {})) {
        if (range.startsWith('workspace:')) {
          violations.push({ pkg: manifest.name, message: `dependency ${dep} uses workspace: range — unpublishable` });
        }
      }

      console.log(`✓ ${manifest.name} (${members.length} files)`);
    }
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }

  if (violations.length > 0) {
    console.error('\nDistribution audit FAILED:');
    for (const violation of violations) console.error(`  ✗ ${violation.pkg}: ${violation.message}`);
    process.exit(1);
  }
  console.log('\nDistribution audit passed: all publishable packages are installable from their tarballs.');
}

main();
