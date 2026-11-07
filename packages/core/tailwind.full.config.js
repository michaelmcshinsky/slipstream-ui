const base = require('../../tooling/tailwind-config/tailwind.config.js')

/**
 * Prebuilt stylesheet config with preflight. Use `styles-full.css` when the
 * host app does not already provide a reset.
 */
module.exports = {
  ...base,
  content: ['./src/**/*.{ts,tsx}'],
  corePlugins: {
    ...base.corePlugins,
    preflight: true,
  },
}
