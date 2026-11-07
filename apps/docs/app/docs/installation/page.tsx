import type { Metadata } from 'next';
import { CodeBlock } from '@slipstream-ui/ai';

export const metadata: Metadata = {
  title: 'Installation',
  description:
    'Install Slipstream UI via pnpm packages, the npx slipstream-ui CLI, or the shadcn-compatible registry — with manual Tailwind and CSS variable setup for Next.js, Vite, Remix, and Astro.',
};

export default function InstallationPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Installation</h1>
      <p className="text-lg text-muted-foreground mb-4">
        Get started with Slipstream UI in your project.
      </p>
      <p className="mb-8 leading-relaxed text-muted-foreground">
        Slipstream UI is <strong className="text-foreground">React-first</strong>: every component is
        a React 18+ / TypeScript component. It runs in any React environment — Next.js, Vite,
        Remix, and Astro are all covered below. Framework-agnostic builds (Vue, Svelte, vanilla JS)
        are not on the roadmap yet; if your app renders React, you can use Slipstream.
      </p>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <div className="mb-6 rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm">
          <strong className="text-foreground">Migrating from the old slipstream-ui package?</strong>
          <p className="mt-1 text-muted-foreground">
            The original <code>slipstream-ui</code> npm package (v3.x, Tailwind 2/3 era) is deprecated and no longer maintained.
            Use <code>@slipstream-ui/core</code> and <code>@slipstream-ui/ai</code> instead — they are unrelated to the old package
            and ship with machine-readable manifests, an MCP server, and a shadcn-compatible registry.
          </p>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Prerequisites</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Node.js 20.9 or higher</li>
          <li>pnpm 8 or higher (recommended)</li>
          <li>React 18 or 19</li>
          <li>Tailwind CSS 3.4 or 4.x, or no Tailwind at all via the prebuilt stylesheets</li>
          <li>TypeScript (recommended)</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Quick Start with CLI</h2>
        <p className="text-muted-foreground mb-4">
          The fastest way to get started is using the Slipstream UI CLI:
        </p>
        <CodeBlock language="bash" code={`npx @slipstream-ui/cli@latest init`} />
        <p className="text-muted-foreground mb-4">
          This will:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Install the required packages</li>
          <li>Set up the configuration files</li>
          <li>Add base components to your project</li>
          <li>Configure your theme</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Manual Installation</h2>
        <p className="text-muted-foreground mb-4">
          If you prefer to install manually, follow these steps:
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">1. Install packages</h3>
        <CodeBlock language="bash" code={`pnpm add @slipstream-ui/core @slipstream-ui/ai @slipstream-ui/themes`} />

        <h3 className="text-xl font-semibold mt-6 mb-3">2. Configure Tailwind CSS</h3>
        <p className="text-muted-foreground mb-4">
          Extend your Tailwind config with the Slipstream UI theme. Tailwind CSS 3
          users can use the published preset, which carries every token mapping and
          the animate plugin:
        </p>
        <CodeBlock language="js" code={`// tailwind.config.js
module.exports = {
  presets: [require('@slipstream-ui/themes/tailwind-preset')],
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@slipstream-ui/**/*.{js,ts,tsx}',
  ],
}`} />
        <p className="text-muted-foreground mb-4">
          If you already maintain your own token map, the longhand equivalent is below.
        </p>
        <CodeBlock language="bash" code={`// tailwind.config.js
const path = require('node:path')
// Resolve the real package directory: pnpm symlinks make a literal
// ./node_modules/@slipstream-ui glob unreliable.
const slipstreamDist = path.dirname(require.resolve('@slipstream-ui/core'))

module.exports = {
  darkMode: ['class'],
  content: [
    './src/**/*.{ts,tsx}',
    \`\${slipstreamDist}/**/*.{js,mjs}\`,
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
          ink: 'hsl(var(--warning-ink))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
          ink: 'hsl(var(--info-ink))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}`} />

        <h3 className="text-xl font-semibold mt-6 mb-3">3. Add CSS variables</h3>
        <p className="text-muted-foreground mb-4">
          Add the CSS variables to your global CSS file:
        </p>
        <CodeBlock language="css" code={`@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222 85% 7%;
    --card: 0 0% 100%;
    --card-foreground: 222 85% 7%;
    --popover: 0 0% 100%;
    --popover-foreground: 222 85% 7%;
    --primary: 224 89% 53%;
    --primary-foreground: 0 0% 100%;
    --secondary: 214 45% 96%;
    --secondary-foreground: 222 47% 11%;
    --muted: 214 40% 96%;
    --muted-foreground: 219 12% 42%;
    --accent: 214 45% 96%;
    --accent-foreground: 222 47% 11%;
    --destructive: 348 68% 44%;
    --destructive-foreground: 0 0% 100%;
    --success: 142 63% 32%;
    --success-foreground: 0 0% 100%;
    --warning: 38 92% 50%;
    --warning-foreground: 26 83% 14%;
    --warning-ink: 32 90% 32%;
    --info: 190 76% 38%;
    --info-foreground: 222 75% 10%;
    --info-ink: 190 90% 28%;
    --border: 214 28% 89%;
    --input: 214 28% 89%;
    --ring: 224 89% 53%;
    --radius: 0.375rem;
  }

  .dark {
    color-scheme: dark;
    --background: 222 42% 5%;
    --foreground: 210 40% 96%;
    --card: 222 34% 11%;
    --card-foreground: 210 40% 96%;
    --popover: 222 34% 14%;
    --popover-foreground: 210 40% 96%;
    --primary: 224 90% 70%;
    --primary-foreground: 222 75% 10%;
    --secondary: 217 24% 17%;
    --secondary-foreground: 210 40% 96%;
    --muted: 217 24% 17%;
    --muted-foreground: 215 16% 68%;
    --accent: 217 24% 17%;
    --accent-foreground: 210 40% 96%;
    --destructive: 0 76% 64%;
    --destructive-foreground: 222 75% 10%;
    --success: 142 62% 52%;
    --success-foreground: 222 75% 10%;
    --warning: 38 92% 60%;
    --warning-foreground: 26 83% 14%;
    --warning-ink: 38 92% 62%;
    --info: 190 80% 58%;
    --info-foreground: 222 75% 10%;
    --info-ink: 190 80% 62%;
    --border: 217 20% 30%;
    --input: 217 18% 36%;
    --ring: 224 90% 70%;
  }
}`} />

        <h3 className="text-xl font-semibold mt-6 mb-3">4. Import components</h3>
        <p className="text-muted-foreground mb-4">
          Start using components in your app:
        </p>
        <CodeBlock language="tsx" code={`import { Button } from '@slipstream-ui/core'
import { Message, Conversation } from '@slipstream-ui/ai'

function App() {
  return (
    <div>
      <Button>Click me</Button>
      <Conversation messages={messages} />
    </div>
  )
}`} />

        <h2 className="text-2xl font-semibold mt-8 mb-4">Package Managers</h2>
        <p className="text-muted-foreground mb-4">
          Slipstream UI works with all major package managers:
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">pnpm (recommended)</h3>
        <CodeBlock language="bash" code={`pnpm add @slipstream-ui/core @slipstream-ui/ai`} />

        <h3 className="text-xl font-semibold mt-6 mb-3">npm</h3>
        <CodeBlock language="bash" code={`npm install @slipstream-ui/core @slipstream-ui/ai`} />

        <h3 className="text-xl font-semibold mt-6 mb-3">yarn</h3>
        <CodeBlock language="bash" code={`yarn add @slipstream-ui/core @slipstream-ui/ai`} />

        <h2 className="text-2xl font-semibold mt-8 mb-4">Framework Setup</h2>
        <p className="text-muted-foreground mb-4">
          Slipstream UI works with any React framework. Here are the specifics for the most common setups:
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Next.js (App Router)</h3>
        <p className="text-muted-foreground mb-4">
          Add the CSS variables to your global stylesheet, then import components in client components:
        </p>
        <CodeBlock language="bash" code={`// app/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* ... CSS variables from step 3 ... */
  }
  .dark {
    color-scheme: dark;
    /* ... dark CSS variables ... */
  }
}`} />
        <CodeBlock language="bash" code={`// app/layout.tsx
import './globals.css';

// Pre-paint theme script (avoids flash of wrong theme)
const THEME_INIT = \`
try {
  const stored = localStorage.getItem('slipstream-theme');
  if (stored === 'dark' || (!stored && matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
} catch {}\`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: THEME_INIT }} /></head>
      <body>{children}</body>
    </html>
  );
}`} />
        <p className="text-muted-foreground mb-4">
          Components use <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">&apos;use client&apos;</code> internally,
          so they work as client components within server layouts. No additional configuration is needed.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Vite + React</h3>
        <p className="text-muted-foreground mb-4">
          Import the CSS variables in your entry file and add the Tailwind content paths:
        </p>
        <CodeBlock language="bash" code={`// src/main.tsx
import './index.css';
import App from './App';

// src/index.css — same CSS variables as above
// tailwind.config.js — content paths include:
//   './src/**/*.{ts,tsx}',
//   './node_modules/@slipstream-ui/**/*.{js,ts,tsx}'`} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Remix</h3>
        <p className="text-muted-foreground mb-4">
          Add the CSS via your root route&apos;s <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">links</code> export:
        </p>
        <CodeBlock language="bash" code={`// app/root.tsx
import stylesheet from '~/tailwind.css';

export const links = () => [
  { rel: 'stylesheet', href: stylesheet },
];

// Same CSS variables + Tailwind content paths as above`} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Astro</h3>
        <p className="text-muted-foreground mb-4">
          Use a React integration for interactive components. Static markup works without it:
        </p>
        <CodeBlock language="bash" code={`# Install the React integration
npx astro add react

// Then use components in .astro files with client:load
// for interactive components:
---
import { Button } from '@slipstream-ui/core';
---
<Button client:load>Click me</Button>`} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Any other React setup</h3>
        <p className="text-muted-foreground mb-4">
          As long as you have React 18 or 19 and either Tailwind CSS 3.4+/4.x or the
          prebuilt stylesheets (@slipstream-ui/core/styles.css plus
          @slipstream-ui/themes/styles.css), Slipstream UI works. Components are plain
          React; runtime dependencies are @radix-ui/react-slot,
          @radix-ui/react-avatar, class-variance-authority, clsx, tailwind-merge, and
          tailwindcss-animate, all installed automatically.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Next Steps</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            <a href="/docs/theming" className="text-primary hover:underline">
              Configure your theme
            </a>
          </li>
          <li>
            <a href="/docs/components" className="text-primary hover:underline">
              Explore available components
            </a>
          </li>
          <li>
            <a href="/docs/ai-manifests" className="text-primary hover:underline">
              Learn about COMPONENT_MANIFEST
            </a>
          </li>
          <li>
            <a href="/docs/mcp" className="text-primary hover:underline">
              Set up the MCP server
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
