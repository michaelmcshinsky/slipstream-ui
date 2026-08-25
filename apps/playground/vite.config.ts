import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@slipstream-ui/core': path.resolve(__dirname, '../../packages/core/src'),
      '@slipstream-ui/ai': path.resolve(__dirname, '../../packages/ai/src'),
      '@slipstream-ui/themes': path.resolve(__dirname, '../../packages/themes/src'),
    },
  },
});
