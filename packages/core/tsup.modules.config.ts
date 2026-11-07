import { readdirSync } from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'tsup';

/**
 * Per-file modules for subpath imports.
 *
 * Each output keeps the source file's own 'use client' directive, so
 * `@slipstream-ui/core/card` renders in a server component while
 * `@slipstream-ui/core/dialog` remains a client boundary.
 */
function componentEntries() {
  const entries: Record<string, string> = {};
  const roots = ['src/components', 'src/utils', 'src/types'];

  for (const root of roots) {
    for (const entry of readdirSync(root, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        const dir = path.join(root, entry.name);
        for (const file of readdirSync(dir)) {
          if (!/\.(ts|tsx)$/.test(file) || /\.(test|spec)\./.test(file) || file.endsWith('.d.ts')) continue;
          const source = path.join(dir, file);
          const key = source.replace(/^src\//, '').replace(/\.(ts|tsx)$/, '');
          entries[key] = source;
        }
        continue;
      }
      const file = entry.name;
      if (!entry.isFile() || !/\.(ts|tsx)$/.test(file) || /\.(test|spec)\./.test(file) || file.endsWith('.d.ts')) continue;
      const source = path.join(root, file);
      const key = source.replace(/^src\//, '').replace(/\.(ts|tsx)$/, '');
      entries[key] = source;
    }
  }

  return entries;
}

export default defineConfig({
  entry: componentEntries(),
  outDir: 'dist',
  format: ['esm', 'cjs'],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: false,
  bundle: false,
  external: ['react', 'react-dom'],
});
