export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  options: {
    storySort: {
      order: [
        'Components',
        ['General', 'Forms', 'Layout', 'Navigation', 'Overlays', 'Elements'],
      ],
    },
  },
};
