import fs from 'node:fs';
import path from 'node:path';

export type AccessibilityRow = {
  id: string;
  name: string;
  package: string;
  sourceDir: string;
  /** A colocated test file asserts axe (jest-axe) with no violations. */
  axe: boolean;
  /** The colocated tests mention keyboard, focus or key handling. */
  interaction: boolean;
  /** Number of accessibility requirements in the manifest. */
  notes: number;
  docs: string;
  manifest: string;
};

export type AccessibilitySummary = {
  total: number;
  withAxe: number;
  withInteraction: number;
  withNotes: number;
  totalNotes: number;
};

type Manifest = {
  id: string;
  name: string;
  package: string;
  sourceDir?: string;
  accessibility?: unknown[];
};

const PACKAGES = [
  { name: '@slipstream-ui/core', dir: 'core' },
  { name: '@slipstream-ui/ai', dir: 'ai' },
] as const;

const DOCS_ROUTE_ID: Record<string, string> = { source: 'sources' };

function repoRoot(): string {
  const candidates = [process.cwd(), path.resolve(process.cwd(), '..', '..')];
  const found = candidates.find((candidate) => fs.existsSync(path.join(candidate, 'packages')));
  if (!found) throw new Error(`Could not locate the repository root from ${process.cwd()}`);
  return found;
}

function readManifests(root: string): { manifest: Manifest; packageDir: string; packageName: string }[] {
  return PACKAGES.flatMap((pkg) => {
    const dir = path.join(root, 'packages', pkg.dir, 'src', 'manifests');
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir)
      .filter((file) => file.endsWith('.manifest.json'))
      .map((file) => ({
        manifest: JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')) as Manifest,
        packageDir: path.join(root, 'packages', pkg.dir),
        packageName: pkg.name,
      }));
  });
}

function testSignals(componentDir: string): { axe: boolean; interaction: boolean } {
  if (!fs.existsSync(componentDir)) return { axe: false, interaction: false };
  const tests = fs
    .readdirSync(componentDir)
    .filter((file) => /\.test\.tsx?$/.test(file))
    .map((file) => fs.readFileSync(path.join(componentDir, file), 'utf8'));
  return {
    axe: tests.some((content) => /\baxe\b|jest-axe/.test(content)),
    interaction: tests.some((content) =>
      /keyboard|ArrowDown|ArrowUp|ArrowLeft|ArrowRight|Enter|Space|Tab|focus/i.test(content)
    ),
  };
}

/**
 * Build the component accessibility scorecard from the same manifests, tests
 * and source directories the library ships. This is evidence, not a badge:
 * it reports what is automated and how many manifest requirements each
 * component declares.
 */
export function buildAccessibilityScorecard(): {
  rows: AccessibilityRow[];
  summary: AccessibilitySummary;
} {
  const root = repoRoot();
  const rows = readManifests(root)
    .map(({ manifest, packageDir, packageName }) => {
      const sourceDir = manifest.sourceDir ?? manifest.id;
      const componentDir = path.join(packageDir, 'src', 'components', sourceDir);
      const signals = testSignals(componentDir);
      const notes = Array.isArray(manifest.accessibility) ? manifest.accessibility.length : 0;
      return {
        id: manifest.id,
        name: manifest.name,
        package: packageName,
        sourceDir,
        axe: signals.axe,
        interaction: signals.interaction,
        notes,
        docs: `/docs/components/${DOCS_ROUTE_ID[manifest.id] ?? manifest.id}`,
        manifest: `/llm/components/${manifest.id}.md`,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    rows,
    summary: {
      total: rows.length,
      withAxe: rows.filter((row) => row.axe).length,
      withInteraction: rows.filter((row) => row.interaction).length,
      withNotes: rows.filter((row) => row.notes > 0).length,
      totalNotes: rows.reduce((sum, row) => sum + row.notes, 0),
    },
  };
}
