#!/usr/bin/env node
/**
 * Detects drift between TypeScript prop interfaces and COMPONENT_MANIFEST files.
 *
 * For every manifest with a `sourceDir` + `exportName`, this script:
 *   1. Locates the component's .tsx source and its props interface.
 *   2. Extracts the prop names declared in TypeScript.
 *   3. Compares them to the manifest `props` array.
 *
 * Reports:
 *   - props present in TypeScript but MISSING from the manifest (drift: the
 *     agent-facing spec is incomplete)
 *   - props present in the manifest but NOT in TypeScript (drift: stale docs
 *     that will cause hallucinated props)
 *   - `required` mismatches (TS optional prop marked required in manifest, or
 *     vice versa)
 *
 * Runs as part of `pnpm validate:manifests` so drift blocks CI.
 */

import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '..');

const PACKAGES = [
  { name: '@slipstream-ui/core', dir: path.join(ROOT, 'packages', 'core') },
  { name: '@slipstream-ui/ai', dir: path.join(ROOT, 'packages', 'ai') },
] as const;

/** Props inherited from HTML element types that manifests may reasonably omit. */
const INHERITED_HTML_PROPS = new Set([
  'className', 'style', 'id', 'role', 'tabIndex', 'children',
  'aria-label', 'aria-labelledby', 'aria-describedby', 'aria-hidden',
  'aria-invalid', 'aria-busy', 'aria-live',
  'onClick', 'onFocus', 'onBlur', 'onKeyDown', 'onMouseEnter', 'onMouseLeave',
  'onChange', 'onInput', 'onSubmit', 'onSelect', 'onScroll', 'onWheel',
  'onCopy', 'onCut', 'onPaste', 'onCompositionStart', 'onCompositionEnd',
  'dangerouslySetInnerHTML', 'suppressHydrationWarning', 'ref', 'key',
  'defaultChecked', 'defaultValue', 'defaultSelected', 'value', 'checked',
  'disabled', 'placeholder', 'type', 'name', 'required', 'readOnly',
  'maxLength', 'minLength', 'pattern', 'autoFocus', 'autoComplete', 'form',
  'multiple', 'size', 'step', 'min', 'max', 'rows', 'cols', 'wrap',
  'href', 'target', 'rel', 'src', 'alt', 'width', 'height', 'loading',
  'title', 'dir', 'lang', 'hidden', 'draggable', 'spellCheck', 'inputMode',
  'accept', 'capture', 'list', 'start', 'open', 'high', 'low', 'optimum',
  'dateTime', 'cite', 'span', 'colSpan', 'rowSpan', 'headers', 'scope',
  'sorted', 'abbr', 'label', 'selected', 'htmlFor', 'encType', 'method',
  'action', 'noValidate', 'autoCapitalize', 'autoCorrect', 'enterKeyHint',
  'is', 'slot', 'part', 'exportParts', 'translate', 'virtualKeyboardPolicy',
  'popover', 'popoverTarget', 'popoverTargetAction',
]);

type Drift = {
  component: string;
  issue: string;
};

/**
 * Extract prop names from a TypeScript interface/type declaration.
 * Handles `propName?: type;`, `propName: type;`, and quoted keys.
 * Robust against complex extends clauses (Omit<..., 'a' | 'b'> etc.) by
 * scanning for the first brace outside generic brackets and quotes.
 */
