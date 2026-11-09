import type { Metadata } from 'next';
import Link from 'next/link';
import { CodeBlock } from '@slipstream-ui/ai';

export const metadata: Metadata = {
  title: 'CLI',
  description:
    'Reference for the slipstream-ui CLI: init, add, list, and diff commands with flags, files written, CI drift gating, and troubleshooting.',
};

const COMMANDS = [
  {
    name: 'init',
    synopsis: 'npx @slipstream-ui/cli@latest init [options]',
    description:
      'Initialize Slipstream UI in your project. Detects your framework (Next.js, Vite) and Tailwind setup, writes slipstream.config.json, creates the component directory, and injects theme CSS variables into your global stylesheet when it can find one.',
    options: [
      { flag: '-d, --defaults', effect: 'Skip the interactive flow and use default configuration. Also allows re-running init when slipstream.config.json already exists.' },
    ],
    creates: [
      'slipstream.config.json — componentsDir, style, packages, detected framework',
      'components/slipstream/ — destination for copied source components',
      'CSS variable theme block appended to your global stylesheet (Next/Vite candidates)',
    ],
    example: 'npx @slipstream-ui/cli@latest init --defaults',
  },
  {
    name: 'add',
    synopsis: 'npx @slipstream-ui/cli@latest add <component> [options]',
    description:
      "Copy a component's real source files, the sibling components it imports, the shared utils, and its COMPONENT_MANIFEST into components/slipstream/. You own the code after it lands - edit it freely.",
    options: [
      { flag: '-o, --overwrite', effect: 'Replace existing copies of the component and its dependencies. Without it, existing files are skipped.' },
    ],
    creates: [
      'components/slipstream/<component>/ - source files',
      'components/slipstream/<dependency>/ - sibling components imported by the entry component',
      'components/slipstream/utils/ - cn(), gap() and presence() helpers',
      'components/slipstream/manifests/<id>.manifest.json - the machine-readable spec',
    ],
    example: 'npx @slipstream-ui/cli@latest add message --overwrite',
  },
  {
    name: 'list',
    synopsis: 'npx @slipstream-ui/cli@latest list [options]',
    description: 'Print every available component with its id, package, and tier. Useful before running add.',
    options: [
      { flag: '-p, --package <package>', effect: 'Filter by package (core, ai, themes).' },
      { flag: '-t, --tier <tier>', effect: 'Filter by tier (atom, molecule, organism).' },
    ],
    creates: [],
    example: 'npx @slipstream-ui/cli@latest list --package ai --tier molecule',
  },
  {
    name: 'diff',
    synopsis: 'npx @slipstream-ui/cli@latest diff [options]',
    description:
      'Read-only comparison of your installed components against the registry. Reports version drift, modified files, missing files, and local-only files. Exits non-zero when drift is found, so it can gate CI.',
    options: [
      { flag: '--json', effect: 'Machine-readable output for scripting and CI.' },
    ],
    creates: [],
    example: 'npx @slipstream-ui/cli@latest diff --json',
  },
];

const FILES_WRITTEN = [
  { file: 'slipstream.config.json', when: 'init', purpose: 'Project config: component directory, style, package list, detected framework.' },
  { file: 'components/slipstream/<id>/', when: 'add', purpose: 'Component source files you now own and can edit.' },
  { file: 'components/slipstream/manifests/<id>.manifest.json', when: 'add', purpose: 'The COMPONENT_MANIFEST — prop schema, anti-patterns, a11y rules.' },
  { file: 'Global stylesheet (CSS variables)', when: 'init', purpose: 'Theme variables appended to globals.css / index.css. An existing brand theme is extended with only the missing tokens.' },
];

