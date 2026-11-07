import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  // Root import stays a client bundle for compatibility. Server-safe subpath
  // imports are built by tsup.modules.config.ts.
  esbuildOptions(options, context) {
    if (context.format === 'esm') {
      options.banner = { js: "'use client';" }
    }
  },
})
