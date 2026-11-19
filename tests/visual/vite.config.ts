import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/**
 * Isolated fixture for visual regression. It consumes the built packages the
 * way a consumer does (prebuilt CSS + workspace components), so a layout
 * regression in the shell shows up here rather than in a consumer's app.
 */
export default defineConfig({
  plugins: [react()],
  server: { port: 4180, strictPort: true },
  preview: { port: 4180, strictPort: true },
});
