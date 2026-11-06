module.exports = {
  extends: ['@slipstream-ui/eslint-config', 'next/core-web-vitals'],
  rules: {
    '@typescript-eslint/no-require-imports': 'off',
    // Docs pages are prose-heavy; escaping every apostrophe harms readability.
    'react/no-unescaped-entities': 'off',
  },
};
