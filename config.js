const deepMerge = require('deepmerge');
const plugin = require('tailwindcss/plugin');
const customFormsPlugin = require('@tailwindcss/forms');

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
      addComponents({
        '.inline-flex': {
          display: 'inline-flex',
        },
        '.numbered': {
          '&:before': {
            content: "counters(section, '.') '. '",
            'counter-increment': 'section',
          },
        },
        '.after\\:duration-300::after': {
          content: '""',
          transitionDuration: '300ms',
        },
        '.after\\:shadow-md::after': {
          content: '""',
          '--tw-shadow':
            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          boxShadow:
            'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)',
        },
        '.after\\:bg-white::after': {
          content: '""',
          '--tw-bg-opacity': '1',
          backgroundColor: 'rgba(255, 255, 255, var(--tw-bg-opacity))',
        },
        '.after\\:rounded-full::after': {
          content: '""',
          borderRadius: '9999px',
        },
        '.after\\:w-5::after': { content: '""', width: '1.25rem' },
        '.after\\:h-5::after': { content: '""', height: '1.25rem' },
        '.after\\:w-6::after': { content: '""', width: '1.5rem' },
        '.after\\:h-6::after': { content: '""', height: '1.5rem' },
        '.after\\:w-8::after': { content: '""', width: '2rem' },
        '.after\\:h-8::after': { content: '""', height: '2rem' },
        '.peer:checked ~ .peer-checked\\:bg-gray-500': {
          '--tw-bg-opacity': '1',
          backgroundColor: 'rgba(107, 114, 128, var(--tw-bg-opacity))',
        },
        '.peer:checked ~ .peer-checked\\:bg-red-500': {
          '--tw-bg-opacity': '1',
          backgroundColor: 'rgba(239, 68, 68, var(--tw-bg-opacity))',
        },
        '.peer:checked ~ .peer-checked\\:bg-yellow-500': {
          '--tw-bg-opacity': '1',
          backgroundColor: 'rgba(245, 158, 11, var(--tw-bg-opacity))',
        },
        '.peer:checked ~ .peer-checked\\:bg-green-500': {
          '--tw-bg-opacity': '1',
          backgroundColor: 'rgba(16, 185, 129, var(--tw-bg-opacity))',
        },
        '.peer:checked ~ .peer-checked\\:bg-blue-500': {
          '--tw-bg-opacity': '1',
          backgroundColor: 'rgba(59, 130, 246, var(--tw-bg-opacity))',
        },
        '.peer:checked ~ .peer-checked\\:bg-indigo-500': {
          '--tw-bg-opacity': '1',
          backgroundColor: 'rgba(99, 102, 241, var(--tw-bg-opacity))',
        },
        '.peer:checked ~ .peer-checked\\:bg-purple-500': {
          '--tw-bg-opacity': '1',
          backgroundColor: 'rgba(139, 92, 246, var(--tw-bg-opacity))',
        },
        '.peer:checked ~ .peer-checked\\:bg-pink-500': {
          '--tw-bg-opacity': '1',
          backgroundColor: 'rgba(236, 72, 153, var(--tw-bg-opacity))',
        },
        '.peer:checked ~ .peer-checked\\:after\\:translate-x-4::after': {
          content: '""',
          '--tw-translate-x': '1rem',
          transform: 'var(--tw-transform)',
        },
        '.peer:checked ~ .peer-checked\\:after\\:translate-x-6::after': {
          content: '""',
          '--tw-translate-x': '1.5rem',
          transform: 'matrix(1, 0, 0, 1, 24, 0)',
        },
      });
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
