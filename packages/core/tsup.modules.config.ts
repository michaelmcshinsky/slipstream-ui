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
function entryKey(source: string) {
  return path
    .relative('src', source)
    .split(path.sep)
    .join('/')
    .replace(/\.(ts|tsx)$/, '');
}

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
          entries[entryKey(source)] = source;
        }
        continue;
      }
      const file = entry.name;
      if (!entry.isFile() || !/\.(ts|tsx)$/.test(file) || /\.(test|spec)\./.test(file) || file.endsWith('.d.ts')) continue;
      const source = path.join(root, file);
      entries[entryKey(source)] = source;
    }
  }

  return entries;
}

export default defineConfig({
  entry: componentEntries(),
  // Emit beside the tsc declarations so the `./*` export map resolves to
  // dist/src/components/<dir>/index.{mjs,js,d.ts}. The fix-module-extensions
  // pass then runs over the emitted ESM/CJS files.
  outDir: 'dist/src',
  format: ['esm', 'cjs'],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: false,
  bundle: false,
  external: ['react', 'react-dom'],
});
