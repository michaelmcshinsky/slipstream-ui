const base = require('../../tooling/tailwind-config/tailwind.config.js')

/**
 * Prebuilt stylesheet config: utilities only, no preflight. Consumers that
 * already own their base styles can import `@slipstream-ui/core/styles.css`
 * without a Tailwind build and without Tailwind resetting their document.
 */
module.exports = {
  ...base,
  content: ['./src/**/*.{ts,tsx}'],
  corePlugins: {
    ...base.corePlugins,
    preflight: false,
  },
}
