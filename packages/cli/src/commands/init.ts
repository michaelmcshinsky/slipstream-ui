import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import path from 'node:path';
import fs from 'fs-extra';

/** CSS custom properties injected into the project's global stylesheet. */
const THEME_VARIABLES = `:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 210 100% 50%;
  --primary-foreground: 0 0% 100%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 210 100% 50%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
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
