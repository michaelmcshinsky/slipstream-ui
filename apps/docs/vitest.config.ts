import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  // The docs tsconfig extends the Next preset (`jsx: preserve`), so tests need
  // the React plugin to transform JSX for vitest.
  plugins: [react()],
  resolve: {
    alias: { '@': dirname },
  },
  test: {
    environment: 'jsdom',
    include: ['lib/**/*.test.ts', 'lib/**/*.test.tsx', 'components/**/*.test.ts', 'components/**/*.test.tsx'],
    restoreMocks: true,
  },
});
