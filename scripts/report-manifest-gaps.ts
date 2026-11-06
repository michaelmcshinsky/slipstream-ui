#!/usr/bin/env node
/**
 * Produces a per-component manifest gap report.
 *
 * `check-manifest-sync.ts` is the blocking gate. This script is the
 * human-readable companion: it records, for every component, how many props
 * TypeScript exposes, how many the manifest documents, which are missing,
 * which are stale, and which defaults appear to disagree.
 *
 * Default comparison is best-effort: it only compares simple literals that
 * appear in a destructured parameter list. Complex expressions are reported
 * as "unchecked" rather than guessed at.
 *
 * Writes `reports/manifest-gaps.json` and `reports/manifest-gaps.md`.
 * Exits 0 unless `--strict` is passed and gaps exist.
 */

import fs from 'fs';
import path from 'path';
import {
  INHERITED_HTML_PROPS,
  extractAllTsProps,
  extractDestructuredParams,
  findPropsInterface,
  loadManifests,
} from './check-manifest-sync';

const ROOT = path.resolve(__dirname, '..');

const PACKAGES = [
  { name: '@slipstream-ui/core', dir: path.join(ROOT, 'packages', 'core') },
  { name: '@slipstream-ui/ai', dir: path.join(ROOT, 'packages', 'ai') },
] as const;

type ManifestProp = {
  name: string;
  required?: boolean;
  defaultValue?: unknown;
};

type ComponentReport = {
  component: string;
  package: string;
  exportName: string;
  tsProps: number;
  manifestProps: number;
  missingFromManifest: string[];
  staleInManifest: string[];
  requiredMismatches: string[];
  defaultMismatches: string[];
  defaultsUnchecked: number;
};