function extractTsProps(source: string, interfaceName: string): Map<string, boolean> {
  const props = new Map<string, boolean>();

  // Find the declaration start.
  const declPattern = new RegExp(`(?:interface|type)\\s+${interfaceName}\\b`);
  const declMatch = source.match(declPattern);
  if (!declMatch) return props;

  // Scan forward to the first `{` that is outside <>, quotes, and parens.
  let i = declMatch.index! + declMatch[0].length;
  let depth = 0;
  let inQuote: string | null = null;
  let bodyStart = -1;

  for (; i < source.length; i++) {
    const ch = source[i];
    if (inQuote) {
      if (ch === inQuote && source[i - 1] !== '\\') inQuote = null;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      inQuote = ch;
      continue;
    }
    if (ch === '<') depth++;
    else if (ch === '>') depth--;
    else if (ch === '{' && depth === 0) {
      bodyStart = i;
      break;
    } else if (ch === '(' || ch === '[') depth++;
    else if (ch === ')' || ch === ']') depth--;
    else if (ch === ';' && depth === 0) break; // type alias without object body
  }
  if (bodyStart === -1) return props;

  // Walk braces to find the matching close.
  let braceDepth = 0;
  let end = bodyStart;
  inQuote = null;
  for (i = bodyStart; i < source.length; i++) {
    const ch = source[i];
    if (inQuote) {
      if (ch === inQuote && source[i - 1] !== '\\') inQuote = null;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      inQuote = ch;
      continue;
    }
    if (ch === '{') braceDepth++;
    if (ch === '}') {
      braceDepth--;
      if (braceDepth === 0) {
        end = i;
        break;
      }
    }
  }

  const body = source.slice(bodyStart + 1, end);
  // Match top-level keys only: identifier (optionally quoted) followed by ? and a colon.
  // Strip nested blocks first so keys inside callbacks don't leak.
  const stripped = body.replace(/\{[^{}]*\}/g, ' ').replace(/\([^)]*\)\s*=>/g, ' ');
  const propPattern = /(?:^|[;\n])\s*(?:readonly\s+)?['"]?([A-Za-z_$][\w$-]*)['"]?\s*(\??)\s*:/g;
  for (const m of stripped.matchAll(propPattern)) {
    props.set(m[1], m[2] === '?');
  }
  return props;
}

/**
 * Find the props interface name for a component source file.
 * Prefers `<ExportName>Props`, falls back to any `*Props` interface.
 */
function findPropsInterface(source: string, exportName: string): string | undefined {
  const preferred = `${exportName}Props`;
  if (new RegExp(`(?:interface|type)\\s+${preferred}\\b`).test(source)) return preferred;
  const anyProps = source.match(/(?:interface|type)\s+(\w+Props)\b/);
  return anyProps ? anyProps[1] : undefined;
}

/**
 * Collect prop names from `*Props` interfaces in a source file — the public
 * component API. Handles multi-export directories (Source + Sources) without
 * over-matching internal context/compound types (TabsContextValue etc.).
 */
function extractAllTsProps(source: string): Map<string, boolean> {
  const all = new Map<string, boolean>();
  const interfaceNames = [...source.matchAll(/(?:interface|type)\s+(\w+Props)\b/g)].map((m) => m[1]);
  for (const name of interfaceNames) {
    for (const [prop, optional] of extractTsProps(source, name)) {
      if (!all.has(prop)) all.set(prop, optional);
    }
  }
  return all;
}

/**
 * Extract prop names from destructured function parameters, e.g.
 * `function X({ suggestions, maxDisplay }: XProps)`. Catches inline prop
 * declarations in components that don't name a separate interface.
 */
function extractDestructuredParams(source: string): Set<string> {
  const names = new Set<string>();
  const pattern = /\(\s*\{\s*([^}]+)\s*\}\s*[:)]/g;
  for (const m of source.matchAll(pattern)) {
    for (const raw of m[1].split(',')) {
      const name = raw.split(/[:=]/)[0].trim().replace(/^\.\.\./, '');
      if (/^[A-Za-z_$][\w$]*$/.test(name)) names.add(name);
    }
  }
  return names;
}

function loadManifests(dir: string): { manifest: Record<string, unknown>; file: string }[] {
  const manifestDir = path.join(dir, 'src', 'manifests');
  if (!fs.existsSync(manifestDir)) return [];
  return fs
    .readdirSync(manifestDir)
    .filter((f) => f.endsWith('.manifest.json'))
    .map((file) => ({
      manifest: JSON.parse(fs.readFileSync(path.join(manifestDir, file), 'utf8')) as Record<string, unknown>,
      file,
    }));
}

