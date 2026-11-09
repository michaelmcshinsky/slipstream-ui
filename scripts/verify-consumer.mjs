#!/usr/bin/env node
/**
 * Consumer smoke build for the packed packages.
 *
 * Packs core and themes, installs the tarballs into a temporary Next 16 app
 * with Tailwind 3.4, imports server-safe and client components through
 * subpaths, and runs `next build`.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'slipstream-consumer-'));
const npm = 'npm';
const keep = process.env.KEEP_CONSUMER_TEMP === '1';

function run(command, args, cwd) {
  console.log(`$ ${command} ${args.join(' ')}`);
  return execFileSync(command, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], shell: process.platform === 'win32' });
}

function pack(packageDir) {
  const output = run(npm, ['pack', '--json', '--pack-destination', temp], path.join(root, packageDir));
  const [entry] = JSON.parse(output);
  return path.join(temp, entry.filename);
}

try {
  const core = pack('packages/core');
  const themes = pack('packages/themes');
  const coreVersion = JSON.parse(fs.readFileSync(path.join(root, 'packages/core/package.json'), 'utf8')).version;

  fs.writeFileSync(
    path.join(temp, 'package.json'),
    `${JSON.stringify(
      {
        name: 'slipstream-consumer-smoke',
        private: true,
        scripts: { build: 'next build' },
        dependencies: {
          '@slipstream-ui/core': `file:${path.basename(core)}`,
          '@slipstream-ui/themes': `file:${path.basename(themes)}`,
          next: '16.4.5',
          react: '19.2.8',
          'react-dom': '19.2.8',
        },
        devDependencies: {
          '@types/node': '22.13.10',
          '@types/react': '19.0.10',
          '@types/react-dom': '19.0.4',
          autoprefixer: '10.4.20',
          postcss: '8.5.3',
          tailwindcss: '3.4.17',
          typescript: '5.8.2',
        },
      },
      null,
      2
    )}\n`
  );

  run(npm, ['install', '--no-audit', '--no-fund', '--ignore-scripts', '--prefer-offline'], temp);

  fs.mkdirSync(path.join(temp, 'app'), { recursive: true });
  fs.writeFileSync(
    path.join(temp, 'app', 'layout.tsx'),
    `import type { ReactNode } from 'react';
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`
  );
  fs.writeFileSync(
    path.join(temp, 'app', 'page.tsx'),
    `import { Card, CardContent } from '@slipstream-ui/core/card';
import { FormField } from '@slipstream-ui/core/form-field';
import { Input } from '@slipstream-ui/core/input';
import { Text } from '@slipstream-ui/core/text';
import { DialogDemo } from './dialog-demo';

export default function Page() {
  return (
    <Card>
      <CardContent>
        <Text>consumer smoke</Text>
        <FormField id="email" label="Email">
          <Input id="email" type="email" />
        </FormField>
        <DialogDemo />
      </CardContent>
    </Card>
  );
}
`
  );
  fs.writeFileSync(
    path.join(temp, 'app', 'dialog-demo.tsx'),
    `'use client';

import { useState } from 'react';
import { Dialog } from '@slipstream-ui/core/dialog';

export function DialogDemo() {
  const [open, setOpen] = useState(false);
  return <Dialog open={open} onOpenChange={setOpen} title="Consumer dialog" />;
}
`
  );
  fs.writeFileSync(
    path.join(temp, 'app', 'globals.css'),
    `@tailwind base;
@tailwind components;
@tailwind utilities;

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
  --density-space: 0.5rem;
  --density-control-height: 2.25rem;
  --motion-fast: 150ms;
  --motion-normal: 250ms;
  --motion-slow: 400ms;
  --motion-ease: cubic-bezier(0.4, 0, 0.2, 1);
  --motion-ease-in: cubic-bezier(0, 0, 0.2, 1);
  --motion-ease-out: cubic-bezier(0.34, 1.56, 0.64, 1);
}
`
  );
  fs.writeFileSync(
    path.join(temp, 'tailwind.config.js'),
    `module.exports = {
  presets: [require('@slipstream-ui/themes/tailwind-preset')],
  content: [
    './app/**/*.{ts,tsx}',
    './node_modules/@slipstream-ui/core/dist/src/components/**/*.{js,mjs}',
  ],
};
`
  );
  fs.writeFileSync(path.join(temp, 'postcss.config.js'), `module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };\n`);
  fs.writeFileSync(
    path.join(temp, 'next.config.mjs'),
    `/** @type {import('next').NextConfig} */\nexport default { reactStrictMode: true };\n`
  );
  fs.writeFileSync(
    path.join(temp, 'tsconfig.json'),
    `${JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          lib: ['dom', 'dom.iterable', 'esnext'],
          allowJs: true,
          skipLibCheck: true,
          strict: true,
          noEmit: true,
          esModuleInterop: true,
          module: 'esnext',
          moduleResolution: 'bundler',
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: 'preserve',
          incremental: true,
          plugins: [{ name: 'next' }],
        },
        include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
        exclude: ['node_modules'],
      },
      null,
      2
    )}\n`
  );

  const next = path.join(temp, 'node_modules', '.bin', 'next');
  run(next, ['build', '--webpack'], temp);

  const cssFiles = [];
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.css')) cssFiles.push(full);
    }
  }
  walk(path.join(temp, '.next', 'static'));
  const css = cssFiles.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
  for (const selector of ['.bg-card', '.border-border', '.text-muted-foreground']) {
    if (!css.includes(selector)) {
      throw new Error(`consumer CSS is missing ${selector}`);
    }
  }
  if (!fs.existsSync(path.join(temp, '.next', 'BUILD_ID'))) {
    throw new Error('consumer build did not produce .next/BUILD_ID');
  }

  console.log(`Consumer build passed for @slipstream-ui/core@${coreVersion}.`);
} finally {
  if (!keep) fs.rmSync(temp, { recursive: true, force: true });
  else console.log(`Kept consumer fixture at ${temp}`);
}