function stripQuotes(value: string): string {
  return value.replace(/^['"]/, '').replace(/['"]$/, '');
}

function normalizeLiteral(value: unknown): string | undefined {
  if (typeof value === 'string') return stripQuotes(value);
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return undefined;
}

/** Best-effort extraction of simple literal defaults from destructured params. */
export function extractDestructuredDefaults(source: string): Map<string, string> {
  const defaults = new Map<string, string>();
  const pattern = /\(\s*\{\s*([^}]+)\s*\}\s*[:)]/g;
  for (const match of source.matchAll(pattern)) {
    for (const raw of match[1].split(',')) {
      const assignment = /^\s*([A-Za-z_$][\w$]*)\s*=\s*(.+?)\s*$/.exec(raw);
      if (!assignment) continue;
      const value = assignment[2].trim();
      const isSimple =
        /^(['"]).*\1$/.test(value) ||
        /^-?\d+(?:\.\d+)?$/.test(value) ||
        /^(?:true|false)$/.test(value);
      if (isSimple) defaults.set(assignment[1], stripQuotes(value));
    }
  }
  return defaults;
}

function buildReports(): ComponentReport[] {
  const reports: ComponentReport[] = [];

  for (const pkg of PACKAGES) {
    for (const { manifest, file } of loadManifests(pkg.dir)) {
      const id = typeof manifest.id === 'string' ? manifest.id : file;
      const sourceDir = manifest.sourceDir;
      const exportName = manifest.exportName;
      if (typeof sourceDir !== 'string' || typeof exportName !== 'string') continue;

      const componentDir = path.join(pkg.dir, 'src', 'components', sourceDir);
      if (!fs.existsSync(componentDir)) continue;

      const sourceFiles = fs
        .readdirSync(componentDir)
        .filter((entry) => (entry.endsWith('.tsx') || entry.endsWith('.ts')) && !entry.startsWith('index.') && !entry.includes('.test.'));
      if (sourceFiles.length === 0) continue;

      const source = sourceFiles.map((entry) => fs.readFileSync(path.join(componentDir, entry), 'utf8')).join('\n');
      const interfaceName = findPropsInterface(source, exportName) ?? exportName;
      const tsProps = extractAllTsProps(source);
      const destructured = extractDestructuredParams(source);
      const defaults = extractDestructuredDefaults(source);
      const manifestProps = Array.isArray(manifest.props) ? (manifest.props as ManifestProp[]) : [];
      const manifestByName = new Map(manifestProps.map((prop) => [prop.name, prop]));

      const missingFromManifest: string[] = [];
      const requiredMismatches: string[] = [];
      for (const [name, optional] of tsProps) {
        if (INHERITED_HTML_PROPS.has(name)) continue;
        const documented = manifestByName.get(name);
        if (!documented) {
          missingFromManifest.push(name);
        } else if ((documented.required === true) !== !optional) {
          requiredMismatches.push(name);
        }
      }

      const staleInManifest: string[] = [];
      for (const name of manifestByName.keys()) {
        if (!tsProps.has(name) && !destructured.has(name) && !source.includes(name) && !INHERITED_HTML_PROPS.has(name)) {
          staleInManifest.push(name);
        }
      }

      const defaultMismatches: string[] = [];
      let defaultsUnchecked = 0;
      for (const prop of manifestProps) {
        const manifestDefault = normalizeLiteral(prop.defaultValue);
        const tsDefault = defaults.get(prop.name);
        if (manifestDefault === undefined || tsDefault === undefined) {
          if (prop.defaultValue !== undefined) defaultsUnchecked++;
          continue;
        }
        if (manifestDefault !== tsDefault) {
          defaultMismatches.push(`${prop.name}: TS ${tsDefault} vs manifest ${manifestDefault}`);
        }
      }

      reports.push({
        component: id,
        package: pkg.name,
        exportName,
        tsProps: tsProps.size,
        manifestProps: manifestProps.length,
        missingFromManifest,
        staleInManifest,
        requiredMismatches,
        defaultMismatches,
        defaultsUnchecked,
      });
    }
  }

  return reports.sort((a, b) => a.component.localeCompare(b.component));
}

function toMarkdown(reports: ComponentReport[]): string {
  const gapCount = reports.filter(
    (report) =>
      report.missingFromManifest.length > 0 ||
      report.staleInManifest.length > 0 ||
      report.requiredMismatches.length > 0 ||
      report.defaultMismatches.length > 0,
  ).length;
  const lines: string[] = [
    '# Manifest gap report',
    '',
    `Components inspected: **${reports.length}**`,
    `Components with at least one gap: **${gapCount}**`,
    '',
    'Default comparison is best-effort: only simple literals in destructured parameters are compared.',
    '',
    '| Component | TS props | Manifest props | Missing | Stale | Required mismatch | Default mismatch |',
    '|---|---|---|---|---|---|---|',
  ];
  for (const report of reports) {
    lines.push(
      `| ${report.component} | ${report.tsProps} | ${report.manifestProps} | ${report.missingFromManifest.length} | ${report.staleInManifest.length} | ${report.requiredMismatches.length} | ${report.defaultMismatches.length} |`,
    );
  }
  const withGaps = reports.filter(
    (report) =>
      report.missingFromManifest.length > 0 ||
      report.staleInManifest.length > 0 ||
      report.requiredMismatches.length > 0 ||
      report.defaultMismatches.length > 0,
  );
  if (withGaps.length > 0) {
    lines.push('', '## Details', '');
    for (const report of withGaps) {
      lines.push(`### ${report.component}`, '');
      if (report.missingFromManifest.length) lines.push(`- Missing from manifest: ${report.missingFromManifest.join(', ')}`);
      if (report.staleInManifest.length) lines.push(`- Stale in manifest: ${report.staleInManifest.join(', ')}`);
      if (report.requiredMismatches.length) lines.push(`- Required mismatches: ${report.requiredMismatches.join(', ')}`);
      if (report.defaultMismatches.length) lines.push(`- Default mismatches: ${report.defaultMismatches.join('; ')}`);
      if (report.defaultsUnchecked) lines.push(`- Defaults not machine-checked: ${report.defaultsUnchecked}`);
      lines.push('');
    }
  }
  return `${lines.join('\n')}\n`;
}

function main(): void {
  const reports = buildReports();
  const outDir = path.join(ROOT, 'reports');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'manifest-gaps.json'), `${JSON.stringify({ generatedAt: new Date().toISOString(), components: reports }, null, 2)}\n`);
  fs.writeFileSync(path.join(outDir, 'manifest-gaps.md'), toMarkdown(reports));

  const gapCount = reports.filter(
    (report) =>
      report.missingFromManifest.length > 0 ||
      report.staleInManifest.length > 0 ||
      report.requiredMismatches.length > 0 ||
      report.defaultMismatches.length > 0,
  ).length;

  console.log(`Manifest gap report: ${reports.length} components, ${gapCount} with gaps.`);
  console.log('Wrote reports/manifest-gaps.json and reports/manifest-gaps.md.');

  if (process.argv.includes('--strict') && gapCount > 0) {
    process.exit(1);
  }
}

if (require.main === module) main();
