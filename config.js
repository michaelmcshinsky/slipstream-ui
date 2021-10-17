const deepMerge = require('deepmerge');
const plugin = require('tailwindcss/plugin');
const customFormsPlugin = require('@tailwindcss/forms');
const stylesPlugin = require('./config-plugin');

function arrayMergeFn(destinationArray, sourceArray) {
  return destinationArray.concat(sourceArray).reduce((acc, cur) => {
    if (acc.includes(cur)) return acc;
    return [...acc, cur];
  }, []);
}

const slipstreamConfig = {
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {},
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active', 'checked', 'even', 'odd'],
      borderColor: ['active', 'checked', 'last', 'focus'],
      borderWidth: ['first', 'last', 'active', 'hover', 'focus'],
      gridAutoColumns: ['hover', 'focus'],
      outline: ['hover', 'active', 'focus'],
      zIndex: ['hover', 'active', 'focus'],
    },
  },
  plugins: [
    customFormsPlugin,
    plugin(function ({ addComponents }) {
      addComponents(stylesPlugin);
    }),
  ],
};

/**
 * Merge slipstream-ui and Tailwind CSS configurations
 * @param {object} tailwindConfig - Tailwind config object
 * @return {object} new config object
 */
function wrapper(tailwindConfig) {
  let purge;
  if (Array.isArray(tailwindConfig.purge)) {
    purge = {
      content: tailwindConfig.purge,
    };
  } else {
    purge = tailwindConfig.purge;
  }
  return deepMerge({ ...tailwindConfig, purge }, slipstreamConfig, {
    arrayMerge: arrayMergeFn,
  });
}

module.exports = wrapper;
