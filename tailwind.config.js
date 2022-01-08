const slipstreamConfig = require('./config');

module.exports = slipstreamConfig({
  content: [
    './config.js',
    './src/**/*.{js,jsx,ts,tsx}',
    './src/theme/defaults.ts',
    './node_modules/tailwindcss/src/css/',
  ],
})
