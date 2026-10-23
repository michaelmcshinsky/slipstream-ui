import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', '@slipstream-ui/core'],
  // Every exported component is interactive; esbuild drops per-module 'use
  // client' directives when bundling, so mark the whole bundle explicitly.
  banner: {
    js: "'use client';",
  },
})
