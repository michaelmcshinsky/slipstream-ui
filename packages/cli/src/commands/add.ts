import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import path from 'node:path';
import fs from 'fs-extra';
import { loadRegistryEntries } from '../registry';

export const addCommand = new Command('add')
  .description('Add a component to your project')
  .argument('<component>', 'Component name (e.g., button, message, conversation)')
  .option('-o, --overwrite', 'Overwrite existing files')
  .action(async (component, options) => {
    const spinner = ora(`Adding ${component} component...`).start();

    try {
      const id = component.toLowerCase();
      const entry = loadRegistryEntries().find(({ manifest }) => manifest.id === id);

      if (!entry?.manifest.sourceDir) {
        throw new Error(
          `Unknown component: ${component}. Run "slipstream-ui list" to see available components.`
        );
      }

      const { manifest, packageDir } = entry;
      if (!manifest.sourceDir) {
        throw new Error(`Manifest for "${id}" is missing a sourceDir field.`);
      }
      const sourceDir = path.join(packageDir, 'src', 'components', manifest.sourceDir);
      const destinationRoot = path.resolve(process.cwd(), 'components', 'slipstream');

      const destination = path.join(destinationRoot, manifest.sourceDir);
      if ((await fs.pathExists(destination)) && !options.overwrite) {
        throw new Error(`${destination} already exists. Use --overwrite to replace it.`);
      }
      await fs.copy(sourceDir, destination, { overwrite: true });

      await fs.copy(
        path.join(packageDir, 'src', 'manifests', `${id}.manifest.json`),
        path.join(destinationRoot, 'manifests', `${id}.manifest.json`),
        { overwrite: true }
      );

      spinner.succeed(chalk.green(`Added ${component} component successfully!`));
      console.log(
        `\nImport: ${chalk.cyan(`import { ${manifest.exportName ?? manifest.name} } from './components/slipstream/${manifest.sourceDir}'`)}`
      );
    } catch (error) {
      spinner.fail(chalk.red(`Failed to add ${component} component`));
      console.error(error);
      process.exit(1);
    }
  });
