import { Command } from 'commander';
import chalk from 'chalk';
import { loadRegistry } from '../registry';

export const listCommand = new Command('list')
  .description('List all available components')
  .option('-p, --package <package>', 'Filter by package')
  .option('-t, --tier <tier>', 'Filter by tier')
  .action((options) => {
    let components = loadRegistry();

    if (options.package) {
      components = components.filter((c) => c.package === options.package);
    }

    if (options.tier) {
      components = components.filter((c) => c.tier === options.tier);
    }

    console.log(chalk.bold('\nAvailable Components:\n'));

    components.forEach((component) => {
      console.log(chalk.cyan(`  ${component.name}`));
      console.log(chalk.gray(`    ID: ${component.id}`));
      console.log(chalk.gray(`    Package: ${component.package}`));
      console.log(chalk.gray(`    Tier: ${component.tier}`));
      console.log();
    });

    console.log(chalk.gray(`Total: ${components.length} component(s)`));
    console.log(chalk.gray('\nAdd a component: npx slipstream-ui add <component-name>'));
  });