const TROUBLESHOOTING = [
  {
    symptom: '"No package.json found."',
    fix: 'Run the command from your project root, not a subdirectory.',
  },
  {
    symptom: '"Slipstream is already initialized."',
    fix: 'Config already exists. Pass --defaults to refresh it, or delete slipstream.config.json first.',
  },
  {
    symptom: '"Unknown component: xyz."',
    fix: 'Run npx @slipstream-ui/cli@latest list to see valid component ids.',
  },
  {
    symptom: '"destination already exists."',
    fix: 'The component is already copied. Add --overwrite to replace it, or npx @slipstream-ui/cli@latest diff to see what changed.',
  },
  {
    symptom: 'Theme variables were not injected.',
    fix: 'For Tailwind 3, init extends an existing CSS-variable theme with only the tokens it is missing. If Tailwind is not detected, import the prebuilt stylesheets - see Theming.',
  },
  {
    symptom: 'Copied component cannot find its imports.',
    fix: 'add copies the component\'s sibling dependencies and the shared utils into components/slipstream. Install any third-party packages the command lists (for example @radix-ui/react-slot).',
  },
];

export default function CliPage() {
  return (
    <div>
      <h1 className="scroll-m-20 text-3xl font-bold tracking-tight sm:text-4xl">CLI</h1>
      <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
        Initialize a project, copy components into your own codebase, and check for drift — all from{' '}
        <code className="rounded bg-muted px-1.5 py-0.5 text-base">npx slipstream-ui</code>.
      </p>

      <div className="mt-8">
        <CodeBlock language="bash" code={`npx @slipstream-ui/cli@latest init
npx @slipstream-ui/cli@latest list
npx @slipstream-ui/cli@latest add message
npx @slipstream-ui/cli@latest diff`} />
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">Commands</h2>

      <div className="mt-6 space-y-10">
        {COMMANDS.map((command) => (
          <section key={command.name}>
            <h3 className="font-mono text-xl font-semibold">{command.name}</h3>
            <CodeBlock language="bash" className="mt-3" code={command.synopsis} />
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{command.description}</p>

            {command.options.length > 0 && (
              <>
                <h4 className="mt-5 text-sm font-semibold">Options</h4>
                <ul className="mt-2 space-y-2 text-sm">
                  {command.options.map((option) => (
                    <li key={option.flag}>
                      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{option.flag}</code>{' '}
                      <span className="text-muted-foreground">{option.effect}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {command.creates.length > 0 && (
              <>
                <h4 className="mt-5 text-sm font-semibold">What it writes</h4>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                  {command.creates.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            )}

            <div className="mt-4">
              <CodeBlock language="bash" code={command.example} />
            </div>
          </section>
        ))}
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">Files written</h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-left font-medium">File</th>
              <th className="p-3 text-left font-medium">Command</th>
              <th className="p-3 text-left font-medium">Purpose</th>
            </tr>
          </thead>
          <tbody>
            {FILES_WRITTEN.map((row) => (
              <tr key={row.file} className="border-t border-border">
                <td className="p-3 font-mono text-xs">{row.file}</td>
                <td className="p-3">{row.when}</td>
                <td className="p-3 text-muted-foreground">{row.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">CI: catch drift automatically</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">diff</code> exits with a non-zero code
        when installed components differ from the registry, so a single step fails the build on drift without
        mutating your project.
      </p>
      <div className="mt-4">
        <CodeBlock language="yaml" code={`# .github/workflows/ci.yml
- name: Check Slipstream component drift
  run: npx @slipstream-ui/cli@latest diff`} />
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">Troubleshooting</h2>
      <div className="mt-4 space-y-4">
        {TROUBLESHOOTING.map((entry) => (
          <div key={entry.symptom} className="rounded-xl border border-border bg-card p-4">
            <p className="font-mono text-sm font-medium">{entry.symptom}</p>
            <p className="mt-1.5 text-sm text-muted-foreground">{entry.fix}</p>
          </div>
        ))}
      </div>

      <p className="mt-10 text-sm text-muted-foreground">
        Prefer source copies over packages? See{' '}
        <Link href="/docs/installation" className="font-medium text-primary underline underline-offset-2">Installation</Link>{' '}
        for the shadcn-compatible registry path, or{' '}
        <Link href="/docs/theming" className="font-medium text-primary underline underline-offset-2">Theming</Link> for{' '}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">createTheme()</code> setup.
      </p>
    </div>
  );
}
