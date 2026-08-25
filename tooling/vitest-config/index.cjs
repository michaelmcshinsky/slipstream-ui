const react = require('@vitejs/plugin-react').default ?? require('@vitejs/plugin-react');

/**
 * Shared vitest config for component packages.
 * Assumes jsdom environment and per-package setupFiles.
 */
function createTestConfig({ setupFiles = [] } = {}) {
  return {
    plugins: [react()],
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles,
      include: ['src/**/*.test.{ts,tsx}'],
      css: false,
    },
  };
}

module.exports = { createTestConfig };
module.exports.default = createTestConfig;
