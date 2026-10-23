import { Command } from 'commander';
import chalk from 'chalk';
import path from 'node:path';
import { loadRegistryEntries } from '../registry';
import { diffInstalledComponents, type ComponentDiff } from '../diff';

export const diffCommand = new Command('diff')
  .description('Compare installed components against the registry (read-only)')
  .option('--json', 'Machine-readable output')
  .action(async (options: { json?: boolean }) => {
    const installedRoot = path.resolve(process.cwd(), 'components', 'slipstream');
    const diffs = await diffInstalledComponents({ installedRoot, entries: loadRegistryEntries() });

    if (diffs.length === 0) {
      if (options.json) {
        console.log(JSON.stringify({ components: [] }, null, 2));
        return;
      }
      console.log(chalk.gray('No installed components found. Add one with: npx slipstream-ui add <component>'));
      return;
    }

    const outdated = diffs.filter((diff: ComponentDiff) => diff.status !== 'ok');

    if (options.json) {
      console.log(JSON.stringify({ components: diffs, outdated: outdated.length }, null, 2));
    } else {
      console.log(chalk.bold('\nInstalled vs registry:\n'));
      for (const diff of diffs) {
        if (diff.status === 'ok') {
          console.log(chalk.green(`  ✓ ${diff.id}`) + chalk.gray(` (${diff.installedVersion ?? 'unknown'})`));
          continue;
        }
        if (diff.status === 'unknown') {
          console.log(chalk.yellow(`  ? ${diff.id}`) + chalk.gray(' (not in registry)'));
          continue;
        }
        console.log(chalk.yellow(`  ✗ ${diff.id}`) + chalk.gray(` (${diff.installedVersion ?? '?'} → ${diff.registryVersion ?? '?'})`));
        if (diff.versionOutdated) console.log(chalk.gray('      version differs'));
        for (const delta of diff.files) {
          const label = delta.status === 'missing' ? 'missing locally' : delta.status === 'extra' ? 'extra local file' : 'modified';
          console.log(chalk.gray(`      ${delta.file}: ${label}`));
        }
      }
      console.log(chalk.gray(`\n${diffs.length - outdated.length} up to date, ${outdated.length} outdated. Run "npx slipstream-ui add <id> --overwrite" to update.`));
    }

    // Non-zero exit lets CI fail on drift without mutating the project.
    if (outdated.length > 0) process.exitCode = 1;
  });
