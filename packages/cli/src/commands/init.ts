import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import path from 'node:path';
import fs from 'fs-extra';

/** Extract the declarations of the first matching selector block. */
function readBlock(css: string, selector: string): Map<string, string> {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`));
  const declarations = new Map<string, string>();
  if (!match) return declarations;
  for (const declaration of match[1].matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    declarations.set(declaration[1], declaration[2].trim());
  }
  return declarations;
}

let THEME_LIGHT: Map<string, string> = new Map();
let THEME_DARK: Map<string, string> = new Map();

/** Format the tokens the consumer is missing, so an existing brand theme is
 * extended rather than replaced. */
function missingThemeTokens(css: string) {
  const light = readBlock(css, ':root');
  const dark = readBlock(css, '.dark');
  const missingLight = [...THEME_LIGHT].filter(([token]) => !light.has(token));
  const missingDark = [...THEME_DARK].filter(([token]) => !dark.has(token));
  if (missingLight.length === 0 && missingDark.length === 0) return null;
  const block = (tokens: [string, string][]) => tokens.map(([token, value]) => `  ${token}: ${value};`).join('\n');
  return [
    missingLight.length > 0 ? `:root {\n${block(missingLight)}\n}` : '',
    missingDark.length > 0 ? `.dark {\n  color-scheme: dark;\n${block(missingDark)}\n}` : '',
  ]
    .filter(Boolean)
    .join('\n\n');
}
const THEME_VARIABLES = `:root {
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
}`;

THEME_LIGHT = readBlock(THEME_VARIABLES, ':root');
THEME_DARK = readBlock(THEME_VARIABLES, '.dark');


/** Candidate global stylesheet locations, Next.js first then Vite conventions. */
const GLOBAL_CSS_CANDIDATES = [
  'src/app/globals.css',
  'app/globals.css',
  'src/styles/globals.css',
  'styles/globals.css',
  'src/globals.css',
  'src/index.css',
  'src/main.css',
  'src/styles.css',
  'index.css',
];

/** First line of the prebuilt stylesheets, used for duplicate detection. */
const PREBUILT_STYLES_MARKERS = [
  '@slipstream-ui/core/styles.css',
  '@slipstream-ui/themes/styles.css',
  '@slipstream-ui/themes/tailwind-v4.css',
];

function tailwindMajor(version: string | undefined): number | null {
  if (!version) return null;
  const match = version.match(/(\d+)/);
  return match ? Number(match[1]) : null;
}

/** Relative @source path from the stylesheet to the published package output. */
function sourcePath(projectRoot: string, cssPath: string, pkg: string): string {
  const relative = path.relative(
    path.dirname(path.join(projectRoot, cssPath)),
    path.join(projectRoot, 'node_modules', pkg, 'dist')
  );
  return relative.split(path.sep).join('/');
}

export const initCommand = new Command('init')
  .description('Initialize Slipstream UI in your project')
  .option('-d, --defaults', 'Use default configuration')
  .action(async (options) => {
    const spinner = ora('Initializing Slipstream UI...').start();

    try {
      const projectRoot = process.cwd();
      const packageJsonPath = path.join(projectRoot, 'package.json');
      if (!(await fs.pathExists(packageJsonPath))) {
        throw new Error('No package.json found. Run this command from your project root.');
      }
      const packageJson = await fs.readJson(packageJsonPath);

      // Detect the consumer's stack so guidance and config match reality.
      const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      const framework = allDeps.next
        ? 'next'
        : allDeps.vite || allDeps['@vitejs/plugin-react']
          ? 'vite'
          : 'unknown';
      const usesTailwind = Boolean(allDeps.tailwindcss);
      const twMajor = tailwindMajor(allDeps.tailwindcss);

      const configPath = path.join(projectRoot, 'slipstream.config.json');
      if ((await fs.pathExists(configPath)) && !options.defaults) {
        throw new Error('Slipstream is already initialized. Use --defaults to refresh the config.');
      }
      await fs.outputJson(
        configPath,
        {
          $schema: 'https://slipstreamui.com/schema.json',
          componentsDir: 'components/slipstream',
          style: 'tailwind',
          packages: ['@slipstream-ui/core', '@slipstream-ui/ai'],
          framework,
        },
        { spaces: 2 }
      );
      await fs.ensureDir(path.join(projectRoot, 'components', 'slipstream'));

      if (!allDeps['@slipstream-ui/core']) {
        console.log(chalk.yellow('\n  Install @slipstream-ui/core and @slipstream-ui/ai to use package imports in copied components.'));
      }

      // Wire the global stylesheet so the package actually renders.
      // - Tailwind 4: import the v4 theme contract and point @source at the
      //   published component output (utilities are generated from source).
      // - Tailwind 3: the JS theme preset is not published; inject the CSS
      //   variable contract and let the consumer's config map the tokens.
      // - No Tailwind: use the prebuilt stylesheets that ship with the package.
      let cssInjected = false;
      let cssTarget: string | undefined;
      let cssMode: 'tailwind-v4' | 'tailwind-v3' | 'prebuilt' = 'prebuilt';

      cssTarget = GLOBAL_CSS_CANDIDATES.find((candidate) =>
        fs.pathExistsSync(path.join(projectRoot, candidate))
      );
      if (!cssTarget && framework !== 'next') {
        cssTarget = 'src/styles.css';
        await fs.ensureDir(path.join(projectRoot, 'src'));
        await fs.writeFile(path.join(projectRoot, cssTarget), '');
      }

      if (cssTarget) {
        const cssPath = path.join(projectRoot, cssTarget);
        const existing = await fs.readFile(cssPath, 'utf8');
        const hasTheme = existing.includes('--background:') || existing.includes('--slipstream-theme');
        const hasPrebuilt = PREBUILT_STYLES_MARKERS.some((marker) => existing.includes(marker));
        let next = existing;

        if (twMajor === 4) {
          cssMode = 'tailwind-v4';
          if (!/^@import\s+["']tailwindcss["']/m.test(next)) {
            next = `@import "tailwindcss";\n${next}`;
          }
          if (!next.includes('@slipstream-ui/themes/tailwind-v4.css')) {
            next = next.replace(
              /@import\s+["']tailwindcss["'];?\n/,
              (line) => `${line}@import "@slipstream-ui/themes/tailwind-v4.css";\n`
            );
          }
          if (!next.includes('tailwindcss-animate')) {
            next = `${next.trimEnd()}\n\n@plugin "tailwindcss-animate";\n`;
          }
          if (!next.includes('@source') && !hasPrebuilt) {
            next = `${next.trimEnd()}\n@source "${sourcePath(projectRoot, cssTarget, '@slipstream-ui/core')}";\n@source "${sourcePath(projectRoot, cssTarget, '@slipstream-ui/ai')}";\n`;
          }
        } else if (twMajor === 3) {
          cssMode = 'tailwind-v3';
          if (!hasTheme) {
            next = `${next.trimEnd()}\n\n/* slipstream-ui theme */\n${THEME_VARIABLES}\n`;
          } else {
            // Keep the consumer's brand palette and add only the tokens the
            // Slipstream components need but the existing theme is missing.
            const missing = missingThemeTokens(next);
            if (missing) {
              next = `${next.trimEnd()}\n\n/* slipstream-ui theme (missing tokens) */\n${missing}\n`;
            }
          }
        } else {
          cssMode = 'prebuilt';
          if (!hasPrebuilt) {
            next = `@import "@slipstream-ui/themes/styles.css";\n@import "@slipstream-ui/core/styles.css";\n\n${next}`;
          }
        }

        if (next !== existing) {
          await fs.writeFile(cssPath, next);
          cssInjected = true;
        } else if (hasTheme || hasPrebuilt) {
          console.log(chalk.gray('\n  Detected existing Slipstream theme CSS; skipping stylesheet setup.'));
        }
      }

      spinner.succeed(chalk.green('Slipstream UI initialized successfully!'));
      console.log(`\nDetected setup: ${chalk.cyan(framework)} · Tailwind ${usesTailwind ? chalk.cyan('yes') : chalk.yellow('no')}`);
      console.log(chalk.gray(`  Config: slipstream.config.json`));
      if (cssTarget && cssInjected) {
        console.log(chalk.gray(`  Stylesheet wired (${cssMode}) at ${cssTarget}`));
      }
      console.log('\nNext steps:');
      console.log(chalk.gray('  1. Import components from @slipstream-ui/core and @slipstream-ui/ai'));
      console.log(chalk.gray('     or install source copies: npx @slipstream-ui/cli add <component>'));
      console.log(chalk.gray('  2. Customize the theme via @slipstream-ui/themes createTheme()'));
      console.log(chalk.gray('  3. Check the docs at https://slipstreamui.com/docs'));
    } catch (error) {
      spinner.fail(chalk.red('Failed to initialize Slipstream UI'));
      console.error(error);
      process.exit(1);
    }
  });
