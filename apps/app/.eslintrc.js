module.exports = {
  extends: ['@slipstream-ui/eslint-config', 'next/core-web-vitals'],
  rules: {
    // Docs pages are prose-heavy; escaping every apostrophe harms readability.
    'react/no-unescaped-entities': 'off',
  },
};
