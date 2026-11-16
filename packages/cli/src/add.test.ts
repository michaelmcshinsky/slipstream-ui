import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { collectComponentSource, planWrites } from './commands/add';
import { rewriteSupportImports } from './source';

const sourceRoot = path.resolve(__dirname, '../../core/src');

describe('planWrites', () => {
  const files = ['components/button/Button.tsx', 'utils/cn.ts', 'manifests/button.manifest.json'];

  it('marks new files as creates without touching the disk', () => {
    expect(planWrites(files, () => false, false)).toEqual([
      { relative: files[0], action: 'create' },
      { relative: files[1], action: 'create' },
      { relative: files[2], action: 'create' },
    ]);
  });

  it('skips existing files unless --overwrite is set', () => {
    const exists = (relative: string) => relative === 'utils/cn.ts';
    expect(planWrites(files, exists, false)).toEqual([
      { relative: files[0], action: 'create' },
      { relative: files[1], action: 'skip' },
      { relative: files[2], action: 'create' },
    ]);
    expect(planWrites(files, exists, true)).toEqual([
      { relative: files[0], action: 'create' },
      { relative: files[1], action: 'overwrite' },
      { relative: files[2], action: 'create' },
    ]);
  });
});

describe('collectComponentSource', () => {
  it('collects a component and rewrites its support imports for the flat destination', () => {
    const { components, files, support } = collectComponentSource(sourceRoot, 'button');
    expect(components).toEqual(['button']);
    const button = files.find((file) => file.relative === 'components/button/Button.tsx');
    expect(button).toBeDefined();
    expect(button?.content).toContain("from '../../utils/cn'");
    expect(rewriteSupportImports(button?.content ?? '')).toContain("from '../utils/cn'");
    expect(support.has('utils')).toBe(true);
    expect(files.some((file) => file.relative.includes('.test.'))).toBe(false);
  });

  it('collects sibling components referenced by the entry component', () => {
    const { components } = collectComponentSource(sourceRoot, 'form-field');
    expect(components).toContain('form-field');
    expect(components).toContain('label');
    expect(components).toContain('tooltip');
  });

  it('rewrites types imports as well as utils imports', () => {
    expect(rewriteSupportImports("import type { X } from '../../types/manifest';")).toBe(
      "import type { X } from '../types/manifest';"
    );
  });

  it('leaves package and relative component imports untouched', () => {
    const source = "import { cn } from '../utils/cn';\nimport { Input } from '../input/Input';";
    expect(rewriteSupportImports(source)).toBe(source);
  });
});