function findSourceFile(sourceDir: string, exportName: string): string | undefined {
  // Prefer the exact component file, then any non-barrel .tsx, then barrels.
  const exact = [`${exportName}.tsx`, `${exportName}.ts`];
  for (const candidate of exact) {
    const filePath = path.join(sourceDir, candidate);
    if (fs.existsSync(filePath)) return filePath;
  }
  const components = fs
    .readdirSync(sourceDir)
    .filter((f) => (f.endsWith('.tsx') || f.endsWith('.ts')) && !f.startsWith('index.') && !f.includes('.test.'));
  if (components.length > 0) return path.join(sourceDir, components[0]);
  // Barrel fallback.
  for (const candidate of ['index.tsx', 'index.ts']) {
    const filePath = path.join(sourceDir, candidate);
    if (fs.existsSync(filePath)) return filePath;
  }
  return undefined;
}

function main(): void {
  const drifts: Drift[] = [];

  for (const pkg of PACKAGES) {
    for (const { manifest, file } of loadManifests(pkg.dir)) {
      const id = typeof manifest.id === 'string' ? manifest.id : file;
      const sourceDir = manifest.sourceDir;
      const exportName = manifest.exportName;

      if (typeof sourceDir !== 'string' || typeof exportName !== 'string') {
        continue;
      }

      const componentDir = path.join(pkg.dir, 'src', 'components', sourceDir);
      if (!fs.existsSync(componentDir)) continue;

      // Read every non-test component file in the directory so multi-export
      // dirs (Source.tsx + Sources.tsx) contribute all their props.
      const sourceFiles = fs
        .readdirSync(componentDir)
        .filter((f) => (f.endsWith('.tsx') || f.endsWith('.ts')) && !f.startsWith('index.') && !f.includes('.test.'));
      if (sourceFiles.length === 0) continue;
      const source = sourceFiles
        .map((f) => fs.readFileSync(path.join(componentDir, f), 'utf8'))
        .join('\n');
      const interfaceName = findPropsInterface(source, exportName) ?? exportName;
      // Use all Props interfaces in the file so multi-export directories
      // (Source + Sources) don't flag sibling props as stale.
      const tsProps = extractAllTsProps(source);
      const manifestProps = Array.isArray(manifest.props)
        ? (manifest.props as { name: string; required?: boolean }[])
        : [];
      const manifestNames = new Map(manifestProps.map((p) => [p.name, p.required === true]));

      // TS props missing from the manifest (inherited HTML props exempt).
      for (const [name, optional] of tsProps) {
        if (INHERITED_HTML_PROPS.has(name)) continue;
        if (!manifestNames.has(name)) {
          drifts.push({
            component: id,
            issue: `prop "${name}" exists in TypeScript (${interfaceName}) but is MISSING from the manifest`,
          });
        } else if (manifestNames.get(name) !== !optional) {
          drifts.push({
            component: id,
            issue: `prop "${name}" required mismatch: TS ${optional ? 'optional' : 'required'} vs manifest ${manifestNames.get(name) ? 'required' : 'optional'}`,
          });
        }
      }

      // Manifest props not present in the interface body AND not inherited
      // from HTML element types are truly stale docs. Also accept props found
      // in destructured params (inline prop declarations).
      const destructured = extractDestructuredParams(source);
      for (const name of manifestNames.keys()) {
        if (!tsProps.has(name) && !destructured.has(name) && !source.includes(name) && !INHERITED_HTML_PROPS.has(name)) {
          drifts.push({
            component: id,
            issue: `prop "${name}" exists in the manifest but is NOT in TypeScript (${interfaceName}) — stale entry`,
          });
        }
      }
    }
  }

  if (drifts.length === 0) {
    console.log('✓ No TypeScript ↔ manifest drift detected.');
    return;
  }

  console.error(`✗ Found ${drifts.length} TypeScript ↔ manifest drift issue(s):\n`);
  for (const drift of drifts) {
    console.error(`  [${drift.component}] ${drift.issue}`);
  }
  console.error('\nEvery component prop should be documented in its COMPONENT_MANIFEST.');
  process.exit(1);
}

main();
