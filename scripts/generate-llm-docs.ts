#!/usr/bin/env node
/**
 * Generates canonical markdown documentation for AI agents, served statically:
 *
 *   /llms.txt                       - top-level agent index (repo root file,
 *                                     marker blocks refreshed here, served
 *                                     copy written into apps/docs/public/)
 *   /llm/index.md                   - library overview + component index
 *   /llm/components/<id>.md         - full per-component reference from its manifest
 *
 * Component lists inside llms.txt live between `<!-- generated:*:start/end -->`
 * markers and are derived from the manifests, so llms.txt can never drift from
 * the real component count. Prose outside the markers stays hand-written.
 *
 * Mirrors assistant-ui's `.md` route convention: every page an agent needs is
 * fetchable as clean markdown without scraping HTML.
 *
 * Run: pnpm generate:llm-docs (also runs as part of the docs build).
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'apps', 'docs', 'public', 'llm');
const LLMS_ROOT_PATH = path.join(ROOT, 'llms.txt');
const LLMS_PUBLIC_PATH = path.join(ROOT, 'apps', 'docs', 'public', 'llms.txt');

function loadManifests() {
  const dirs = [
    path.join(ROOT, 'packages', 'core', 'src', 'manifests'),
    path.join(ROOT, 'packages', 'ai', 'src', 'manifests'),
  ];
  return dirs
    .filter((dir) => fs.existsSync(dir))
    .flatMap((dir) =>
      fs
        .readdirSync(dir)
        .filter((file) => file.endsWith('.json'))
        .map((file) => JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')))
    )
    .sort((a, b) => a.id.localeCompare(b.id));
}

function propTable(props = []) {
  if (props.length === 0) return '_No public props._\n';
  const rows = props.map((prop) => {
    const required = prop.required ? 'yes' : 'no';
    const def = prop.defaultValue !== undefined ? `\`${prop.defaultValue}\`` : '—';
    return `| ${prop.name} | \`${prop.type}\` | ${def} | ${required} | ${prop.description ?? ''} |`;
  });
  return ['| Prop | Type | Default | Required | Description |', '|---|---|---|---|---|', ...rows].join('\n') + '\n';
}

function examplesSection(examples = []) {
  if (examples.length === 0) return '';
  return (
    '## Examples\n\n' +
    examples
      .map((example) => `### ${example.title}\n\n${example.description ? example.description + '\n\n' : ''}\`\`\`tsx\n${example.code}\n\`\`\``)
      .join('\n\n') +
    '\n'
  );
}

function antiPatternsSection(antiPatterns = []) {
  if (antiPatterns.length === 0) return '';
  return (
    '## Anti-patterns\n\n' +
    antiPatterns.map((pattern) => `- **${pattern.title}** — ${pattern.explanation}`).join('\n') +
    '\n'
  );
}

function accessibilitySection(requirements = []) {
  if (requirements.length === 0) return '';
  return (
    '## Accessibility\n\n' +
    requirements.map((req) => `- **${req.feature}**: ${req.implementation}`).join('\n') +
    '\n'
  );
}

function compositionSection(rules = [], related = []) {
  if (rules.length === 0 && related.length === 0) return '';
  let out = '## Composition\n\n';
  for (const rule of rules) {
    out += `- Compose with **${rule.component}** — ${rule.relationship}\n`;
    if (rule.example) out += `  \n  \`\`\`tsx\n  ${rule.example}\n  \`\`\`\n`;
  }
  if (related.length > 0) out += `- Related: ${related.join(', ')}\n`;
  return out + '\n';
}

function componentToMarkdown(manifest) {
  return [
    `# ${manifest.name}`,
    '',
    manifest.description,
    '',
    `> Import: \`import { ${manifest.exportName ?? manifest.name.replace(/\s/g, '')} } from '${manifest.importPath}'\``,
    `> Registry: https://slipstreamui.com/registry/${manifest.id}.json`,
    `> Tier: ${manifest.tier} · Package: ${manifest.package}`,
    '',
    '## Design intent',
    '',
    manifest.designIntent,
    '',
    '## Props',
    '',
    propTable(manifest.props),
    examplesSection(manifest.examples),
    antiPatternsSection(manifest.antiPatterns),
    accessibilitySection(manifest.accessibility),
    compositionSection(manifest.compositionRules, manifest.relatedComponents),
  ].join('\n');
}

/**
 * Replace a marker-delimited block in llms.txt content.
 * Fails loudly if markers are missing so a renamed/removed block can never
 * silently ship a stale component list.
 */
