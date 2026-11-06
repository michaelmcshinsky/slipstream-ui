const preset = require('../../../tooling/tailwind-config/tailwind.config.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [preset],
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    '../../../packages/core/src/**/*.{ts,tsx}',
    '../../../packages/ai/src/**/*.{ts,tsx}',
  ],
};
