import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { DEFAULT_COMPONENTS_DIR, resolveComponentsDir } from './config';

const roots: string[] = [];

function project(config?: unknown) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'slipstream-config-'));
  roots.push(root);
  if (config !== undefined) {
    fs.writeFileSync(path.join(root, 'slipstream.config.json'), JSON.stringify(config));
  }
  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('resolveComponentsDir', () => {
  it('uses the default destination when no config exists', () => {
    const root = project();
    const resolved = resolveComponentsDir(root);
    expect(resolved.relative).toBe(DEFAULT_COMPONENTS_DIR);
    expect(resolved.absolute).toBe(path.join(root, DEFAULT_COMPONENTS_DIR));
    expect(resolved.configPath).toBeNull();
  });

  it('uses a configured relative destination', () => {
    const root = project({ componentsDir: 'src/slipstream' });
    const resolved = resolveComponentsDir(root);
    expect(resolved.relative).toBe('src/slipstream');
    expect(resolved.absolute).toBe(path.join(root, 'src', 'slipstream'));
    expect(resolved.configPath).toBe(path.join(root, 'slipstream.config.json'));
  });

  it('falls back when componentsDir is empty', () => {
    const root = project({ componentsDir: '   ' });
    expect(resolveComponentsDir(root).relative).toBe(DEFAULT_COMPONENTS_DIR);
  });

  it('rejects a destination that escapes the project', () => {
    const root = project({ componentsDir: '../outside' });
    expect(() => resolveComponentsDir(root)).toThrow(/inside the project root/);
  });

  it('rejects an absolute destination', () => {
    const root = project();
    fs.writeFileSync(
      path.join(root, 'slipstream.config.json'),
      JSON.stringify({ componentsDir: path.join(root, 'src', 'slipstream') })
    );
    expect(() => resolveComponentsDir(root)).toThrow(/relative to the project root/);
  });

  it('reports malformed config', () => {
    const root = project();
    fs.writeFileSync(path.join(root, 'slipstream.config.json'), '{ not json');
    expect(() => resolveComponentsDir(root)).toThrow(/Could not parse/);
  });
});