function replaceMarkerBlock(content, marker, replacement) {
  const start = `<!-- generated:${marker}:start -->`;
  const end = `<!-- generated:${marker}:end -->`;
  const startIndex = content.indexOf(start);
  const endIndex = content.indexOf(end);
  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    throw new Error(
      `llms.txt is missing the "${marker}" generated block markers. ` +
        `Expected:\n  ${start}\n  ${end}`
    );
  }
  return content.slice(0, startIndex + start.length) + replacement + content.slice(endIndex);
}

function main() {
  const manifests = loadManifests();
  if (manifests.length === 0) {
    throw new Error('No COMPONENT_MANIFEST files found — refusing to generate empty LLM docs.');
  }

  fs.mkdirSync(path.join(OUT_DIR, 'components'), { recursive: true });

  for (const manifest of manifests) {
    fs.writeFileSync(
      path.join(OUT_DIR, 'components', `${manifest.id}.md`),
      componentToMarkdown(manifest)
    );
  }

  const coreList = manifests.filter((m) => m.package === '@slipstream-ui/core');
  const aiList = manifests.filter((m) => m.package === '@slipstream-ui/ai');
  const listItems = (list) =>
    list.map((m) => `- [${m.name}](https://slipstreamui.com/llm/components/${m.id}.md) — ${m.description}`).join('\n');

  const index = `# Slipstream UI — LLM Documentation Index

The AI-first React component library. ${manifests.length} components, each shipping a
machine-readable COMPONENT_MANIFEST; this directory mirrors those manifests as markdown.

- Library docs: https://slipstreamui.com/docs
- Manifest registry: https://slipstreamui.com/registry/all.json
- shadcn-compatible install: \`npx shadcn@latest add https://slipstreamui.com/registry/<id>.json\`

## Core components (@slipstream-ui/core) — ${coreList.length}

${listItems(coreList)}

## AI components (@slipstream-ui/ai) — ${aiList.length}

${listItems(aiList)}

## Usage guidance

1. Read the component .md page before generating code — it lists exact prop names,
   required props, anti-patterns, and accessibility requirements.
2. Never invent props not present in the Props table.
3. Components are stateless and uncontrolled unless documented otherwise;
   consumers own conversation/thread state.
`;

  fs.writeFileSync(path.join(OUT_DIR, 'index.md'), index);

  // Single source of truth for every human-facing count (homepage stats, OG
  // description, docs intro). Regenerated on each docs build so marketing copy
  // can never disagree with the manifests again.
  const countModule = `// Generated by scripts/generate-llm-docs.ts — do not edit by hand.
export const COMPONENT_COUNT = ${manifests.length};
export const CORE_COMPONENT_COUNT = ${coreList.length};
export const AI_COMPONENT_COUNT = ${aiList.length};
`;
  fs.writeFileSync(path.join(ROOT, 'apps', 'docs', 'lib', 'component-count.ts'), countModule);

  // Refresh llms.txt component blocks from the same manifests, then publish the
  // file to public/ so the site serves it at /llms.txt instead of 404ing.
  if (!fs.existsSync(LLMS_ROOT_PATH)) {
    throw new Error(`llms.txt not found at ${LLMS_ROOT_PATH}`);
  }
  const rootLlms = fs.readFileSync(LLMS_ROOT_PATH, 'utf8');
  const bulletList = (list) =>
    list.map((m) => `- ${m.name} — ${m.description}`).join('\n');

  let updated = replaceMarkerBlock(
    rootLlms,
    'core',
    `\n## Core components (@slipstream-ui/core) — ${coreList.length}\n\n${bulletList(coreList)}\n`
  );
  updated = replaceMarkerBlock(
    updated,
    'ai',
    `\n## AI components (@slipstream-ui/ai) — ${aiList.length}\n\n${bulletList(aiList)}\n`
  );

  fs.writeFileSync(LLMS_ROOT_PATH, updated);
  fs.mkdirSync(path.dirname(LLMS_PUBLIC_PATH), { recursive: true });
  fs.writeFileSync(LLMS_PUBLIC_PATH, updated);

  // README headline stats — same anti-drift treatment as llms.txt.
  const README_PATH = path.join(ROOT, 'README.md');
  if (fs.existsSync(README_PATH)) {
    const readme = fs.readFileSync(README_PATH, 'utf8');
    const stats = `\n**${manifests.length} components** · ${manifests.length} machine-readable specs · MCP \`validate_usage\` · MIT\n`;
    fs.writeFileSync(README_PATH, replaceMarkerBlock(readme, 'stats', stats));
  }

  console.log(
    `LLM docs generated: ${manifests.length} component pages + index.md + llms.txt ` +
      `(${coreList.length} core / ${aiList.length} ai) -> ${path.relative(ROOT, OUT_DIR)}`
  );
}

main();
