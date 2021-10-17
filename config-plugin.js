module.exports = {
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
  '.after\\:rounded-full::after': { content: '""', borderRadius: '9999px' },
  '.after\\:w-6::after': { content: '""', width: '1.5rem' },
  '.after\\:h-6::after': { content: '""', height: '1.5rem' },
  '.peer:checked ~ .peer-checked\\:bg-blue-500': {
    '--tw-bg-opacity': '1',
    backgroundColor: 'rgba(59, 130, 246, var(--tw-bg-opacity))',
  },
  '.peer:checked ~ .peer-checked\\:after\\:translate-x-6::after': {
    content: '""',
    '--tw-translate-x': '1.5rem',
    transform: 'matrix(1, 0, 0, 1, 24, 0)',
  },
};
