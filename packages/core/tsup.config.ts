import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  // Preserve the 'use client' directive in ESM output so Next.js treats the
  // built package as a client boundary (createContext/hooks require it).
  // CJS output omits the banner — it would break module.exports resolution
  // during prerendering.
  esbuildOptions(options, context) {
    if (context.format === 'esm') {
      options.banner = { js: "'use client';" }
    }
  },
})
