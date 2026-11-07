const path = require('node:path');
const react = require('@vitejs/plugin-react').default ?? require('@vitejs/plugin-react');

/**
 * Shared vitest config for component packages.
 * Assumes jsdom environment and per-package setupFiles.
 */
function createTestConfig({ setupFiles = [], test = {} } = {}) {
  return {
    plugins: [react()],
    cacheDir: path.join(process.cwd(), '.vitest-cache'),
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles,
      include: ['src/**/*.test.{ts,tsx}'],
      css: false,
      ...test,
    },
  };
}

module.exports = { createTestConfig };
module.exports.default = createTestConfig;
