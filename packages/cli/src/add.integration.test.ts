import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

const originalCwd = process.cwd();
let tempDir: string | null = null;

function fixture() {
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'slipstream-cli-'));
  fs.writeFileSync(
    path.join(tempDir, 'package.json'),
    JSON.stringify({ name: 'cli-integration-fixture', private: true, dependencies: { next: '^16.0.0' } })
  );
  process.chdir(tempDir);
  return tempDir;
}

/** Each test gets a fresh Commander instance: option values persist per command. */
async function loadAddCommand() {
  vi.resetModules();
  return (await import('./commands/add')).addCommand;
}

afterEach(() => {
  process.chdir(originalCwd);
  if (tempDir) {
    fs.rmSync(tempDir, { recursive: true, force: true });
    tempDir = null;
  }
  vi.restoreAllMocks();
});

describe('add command integration', () => {
  it('writes nothing and prints the plan for --dry-run', async () => {
    const dir = fixture();
    const addCommand = await loadAddCommand();
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    await addCommand.parseAsync(['node', 'slipstream-ui', 'button', '--dry-run']);

    expect(fs.existsSync(path.join(dir, 'components'))).toBe(false);
    const output = log.mock.calls.map((call) => call.map(String).join(' ')).join('\n');
    expect(output).toContain('Planned changes');
    expect(output).toContain('create');
    expect(output).toContain('manifests/button.manifest.json');
    expect(output).toContain('Re-run without --dry-run to apply');
  }, 30_000);

  it('copies source, support files and the manifest on a real add', async () => {
    const dir = fixture();
    const addCommand = await loadAddCommand();
    vi.spyOn(console, 'log').mockImplementation(() => undefined);

    await addCommand.parseAsync(['node', 'slipstream-ui', 'button']);

    expect(fs.existsSync(path.join(dir, 'components', 'slipstream', 'button', 'Button.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(dir, 'components', 'slipstream', 'utils', 'cn.ts'))).toBe(true);
    expect(fs.existsSync(path.join(dir, 'components', 'slipstream', 'manifests', 'button.manifest.json'))).toBe(true);
  }, 30_000);
});
