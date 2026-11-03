import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import path from 'node:path';
import fs from 'fs-extra';

/** CSS custom properties injected into the project's global stylesheet. */
const THEME_VARIABLES = `:root {
  --background: 0 0% 100%;
  --foreground: 222 85% 7%;
  --card: 0 0% 100%;
  --card-foreground: 222 85% 7%;
  --popover: 0 0% 100%;
  --popover-foreground: 222 85% 7%;
  --primary: 224 89% 58%;
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
  --info: 198 74% 38%;
  --info-foreground: 222 75% 10%;
  --border: 214 28% 89%;
  --input: 214 28% 89%;
  --ring: 224 89% 58%;
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
  --card: 222 36% 9%;
  --card-foreground: 210 40% 96%;
  --popover: 222 36% 11%;
  --popover-foreground: 210 40% 96%;
  --primary: 224 90% 70%;
  --primary-foreground: 222 75% 10%;
  --secondary: 217 26% 15%;
  --secondary-foreground: 210 40% 96%;
  --muted: 217 26% 15%;
  --muted-foreground: 215 16% 62%;
  --accent: 217 26% 15%;
  --accent-foreground: 210 40% 96%;
  --destructive: 0 76% 58%;
  --destructive-foreground: 222 75% 10%;
  --success: 142 62% 52%;
  --success-foreground: 222 75% 10%;
  --warning: 38 92% 60%;
  --warning-foreground: 26 83% 14%;
  --info: 198 80% 56%;
  --info-foreground: 222 75% 10%;
  --border: 217 20% 24%;
  --input: 217 18% 32%;
  --ring: 224 90% 70%;
}`;


/** Candidate global stylesheet locations, Next.js first then Vite conventions. */
const GLOBAL_CSS_CANDIDATES = [
  'src/app/globals.css',
  'app/globals.css',
  'src/styles/globals.css',
  'styles/globals.css',
  'src/index.css',
  'src/main.css',
  'index.css',
];

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

      // Inject theme variables into an existing global stylesheet so copied
      // components render correctly without manual setup.
      let cssInjected = false;
      let cssTarget: string | undefined;
      if (usesTailwind) {
        cssTarget = GLOBAL_CSS_CANDIDATES.find((candidate) =>
          fs.pathExistsSync(path.join(projectRoot, candidate))
        );
        if (cssTarget && !options.defaults) {
          const cssPath = path.join(projectRoot, cssTarget);
          const existing = await fs.readFile(cssPath, 'utf8');
          if (!existing.includes('--background:') && !existing.includes('--slipstream-theme')) {
            const marker = '/* slipstream-ui theme */';
            await fs.writeFile(cssPath, `${existing.trimEnd()}\n\n${marker}\n${THEME_VARIABLES}\n`);
            cssInjected = true;
          } else if (existing.includes('--background:')) {
            console.log(chalk.gray('\n  Detected an existing CSS-variable theme; skipping variable injection.'));
          }
        }
      }

      spinner.succeed(chalk.green('Slipstream UI initialized successfully!'));
      console.log(`\nDetected setup: ${chalk.cyan(framework)} · Tailwind ${usesTailwind ? chalk.cyan('yes') : chalk.yellow('no')}`);
      console.log(chalk.gray(`  Config: slipstream.config.json`));
      if (cssInjected && cssTarget) {
        console.log(chalk.gray(`  Theme variables written to ${cssTarget}`));
      }
      console.log('\nNext steps:');
      console.log(chalk.gray('  1. Import components from @slipstream-ui/core and @slipstream-ui/ai'));
      console.log(chalk.gray('     or install source copies: npx slipstream-ui add <component>'));
      console.log(chalk.gray('  2. Customize the theme via @slipstream-ui/themes createTheme()'));
      console.log(chalk.gray('  3. Check the docs at https://slipstreamui.com/docs'));
    } catch (error) {
      spinner.fail(chalk.red('Failed to initialize Slipstream UI'));
      console.error(error);
      process.exit(1);
    }
  });
