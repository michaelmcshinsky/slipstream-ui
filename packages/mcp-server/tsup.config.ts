import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  shims: true,
  // Bundle the workspace registry module so the published server is self-contained.
  noExternal: ['@slipstream-ui/registry'],
  banner: {
    js: '#!/usr/bin/env node',
  },
})
