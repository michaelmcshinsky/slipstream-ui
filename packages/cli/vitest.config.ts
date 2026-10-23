import { defineConfig } from 'vitest/config';

// Own config (not the repo root's): the root vitest.config.ts belongs to the
// legacy flat-library layer and would otherwise be inherited upward, breaking
// fresh runs that lack its setup file.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
