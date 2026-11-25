import type { MarketingCopy } from './types';

export const en: MarketingCopy = {
  home: {
    whatsNew: "what's new →",
    aiFirstBadge: 'AI-first · MIT',
    reactBadge: 'React 18+',
    heroTitleLead: 'Your AI already knows',
    heroTitleHighlight: 'your design system',
    heroDescription:
      'Slipstream UI is the AI-first component system built for AI-assisted development. Every component ships a machine-readable spec, an MCP server that serves it, and a validator that keeps agents honest.',
    getStarted: 'Get Started',
    starOnGithub: 'Star on GitHub',
    copy: 'copy',
    copied: 'copied',
    liveDemoNote: 'live demo · built entirely from Slipstream UI',
    welcomeTitle: 'Ask about Slipstream',
    welcomeSuggestions: ['What makes it different?', 'How does the manifest work?'],
    promptPlaceholder: 'Try me…',
    send: 'Send',
    agentStripLabel: 'Speaks fluently to',
    stats: ['components', 'machine-readable specs', 'MCP tools for agents', 'false positives on valid usage'],
    featuresHeading: 'Built for the way software is written now',
    featuresIntro:
      'Half your UI is written by models. Slipstream gives them something better than docs scraped from training data: a spec they can query, and a guardrail they can self-check against.',
    features: [
      {
        title: 'Machine-readable manifests',
        body: 'Every component ships a COMPONENT_MANIFEST: exact prop schema, defaults, anti-patterns, accessibility requirements, composition rules.',
      },
      {
        title: 'validate_usage MCP tool',
        body: 'Agents validate generated JSX against the manifest before emitting. Hallucinated props and missing requireds can be caught, not shipped.',
      },
      {
        title: 'shadcn-compatible registry',
        body: 'Install real source files through any shadcn-compatible CLI, or use packages. Your codebase, your rules.',
      },
      {
        title: 'Fully stateless',
        body: 'No runtime lock-in. Bring any backend: Vercel AI SDK, LangGraph, or raw streams. Components render; you own state.',
      },
      {
        title: 'Accessibility, tested',
        body: 'jest-axe suites on every component, aria-busy streaming states, polite completion announcements, reduced-motion variants.',
      },
      {
        title: 'Themeable to the token',
        body: 'One createTheme() call emits every CSS variable. Radius, dark mode, instant switching. No rebuilds.',
      },
    ],
    howHeading: 'How your AI uses it',
    howIntro: 'Three steps, no fine-tuning, no prompt incantations.',
    steps: [
      {
        title: 'Connect',
        body: 'Point Claude Code or Cursor at the Slipstream MCP server, or serve llms.txt and the /llm markdown routes.',
      },
      {
        title: 'Query the spec',
        body: 'The agent calls get_component_manifest and get_usage_examples: exact props, defaults, anti-patterns.',
      },
      {
        title: 'Self-validate',
        body: 'Before emitting, validate_usage checks the generated JSX against the manifest and corrects hallucinated props.',
      },
    ],
    validatorHeading: 'The failure mode, caught',
    validatorIntroBefore: 'An agent guesses',
    validatorIntroAfter:
      'checks the manifest and refuses the snippet before it is written.',
    validatorCards: [
      { title: '1. Hallucinated usage', note: 'The prop does not exist, and the required onSubmit is missing.' },
      {
        title: '2. validate_usage response',
        note: 'Trimmed for display; the tool also returns the manifest anti-patterns.',
      },
      {
        title: '3. Correct usage',
        note: 'Validated against the same contract your docs, MCP server, and registry serve.',
      },
    ],
    themesHeading: 'Themes that ship with the library',
    themesIntro:
      'Default, Violet, and Zinc presets included. Switch below. This is live theming, not a screenshot.',
    comparisonHeading: 'How it compares',
    comparisonIntro: 'Other libraries document for humans. Slipstream documents for both of you.',
    comparisonCapability: 'Capability',
    comparisonCapabilities: [
      'Distribution model',
      'Components shipped',
      'Per-component machine-readable spec',
      'MCP server',
      'Validates generated JSX against the spec',
      'llms.txt',
      'Canonical markdown per component/page',
      'AI chat components',
      'State & transport',
      'Styling',
      'Theme presets',
      'Peer dependencies',
      'License',
    ],
    comparisonFootnote:
      'Reflects each project public documentation and published packages as of November 2026 · ✅ provided · 🟡 partial or a different model ·: not provided for this purpose',
    comparisonCards: [
      {
        title: 'Choose Slipstream',
        body: 'When agents must generate correct, design-system-compliant code and you want a validator in the loop before code ships.',
      },
      {
        title: 'Choose shadcn/ui + AI Elements',
        body: 'When the largest ecosystem and copy-in ownership of a very large primitive base matter most.',
      },
      {
        title: 'Choose assistant-ui',
        body: 'When you need a battle-tested chat runtime: streaming, tools, and generative UI as the core product.',
      },
    ],
    comparisonRows: [
      {
        slipstream: 'npm packages (ESM + CJS)',
        shadcn: 'copy-in source via CLI',
        assistantUi: 'npm packages',
        mui: 'npm packages',
      },
      {
        slipstream: '{componentCount} ({coreComponentCount} UI + {aiComponentCount} AI)',
        shadcn: 'UI primitives + AI Elements',
        assistantUi: 'Chat surface + primitives',
        mui: 'Broad UI set, no chat',
      },
      {
        slipstream: 'Yes: props, a11y, anti-patterns',
        shadcn: 'Partial: registry.json (files, deps)',
        assistantUi: 'No',
        mui: 'No',
      },
      {
        slipstream: 'Yes: 6 tools incl. validate_usage',
        shadcn: 'Partial: browse/search/install',
        assistantUi: 'No',
        mui: 'Partial: agent skills',
      },
      { slipstream: 'Yes: validate_usage', shadcn: 'No', assistantUi: 'No', mui: 'No' },
      { slipstream: 'Yes', shadcn: 'Yes', assistantUi: 'Yes', mui: 'No' },
      {
        slipstream: 'Yes: /llm/*.md',
        shadcn: 'Partial: MDX in repo',
        assistantUi: 'Yes: .md pages',
        mui: 'No',
      },
      {
        slipstream: 'Yes: {aiComponentCount} built-in',
        shadcn: 'Yes: AI Elements (separate)',
        assistantUi: 'Yes: core focus',
        mui: 'No',
      },
      {
        slipstream: 'Stateless: bring your own',
        shadcn: 'Components only',
        assistantUi: 'Runtime adapters (AI SDK, LangGraph, custom)',
        mui: 'n/a: no chat components',
      },
      {
        slipstream: 'Tailwind + CSS variables',
        shadcn: 'Tailwind + CSS variables',
        assistantUi: 'Tailwind',
        mui: 'Emotion + theme object',
      },
      {
        slipstream: '4 (Default, Dark, Violet, Zinc)',
        shadcn: 'CSS-variable themes',
        assistantUi: 'CSS variables',
        mui: 'theme object',
      },
      {
        slipstream: 'react, react-dom',
        shadcn: 'react',
        assistantUi: 'react',
        mui: 'react, @emotion/react, @emotion/styled',
      },
      { slipstream: 'MIT', shadcn: 'MIT', assistantUi: 'MIT', mui: 'MIT' },
    ],
    templatesHeading: 'Start from a template',
    templatesIntro: 'Complete, copy-paste patterns built entirely from Slipstream components.',
    browseTemplates: 'Browse all templates →',
    templates: [
      { name: 'Streaming chat', body: 'Markdown responses, stop-generation, scroll pinning, feedback actions.' },
      { name: 'Agent dashboard', body: 'Tool calls with human-in-the-loop approval, reasoning steps, task progress.' },
      { name: 'RAG citations', body: 'Grounded answers with inline citation chips and a sources footer.' },
    ],
    agentPathTitle: 'For agent builders →',
    agentPathBody:
      'Wire the MCP server into Claude Code or Cursor, run validate_usage before emit, or serve llms.txt and markdown routes: six tools, three consumption paths.',
    productPathTitle: 'For product teams →',
    productPathBody:
      'Ship the production chat surface (streaming markdown, stop-generation, citations, approvals) with stateless components, jest-axe coverage, and your own backend.',
    ctaHeading: 'Ship AI interfaces faster',
    ctaBody:
      '{componentCount} components · {componentCount} machine-readable specs · validate generated usage before it ships.',
    startBuilding: 'Start building',
    demo: {
      you: 'You',
      assistant: 'Assistant',
      initialMessage: 'What makes Slipstream UI different?',
      reply: `Slipstream UI ships **{componentCount} production-ready components** ({coreComponentCount} core + {aiComponentCount} AI), each with a machine-readable \`COMPONENT_MANIFEST\`.

The live lab on this page runs the real library: DataTable selection + pagination, MetricCard, SelectMenu, InputGroup, ButtonGroup, ConfirmDialog, Drawer, imperative toasts and the Stepper.

Your agent queries the same manifests over MCP, reads the prop schema and anti-patterns, then validates its own output before emitting code. Correct UI on the first try.`,
      anyMcpClient: 'Any MCP client',
      transcriptLabel: 'Conversation transcript',
      responseComplete: 'Response complete.',
    },
    lab: {
      eyebrow: 'Live demo',
      title: 'The framework, running on this page',
      description:
        'Every control below is a Slipstream component, including selection, pagination, menus, overlays, toasts and wizards. No screenshots.',
      footer:
        'Every component ships a COMPONENT_MANIFEST, tests and a live docs page. This lab is the same library your agent queries over MCP.',
      tabs: { data: 'Data', forms: 'Forms', overlays: 'Overlays', flow: 'Flow' },
      data: {
        caption: 'Automation runs',
        activeRuns: 'Active runs',
        thisWeek: 'this week',
        selected: 'Selected',
        selectedOne: '{count} selected',
        selectedOther: '{count} selected',
        useTheCheckboxes: 'use the checkboxes',
        successRate: 'Success rate',
        vsLastWeek: 'vs last week',
        columns: { workflow: 'Workflow', status: 'Status', owner: 'Owner', seats: 'Seats' },
        runs: {
          onboardingEmails: 'Onboarding emails',
          invoiceSync: 'Invoice sync',
          churnScoring: 'Churn scoring',
          weeklyDigest: 'Weekly digest',
          leadEnrichment: 'Lead enrichment',
          accessReview: 'Access review',
        },
        statuses: { success: 'success', warning: 'warning', info: 'info' },
        archive: 'Archive',
        clear: 'Clear',
        archivedOne: '{count} run archived',
        archivedOther: '{count} runs archived',
      },
      forms: {
        selectMenuCaption: 'SelectMenu: rich options, groups',
        inputGroupCaption: 'InputGroup: flush addons',
        buttonGroupCaption: 'ButtonGroup: joined segments',
        planLabel: 'Plan',
        domainLabel: 'Site domain',
        viewModeLabel: 'View mode',
        views: { list: 'List', board: 'Board', calendar: 'Calendar' },
        plans: {
          free: { label: 'Free', description: '1 project, community support' },
          pro: { label: 'Pro', description: 'Unlimited projects, priority support' },
          team: { label: 'Team', description: 'SSO, audit log, shared billing' },
        },
        planGroups: { individual: 'Individual', business: 'Business' },
        summary: 'plan: {plan} · view: {view} · domain: {domain}',
      },
      overlays: {
        deleteProject: 'Delete project…',
        openDrawer: 'Open drawer',
        description:
          'ConfirmDialog handles focus trap, Escape and an async pending state; toasts are imperative (toast.success()) and stack above every overlay.',
        confirmTitle: 'Delete project?',
        confirmDescription: 'This permanently removes the project and its runs. This cannot be undone.',
        confirm: 'Delete',
        deleted: 'Project deleted',
        savedTitle: 'Saved',
        savedBody: 'Your changes are live',
        rateLimitedTitle: 'Rate limited',
        rateLimitedBody: 'Retrying in 3s',
        headsUpTitle: 'Heads up',
        headsUpBody: 'New version available',
        drawerTitle: 'Filter runs',
        drawerDescription: 'Drawer with a form, Escape and backdrop dismissal.',
        noteLabel: 'Note',
        notePlaceholder: 'Only failed runs, last 24h…',
        apply: 'Apply',
        applied: 'Filter applied',
        noNote: 'No note added',
      },
      flow: {
        steps: {
          basics: { label: 'Basics', description: 'Name and owner' },
          access: { label: 'Access', description: 'Roles and SSO' },
          billing: { label: 'Billing', description: 'Plan and seats' },
          review: { label: 'Review' },
        },
        summary: 'Step {current} of {total}: {label}',
        descriptionSuffix: ' ({description})',
        back: 'Back',
        next: 'Next',
        states: { completed: ' (completed)', current: ' (current step)', upcoming: ' (upcoming)' },
      },
    },
  },
  about: {
    title: 'About Slipstream UI',
    description:
      'A small, open-source project with a single thesis: coding agents are users too, and they deserve machine-readable contracts.',
    updated: 'November 2026',
    sections: [
      {
        heading: 'Why this exists',
        blocks: [
          {
            type: 'p',
            text: 'AI coding assistants are good at writing React, and bad at remembering the exact prop names, required fields, and accessibility rules of a design system they have never seen. The usual fix is more prompt context or a bigger README. Both drift the moment a component changes.',
          },
          {
            type: 'p',
            text: 'Slipstream UI flips the direction: the source of truth ships with the code. Every one of the {componentCount} components carries a `COMPONENT_MANIFEST`; an MCP server serves those manifests, and `validate_usage` checks generated JSX against them before it reaches your editor.',
          },
        ],
      },
      {
        heading: 'Principles',
        blocks: [
          {
            type: 'ul',
            items: [
              '**Agents are first-class users.** A contract an agent can query is as important as a prop table a human can read.',
              '**Stateless by design.** Components render; you own state, transport, and data. No runtime lock-in, no hidden providers.',
              '**Accessibility is not a variant.** Keyboard behaviour, ARIA wiring, and reduced-motion paths are part of the component contract and are covered by jest-axe suites.',
              '**You own the code.** Install through npm packages or the shadcn-compatible registry and keep the source in your repository.',
            ],
          },
        ],
      },
      {
        heading: 'Who maintains it',
        blocks: [
          {
            type: 'p',
            text: 'Slipstream UI is built and maintained in the open by [Michael McShinsky]({githubProfile}). Issues, discussions, and pull requests are welcome in the [GitHub repository]({repo}).',
          },
          {
            type: 'p',
            text: 'Current version: `v{version}`. The project follows semantic versioning and publishes from CI with npm provenance.',
          },
        ],
      },
      {
        heading: 'How to verify the claims',
        blocks: [
          {
            type: 'ul',
            items: [
              '[Read a manifest](/docs/ai-manifests) and compare it with the component source.',
              '[Run the MCP server](/docs/mcp) and call `validate_usage` on a deliberately broken snippet.',
              '[Review the accessibility statement](/accessibility) and the automated audit scope.',
              '[Security policy]({repo}/blob/main/SECURITY.md) and [security.txt](/.well-known/security.txt).',
            ],
          },
        ],
      },
    ],
  },
  contact: {
    title: 'Contact',
    description: 'Reach the maintainers on GitHub: bug reports, questions, and security reports each have a dedicated channel.',
    channels: [
      {
        heading: 'Bug reports',
        body: 'Something broken or behaving unexpectedly? [Open an issue]({repo}/issues/new) with the page, the assistive technology or agent you used, and what you expected.',
        ctaLabel: 'Open an issue',
        ctaHref: '{repo}/issues/new',
      },
      {
        heading: 'Questions & ideas',
        body: 'Usage questions, feature ideas, and "does this exist?" all belong in [GitHub Discussions]({repo}/discussions).',
        ctaLabel: 'Start a discussion',
        ctaHref: '{repo}/discussions',
      },
      {
        heading: 'Security',
        body: 'Please do not file security vulnerabilities publicly. Follow the [security policy]({repo}/blob/main/SECURITY.md) for private reporting.',
        ctaLabel: 'Read SECURITY.md',
        ctaHref: '{repo}/blob/main/SECURITY.md',
      },
    ],
  },
  accessibility: {
    title: 'Accessibility statement',
    description:
      'Slipstream UI targets WCAG 2.2 Level AA for both the component library and this documentation site.',
    updated: 'November 2026',
    sections: [
      {
        heading: 'Conformance target',
        blocks: [
          {
            type: 'p',
            text: 'The component library and this site are developed against [WCAG 2.2 Level AA](https://www.w3.org/TR/WCAG22/). Accessibility regressions are treated as bugs, not enhancements.',
          },
          {
            type: 'p',
            text: 'This statement covers automated conformance evidence plus known gaps. It is not a claim of full manual conformance: assistive-technology testing with real users is ongoing.',
          },
        ],
      },
      {
        heading: 'How the library is tested',
        blocks: [
          {
            type: 'ul',
            items: [
              '**jest-axe suites** on every component, run in CI on each pull request.',
              '**Keyboard behaviour** implemented as part of the component contract (roving tabindex in composite widgets, Escape/arrow handling, visible focus rings).',
              '**Reduced motion** honoured by streaming indicators, drawers, dialogs, and scroll behaviours.',
              '**ARIA contracts** documented in each COMPONENT_MANIFEST and enforced by the same rules agents see over MCP.',
            ],
          },
          {
            type: 'p',
            text: 'Read the [accessibility guide for AI-generated UI](/docs/guides/accessibility-ai) for the per-component details.',
          },
        ],
      },
      {
        heading: 'How this site is tested',
        blocks: [
          {
            type: 'p',
            text: 'The documentation site runs an automated axe-core audit over its primary routes as part of the release checklist. The audit covers WCAG 2.0/2.1/2.2 A and AA rules and is reproducible from the repository:',
          },
          {
            type: 'code',
            text: 'pnpm --filter slipstream-ui-docs build\npnpm --filter slipstream-ui-docs start -- -p 3111\npnpm --filter slipstream-ui-docs audit:a11y -- http://localhost:3111',
          },
          {
            type: 'p',
            text: 'Routes covered: home, docs index, installation, representative component pages, MCP, templates, changelog, about, this page, contact, and the legal pages. Each route is audited in **both light and dark mode**. On November 4, 2026 the suite passed all 13 routes in both schemes (26 page runs, 0 violations), and Lighthouse reported Accessibility 100 on the sampled routes.',
          },
          {
            type: 'p',
            text: 'Automated tooling detects a subset of issues; it cannot validate reading order, task completion, or the quality of alternative text.',
          },
        ],
      },
      {
        heading: 'Component coverage',
        blocks: [
          {
            type: 'p',
            text: 'All {componentCount} components ship a jest-axe assertion and an accessibility section in their COMPONENT_MANIFEST. Interactive components also have keyboard and focus tests.',
          },
          {
            type: 'ul',
            items: [
              '**Automated:** axe rules per component, light and dark route audits, keyboard interaction tests, reduced-motion variants, and role/state assertions.',
              '**In progress:** manual screen-reader task passes (NVDA, VoiceOver), 400% zoom, and RTL reading order with translated content.',
              '**Not claimed:** conformance for every composition a consumer builds. Passing component tests is not the same as a conforming product.',
            ],
          },
        ],
      },
      {
        heading: 'Known limitations',
        blocks: [
          {
            type: 'ul',
            items: [
              'A full manual screen-reader audit (NVDA on Windows, VoiceOver on macOS/iOS) is not yet complete. Automated coverage is not a substitute.',
              'Third-party content linked from the docs (GitHub, external standards pages) is outside our control.',
              'Some interactive demos simulate streaming and agent behaviour with timers; they are illustrative and keyboard-operable, but not production transports.',
            ],
          },
        ],
      },
      {
        heading: 'Reporting a barrier',
        blocks: [
          {
            type: 'p',
            text: 'If something blocks you, please [open an issue]({repo}/issues/new) with the page, the assistive technology you used, and what you expected. Security-sensitive reports should follow the [security policy]({repo}/blob/main/SECURITY.md). You can also email [{email}](mailto:{email}).',
          },
          { type: 'p', text: 'We aim to acknowledge accessibility reports within five business days.' },
        ],
      },
    ],
  },
  privacy: {
    title: 'Privacy policy',
    description:
      'Short version: we store your theme preference, we only measure traffic if you accept cookies, and we never run ads or cross-site tracking.',
    updated: 'November 2026',
    sections: [
      {
        heading: 'What we store on your device',
        blocks: [
          {
            type: 'ul',
            items: [
              '`slipstream-theme`: your light/dark preference, so the site does not flash the wrong theme.',
              '`slipstream-consent`: your cookie choice, so we do not ask again.',
            ],
          },
          { type: 'p', text: 'Neither value is sent to a server. You can reset both from [Privacy preferences](#preferences).' },
        ],
      },
      {
        heading: 'Analytics',
        blocks: [
          {
            type: 'p',
            text: 'Analytics is **off by default**. If you choose “Accept all”, we load Google Analytics 4 (measurement ID `G-QDQXNJV9MD`). It sets first-party `_ga` cookies and records page views, the referring page, and coarse device/browser information. GA4 does not log or store IP addresses, and we disable Google Signals and ad-personalisation signals so the property only produces aggregate reporting. Google processes this data for us as a processor and may store it outside your country.',
          },
          {
            type: 'p',
            text: 'We never load advertising, retargeting, or session-replay scripts. You can change or withdraw consent at any time in [Privacy preferences](#preferences); resetting removes the `_ga` cookies and the banner appears again on your next visit.',
          },
        ],
      },
      {
        heading: 'Contact messages',
        blocks: [
          {
            type: 'p',
            text: 'We do not run a contact form. You reach us through the GitHub channels listed on the contact page: issues for bug reports, Discussions for questions, and the private channel in SECURITY.md for vulnerabilities. GitHub processes the profile data and content you submit there under its own privacy policy. We use it only to respond to you and keep correspondence for up to 24 months.',
          },
        ],
      },
      {
        heading: 'Third-party requests',
        blocks: [
          {
            type: 'p',
            text: 'The homepage shows a live GitHub star count by requesting the public GitHub API from your browser. Like any request to github.com, that exposes your IP address and user agent to GitHub under their privacy policy. No cookies are set by that request. The only other third-party resource is the Google Analytics tag described above, and it loads only after you accept analytics.',
          },
          {
            type: 'p',
            text: 'Processors and their purpose: our hosting provider (request logs), Google (analytics, only with consent), GitHub (public repository data, the star count, and support correspondence), and npm (package distribution and download counts).',
          },
        ],
      },
      {
        heading: 'Hosting logs',
        blocks: [
          {
            type: 'p',
            text: 'Our hosting provider records standard request logs (IP address, user agent, requested URL) for security and abuse prevention, retained according to their policy.',
          },
        ],
      },
      {
        heading: 'What we do not do',
        blocks: [
          {
            type: 'ul',
            items: [
              'No advertising or retargeting pixels.',
              'No selling or renting of personal data.',
              'No advertising profiles or cross-site tracking.',
            ],
          },
        ],
      },
      {
        heading: 'Your rights',
        blocks: [
          {
            type: 'p',
            text: 'Depending on where you live you may have the right to access, correct, export or delete personal data we hold about you, and to object to processing. Email [{email}](mailto:{email}) and we will respond within 30 days. You can also lodge a complaint with your local supervisory authority.',
          },
        ],
      },
      {
        heading: 'Children',
        blocks: [{ type: 'p', text: 'The site is a developer resource and is not directed at children under 16.' }],
      },
      {
        heading: 'Changes',
        blocks: [
          {
            type: 'p',
            text: 'We will update this page and its “last updated” date when practices change. See also our [terms of use](/terms).',
          },
        ],
      },
      {
        heading: 'Contact',
        blocks: [{ type: 'p', text: 'Questions about this policy: [{email}](mailto:{email}).' }],
      },
    ],
  },
  terms: {
    title: 'Terms of use',
    description: 'Plain-language terms for this site and the Slipstream UI packages.',
    updated: 'November 2026',
    sections: [
      {
        heading: 'The software',
        blocks: [
          {
            type: 'p',
            text: 'Slipstream UI packages are released under the [MIT license]({repo}/blob/main/LICENSE). You may use, modify and redistribute them commercially, provided the copyright notice and permission notice are included. The license text controls if it conflicts with this page.',
          },
        ],
      },
      {
        heading: 'No warranty',
        blocks: [
          {
            type: 'p',
            text: 'The site, documentation, manifests, MCP tooling and packages are provided **as is**, without warranty of any kind, express or implied, including fitness for a particular purpose. You are responsible for reviewing generated code and for your own product decisions.',
          },
        ],
      },
      {
        heading: 'Generated code and validation',
        blocks: [
          {
            type: 'ul',
            items: [
              '`validate_usage` checks the props, required props and documented composition rules in a component manifest. It does not prove runtime behaviour, visual correctness, security or functional completeness.',
              'Automated accessibility checks are evidence of coverage, not a WCAG conformance certification. Manual testing in your own product remains your responsibility.',
              'You are responsible for reviewing, testing and securing any code you or an agent generate, including code generated with Slipstream UI manifests or MCP tools.',
            ],
          },
        ],
      },
      {
        heading: 'Trademarks and brand',
        blocks: [
          {
            type: 'p',
            text: 'The MIT license covers the source code. It does not grant rights to the Slipstream UI name, logo or other brand identifiers. Forked or modified distributions must not imply endorsement by the project.',
          },
        ],
      },
      {
        heading: 'Security',
        blocks: [
          {
            type: 'p',
            text: 'Report vulnerabilities privately through the process in [SECURITY.md]({repo}/blob/main/SECURITY.md) or GitHub security advisories. Please do not open a public issue for an unfixed vulnerability.',
          },
        ],
      },
      {
        heading: 'Acceptable use',
        blocks: [
          {
            type: 'ul',
            items: [
              'Do not use the site to break the law, infringe rights, or distribute malware.',
              'Do not attempt to disrupt or overload the hosting infrastructure.',
              'Do not misrepresent modified versions of the packages as official releases.',
              'Rate limits and fair-use expectations apply to any hosted endpoints.',
            ],
          },
        ],
      },
      {
        heading: 'Limitation of liability',
        blocks: [
          {
            type: 'p',
            text: 'To the maximum extent permitted by law, the maintainers are not liable for indirect, incidental or consequential damages, or for lost profits or data, arising from use of the site or packages.',
          },
        ],
      },
      {
        heading: 'Third-party links and services',
        blocks: [
          {
            type: 'p',
            text: 'The site links to GitHub, npm and other third-party services. Their terms and privacy policies apply to your use of those services.',
          },
        ],
      },
      {
        heading: 'Changes',
        blocks: [
          {
            type: 'p',
            text: 'We may update these terms; the “last updated” date changes accordingly. Continued use after an update means you accept the revised terms.',
          },
        ],
      },
      {
        heading: 'Contact',
        blocks: [
          {
            type: 'p',
            text: 'Questions about these terms: [{email}](mailto:{email}). See also the [privacy policy](/privacy).',
          },
        ],
      },
    ],
  },
};
