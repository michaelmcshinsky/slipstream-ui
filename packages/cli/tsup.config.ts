import { readFileSync } from 'node:fs';
import { defineConfig } from 'tsup'

// Bake the package version at build time so the binary never drifts from the manifest.
const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf-8')
) as { version: string };

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  shims: true,
  // Bundle the workspace registry module so the published CLI is self-contained.
  noExternal: ['@slipstream-ui/registry'],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  banner: {
    js: '#!/usr/bin/env node',
  },
})
