import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import path from 'node:path';
import fs from 'fs-extra';
import { loadRegistryEntries } from '../registry';
import { resolveComponentsDir } from '../config';
import { rewriteSupportImports } from '../source';

type SourceFile = { absolute: string; relative: string; content: string };

const SOURCE_EXTENSIONS = ['.ts', '.tsx'];

function isTestFile(file: string) {
  return file.includes('.test.') || file.includes('.spec.') || file.endsWith('.d.ts');
}

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return SOURCE_EXTENSIONS.some((extension) => entry.name.endsWith(extension)) && !isTestFile(full)
      ? [full]
      : [];
  });
}

function resolveImport(fromFile: string, specifier: string) {
  if (!specifier.startsWith('.')) return null;
  const base = path.resolve(path.dirname(fromFile), specifier);
  const candidates = [
    base,
    ...SOURCE_EXTENSIONS.map((extension) => `${base}${extension}`),
    ...SOURCE_EXTENSIONS.map((extension) => path.join(base, `index${extension}`)),
  ];
  return candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile()) ?? null;
}

export function collectComponentSource(sourceRoot: string, entryId: string) {
  const components = new Set<string>();
  const files: SourceFile[] = [];
  const queue = [entryId];
  let needsUtils = false;
  let needsTypes = false;

  const read = (absolute: string) => {
    const relative = path.relative(sourceRoot, absolute).split(path.sep).join('/');
    const content = fs.readFileSync(absolute, 'utf8');
    files.push({ absolute, relative, content });
    for (const match of content.matchAll(/(?:from\s+|import\s*\()\s*['"]([^'"]+)['"]/g)) {
      const specifier = match[1];
      const resolved = resolveImport(absolute, specifier);
      if (!resolved) continue;
      const parts = path.relative(sourceRoot, resolved).split(path.sep);
      if (parts[0] === 'components' && parts[1]) {
        if (!components.has(parts[1])) queue.push(parts[1]);
      } else if (parts[0] === 'utils') {
        needsUtils = true;
      } else if (parts[0] === 'types') {
        needsTypes = true;
      }
    }
  };

  while (queue.length > 0) {
    const id = queue.shift();
    if (!id || components.has(id)) continue;
    const dir = path.join(sourceRoot, 'components', id);
    if (!fs.existsSync(dir)) continue;
    components.add(id);
    for (const file of walk(dir)) read(file);
  }

  const support = new Map<string, string[]>();
  if (needsUtils) support.set('utils', walk(path.join(sourceRoot, 'utils')));
  if (needsTypes) support.set('types', walk(path.join(sourceRoot, 'types')));

  return { components: [...components], files, support };
}

export const addCommand = new Command('add')
  .description('Add a component to your project')
  .argument('<component>', 'Component name (e.g., button, message, conversation)')
  .option('-o, --overwrite', 'Overwrite existing files')
  .action(async (component, options) => {
    const spinner = ora(`Adding ${component} component...`).start();

    try {
      const id = component.toLowerCase();
      const entries = loadRegistryEntries();
      const entry = entries.find(({ manifest }) => manifest.id === id);
      const sourceDirName = entry?.manifest.sourceDir;

      if (!entry || !sourceDirName) {
        throw new Error(
          `Unknown component: ${component}. Run "slipstream-ui list" to see available components.`
        );
      }

      const sourceRoot = path.join(entry.packageDir, 'src');
      const { components, files, support } = collectComponentSource(sourceRoot, sourceDirName);
      const componentsDir = resolveComponentsDir(process.cwd());
      const destinationRoot = componentsDir.absolute;

      const written: string[] = [];
      const skipped: string[] = [];
      const write = (absolute: string, relative: string, content: string) => {
        const destination = path.join(destinationRoot, relative);
        if (fs.existsSync(destination) && !options.overwrite) {
          skipped.push(relative);
          return;
        }
        fs.outputFileSync(destination, content);
        written.push(relative);
      };

      for (const file of files) {
        // components/<dir>/File.tsx -> components/slipstream/<dir>/File.tsx
        const relative = file.relative.replace(/^components\//, '');
        write(file.absolute, relative, rewriteSupportImports(file.content));
      }

      for (const [, groupFiles] of support) {
        for (const absolute of groupFiles) {
          const relative = path.relative(sourceRoot, absolute).split(path.sep).join('/');
          write(absolute, relative, rewriteSupportImports(fs.readFileSync(absolute, 'utf8')));
        }
      }

      const manifest = entry.manifest;
      fs.outputJsonSync(
        path.join(destinationRoot, 'manifests', `${id}.manifest.json`),
        manifest,
        { spaces: 2 }
      );

      const dependencies = new Set<string>();
      for (const componentId of components) {
        const componentEntry = entries.find(
          ({ manifest: candidate }) => candidate.sourceDir === componentId
        )?.manifest;
        const componentDependencies = componentEntry?.dependencies;
        if (Array.isArray(componentDependencies)) {
          for (const dependency of componentDependencies) {
            if (typeof dependency === 'string') dependencies.add(dependency);
          }
        }
      }

      spinner.succeed(chalk.green(`Added ${component} component successfully!`));
      console.log(
        `\nImport: ${chalk.cyan(`import { ${manifest.exportName ?? manifest.name} } from './${componentsDir.relative}/${manifest.sourceDir}'`)}`
      );
      if (components.length > 1) {
        console.log(chalk.gray(`  Also copied: ${components.filter((candidate) => candidate !== id).join(', ')}`));
      }
      if (skipped.length > 0) {
        console.log(chalk.yellow(`  Skipped ${skipped.length} existing file(s). Use --overwrite to replace them.`));
      }
      if (dependencies.size > 0) {
        console.log(chalk.gray(`  Peer packages: ${[...dependencies].join(', ')}`));
      }
    } catch (error) {
      spinner.fail(chalk.red(`Failed to add ${component} component`));
      console.error(error);
      process.exit(1);
    }
  });
