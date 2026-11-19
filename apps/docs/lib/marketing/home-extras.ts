/**
 * New homepage sections that are not yet localized.
 *
 * Copy lives here (rather than in `marketing/*`) so the English source is
 * shared by the page and its FAQPage JSON-LD. Translators can add a locale
 * override later without changing the layout.
 */
export type HomeExtras = {
  install: {
    eyebrow: string;
    title: string;
    description: string;
    steps: { title: string; body: string }[];
    command: string;
    freeTitle: string;
    freeBody: string;
    freeItems: { label: string; value: string }[];
    freeNote: string;
    licenseLink: string;
  };
  faq: {
    title: string;
    intro: string;
    items: { question: string; answer: string }[];
  };
  benchmarkNote: string;
  benchmarkHref: string;
};

const REPO = 'https://github.com/michaelmcshinsky/slipstream-ui';

export const HOME_EXTRAS: HomeExtras = {
  install: {
    eyebrow: 'Start building',
    title: 'Start building in minutes',
    description:
      'One command scaffolds the theme, component directory and registry config. Then take the path that fits your stack — package imports or owned source.',
    steps: [
      {
        title: 'Run the CLI',
        body: 'npx @slipstream-ui/cli@latest init adds the theme, the component directory and the registry config.',
      },
      {
        title: 'Pick components',
        body: 'Browse the catalog, then add source with the CLI or the shadcn-compatible registry. You own the files.',
      },
      {
        title: 'Install dependencies',
        body: 'The CLI reports peer packages. Package imports need only react and react-dom.',
      },
      {
        title: 'Set your theme',
        body: 'Edit the CSS variables or call createTheme() once; light, dark and presets use the same tokens.',
      },
      {
        title: 'Verify with your agent',
        body: 'Point Claude Code, Cursor, Copilot or Codex at the MCP server and run validate_usage before merging.',
      },
    ],
    command: 'npx @slipstream-ui/cli@latest init',
    freeTitle: 'What is free',
    freeBody:
      'Everything in the open-source project is MIT licensed. No account, seat or paywall gates the components, CLI, registry or MCP server.',
    freeItems: [
      { label: 'Components', value: 'MIT' },
      { label: 'CLI', value: 'MIT' },
      { label: 'MCP server', value: 'MIT' },
      { label: 'Registry', value: 'Public' },
      { label: 'Templates', value: 'MIT' },
      { label: 'Account required', value: 'No' },
    ],
    freeNote:
      'If commercial support or hosted tooling is offered later, it will be announced separately and will not remove anything that is MIT today.',
    licenseLink: `${REPO}/blob/main/LICENSE`,
  },
  faq: {
    title: 'Questions developers ask first',
    intro: 'The short answers, with links to the pages that go deeper.',
    items: [
      {
        question: 'Is Slipstream UI free?',
        answer:
          'Yes. The packages, CLI, registry and MCP server are MIT licensed. There is no paid tier today and no account requirement.',
      },
      {
        question: 'How is this different from shadcn/ui?',
        answer:
          'shadcn gives you source you own. Slipstream adds a machine-readable manifest per component, an MCP server, and validate_usage, so an agent can read the contract and check generated JSX. The registry and CLI copy source the same way.',
      },
      {
        question: 'Does it work with my stack?',
        answer:
          'React 18 or 19 with Next.js App Router, Next.js Pages Router, Vite, Remix or Astro. Tailwind CSS 3.4, Tailwind 4, or the prebuilt stylesheets. The compatibility page records what is tested.',
      },
      {
        question: 'What does validate_usage actually catch?',
        answer:
          'Unknown props, missing required props, invalid enum values, documented composition violations, and icon-only controls without an accessible name. It is static: it does not prove runtime behaviour, visual correctness or WCAG conformance.',
      },
      {
        question: 'Do I need an MCP client?',
        answer:
          'No. Docs, copy-paste, the registry and package imports work without an agent. MCP is optional and additive.',
      },
    ],
  },
  benchmarkNote:
    'Measured on 100 reviewed cases: 65.7% structural recall, 100% precision, 0 false positives on valid usage.',
  benchmarkHref: `${REPO}/blob/main/docs/benchmarks.md`,
};
