import deepMerge from 'deepmerge';
import customFormsPlugin from '@tailwindcss/forms';

function arrayMergeFn(destinationArray: any[], sourceArray: any[]) {
  return destinationArray.concat(sourceArray).reduce((acc, cur) => {
    if (acc.includes(cur)) return acc;
    return [...acc, cur];
  }, []);
}

const slipstreamConfig = {
  purge: ['./components/**/*.tsx', './pages/**/*.tsx'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {},
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active', 'checked', 'even'],
      borderColor: ['active', 'checked'],
      borderRadius: ['first', 'last'],
      gridAutoColumns: ['hover', 'focus'],
      outline: ['hover', 'active'],
    },
  },
  plugins: [customFormsPlugin],
};

/**
 * Merge slipstream-ui and Tailwind CSS configurations
 * @param {object} tailwindConfig - Tailwind config object
 * @return {object} new config object
 */
export function wrapper(tailwindConfig: any) {
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
