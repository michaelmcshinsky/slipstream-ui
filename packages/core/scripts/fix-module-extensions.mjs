#!/usr/bin/env node
/**
 * Add explicit extensions to relative imports in the per-file module build.
 *
 * esbuild preserves the source specifiers (`./Button`, `../../utils/cn`).
 * Bundlers resolve those; Node ESM does not. Subpath consumers can import the
 * package from Node, so rewrite each relative specifier to the emitted file or
 * directory index.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..', 'dist', 'src');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.(mjs|js)$/.test(entry.name) ? [full] : [];
  });
}

function rewrite(file) {
  const extension = file.endsWith('.mjs') ? '.mjs' : '.js';
  const source = fs.readFileSync(file, 'utf8');
  let changed = false;
  const next = source.replace(
    /((?:from|import|require)\s*\(?\s*['"])(\.{1,2}\/[^'"]+)(['"])/g,
    (full, prefix, specifier, quote) => {
      if (/\.(mjs|js|css|json)$/.test(specifier)) return full;
      const base = path.resolve(path.dirname(file), specifier);
      if (fs.existsSync(`${base}${extension}`)) {
        changed = true;
        return `${prefix}${specifier}${extension}${quote}`;
      }
      if (fs.existsSync(path.join(base, `index${extension}`))) {
        changed = true;
        return `${prefix}${specifier}/index${extension}${quote}`;
      }
      return full;
    }
  );
  if (changed) fs.writeFileSync(file, next);
}

if (!fs.existsSync(root)) {
  console.error(`Module output not found: ${root}`);
  process.exit(1);
}

let files = 0;
for (const file of walk(root)) {
  rewrite(file);
  files += 1;
}
console.log(`Normalized relative imports in ${files} module files.`);
