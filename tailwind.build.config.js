/** Tailwind config for building the library's prebuilt dist/styles.css.
 *  Consumers using slipstream-ui/config get the full safelist via config.js. */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  plugins: [require('@tailwindcss/forms')],
  corePlugins: {
    preflight: true,
  },
};
