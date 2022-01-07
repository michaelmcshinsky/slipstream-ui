const slipstreamConfig = require('./config');

module.exports = slipstreamConfig({
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './src/theme/defaults.ts',
    './node_modules/tailwindcss/src/css/',
  ],
})
