import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { collectComponentSource } from './commands/add';
import { rewriteSupportImports } from './source';

const sourceRoot = path.resolve(__dirname, '../../core/src');

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
