import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import path from 'node:path';
import fs from 'fs-extra';

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
      const configPath = path.join(projectRoot, 'slipstream.config.json');
      if (await fs.pathExists(configPath) && !options.defaults) {
        throw new Error('Slipstream is already initialized. Use --defaults to refresh the config.');
      }
      await fs.outputJson(configPath, { $schema: 'https://slipstreamui.com/schema.json', componentsDir: 'components/slipstream', style: 'tailwind', packages: ['@slipstream-ui/core', '@slipstream-ui/ai'] }, { spaces: 2 });
      await fs.ensureDir(path.join(projectRoot, 'components', 'slipstream'));
      if (!packageJson.dependencies?.['@slipstream-ui/core'] && !packageJson.devDependencies?.['@slipstream-ui/core']) {
        console.log(chalk.yellow('  Install @slipstream-ui/core and @slipstream-ui/ai to use package imports in copied components.'));
      }

      spinner.succeed(chalk.green('Slipstream UI initialized successfully!'));
      console.log('\nNext steps:');
      console.log(chalk.gray('  1. Import components from @slipstream-ui/core and @slipstream-ui/ai'));
      console.log(chalk.gray('  2. Configure your theme using @slipstream-ui/themes'));
      console.log(chalk.gray('  3. Check the docs at https://slipstreamui.com/docs'));
    } catch (error) {
      spinner.fail(chalk.red('Failed to initialize Slipstream UI'));
      console.error(error);
      process.exit(1);
    }
  });
