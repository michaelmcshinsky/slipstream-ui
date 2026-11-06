module.exports = {
  extends: ['@slipstream-ui/eslint-config', 'next/core-web-vitals'],
  rules: {
    'react/no-unescaped-entities': 'off',
  },
  ignorePatterns: ['.next/'],
};
