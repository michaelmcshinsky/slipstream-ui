const deepMerge = require('deepmerge');
const plugin = require('tailwindcss/plugin');

function arrayMergeFn(destinationArray, sourceArray) {
  return destinationArray.concat(sourceArray).reduce((acc, cur) => {
    if (acc.includes(cur)) return acc;
    return [...acc, cur];
  }, []);
}

const slipstreamConfig = {
  darkMode: 'class',
  safelist: [
    {
      pattern: /w-/,
      variants: [
        'xs',
        'sm',
        'md',
        'lg',
        'xl',
        '2xl',
        '3xl',
        '4xl',
        '5xl',
        'full',
        'none',
        '0',
        'min',
        'max',
        '6xl',
        '7xl',
        'prose',
        'screen-sm',
        'screen-md',
        'screen-lg',
        'screen-xl',
        'screen-2xl',
      ],
    },
    {
      pattern: /max-w-/,
    },
    {
      pattern: /bg-(black|white|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900)/,
      variants: [
        'peer-checked',
        'dark',
        'group',
        'group-hover',
        'group-active',
        'group-focus',
      ],
    },
    {
      pattern: /text-(black|white|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900)/,
      variants: ['dark'],
    },
    {
      pattern: /rounded/,
    },
    {
      pattern: /align-/,
    },
    {
      pattern: /order-/,
    },
    {
      pattern: /duration-/,
    },
    {
      pattern: /block/,
      variants: ['sm', 'md', 'lg', 'xl', '2xl'],
    },
    {
      pattern: /hidden/,
      variants: ['sm', 'md', 'lg', 'xl', '2xl'],
    },
  ],
  plugins: [
    require('@tailwindcss/forms'),
    plugin(function ({ addComponents, addVariant }) {
      addVariant('backgroundColor', [
        '&:active',
        '&:checked',
        '&:even',
        '&:focus',
        '&:group-active',
        '&:group-focus',
        '&:group-hover',
        '&:odd',
      ]);
      addVariant('borderColor', [
        '&:active',
        '&:checked',
        '&:focus',
        '&:group-focus',
        '&:group-hover',
        '&:group-hover',
        '&:last',
      ]);
      addVariant('borderWidth', [
        '&:first',
        '&:last',
        '&:active',
        '&:hover',
        '&:focus',
      ]);
      addVariant('gridAutoColumns', ['&:hover', '&:focus']);
      addVariant('outline', ['&:hover', '&:active', '&:focus']);
      addVariant('outlineWidth', ['&:hover', '&:active', '&:focus']);
      addVariant('outlineStyle', ['&:hover', '&:active', '&:focus']);
      addVariant('position', ['&:hover', '&:active', '&:focus']);
      addVariant('zIndex', ['&:hover', '&:active', '&:focus']);

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
        '.after\\:w-6::after': { content: '""', width: '1.4rem' },
        '.after\\:h-6::after': { content: '""', height: '1.4rem' },
        '.after\\:w-8::after': { content: '""', width: '2rem' },
        '.after\\:h-8::after': { content: '""', height: '2rem' },
        '.peer:checked ~ .peer-checked\\:bg-blue-500': {
          '--tw-bg-opacity': '1',
          backgroundColor: 'rgb(59, 130, 246, var(--tw-bg-opacity))',
        },
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
          '--tw-translate-x': '.9rem',
          transform: 'matrix(1, 0, 0, 1, 16, 0)',
        },
        '.peer:checked ~ .peer-checked\\:after\\:translate-x-5::after': {
          content: '""',
          '--tw-translate-x': '1.2rem',
          transform: 'matrix(1, 0, 0, 1, 20, 0)',
        },
        '.peer:checked ~ .peer-checked\\:after\\:translate-x-6::after': {
          content: '""',
          '--tw-translate-x': '1.4rem',
          transform: 'matrix(1, 0, 0, 1, 24, 0)',
        },
        '.sui--input-group_prepend + .sui--input': {
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        },
        '.sui--input-group .sui--input:not(:last-child)': {
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        },
        '.ReactModal__Overlay': {
          opacity: 0,
        },
        '.ReactModal__Overlay--after-open': {
          opacity: 1,
        },
        '.ReactModal__Overlay--before-close': {
          opacity: 0,
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
  return deepMerge({ ...tailwindConfig }, slipstreamConfig, {
    arrayMerge: arrayMergeFn,
  });
}

module.exports = wrapper;
