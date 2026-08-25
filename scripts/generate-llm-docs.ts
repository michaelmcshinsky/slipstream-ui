#!/usr/bin/env node
/**
 * Generates canonical markdown documentation for AI agents, served statically:
 *
 *   /llm/index.md                 - library overview + component index
 *   /llm/components/<id>.md       - full per-component reference from its manifest
 *
 * Mirrors assistant-ui's `.md` route convention: every page an agent needs is
 * fetchable as clean markdown without scraping HTML.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'apps', 'docs', 'public', 'llm');

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

function main() {
  const manifests = loadManifests();
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

The AI-first React component library. Every component ships a machine-readable
COMPONENT_MANIFEST; this directory mirrors those manifests as markdown.

- Library docs: https://slipstreamui.com/docs
- Manifest registry: https://slipstreamui.com/registry/all.json
- shadcn-compatible install: \`npx shadcn@latest add https://slipstreamui.com/registry/<id>.json\`

## Core components (@slipstream-ui/core)

${listItems(coreList)}

## AI components (@slipstream-ui/ai)

${listItems(aiList)}

## Usage guidance

1. Read the component .md page before generating code — it lists exact prop names,
   required props, anti-patterns, and accessibility requirements.
2. Never invent props not present in the Props table.
3. Components are stateless and uncontrolled unless documented otherwise;
   consumers own conversation/thread state.
`;

  fs.writeFileSync(path.join(OUT_DIR, 'index.md'), index);
  console.log(`LLM docs generated: ${manifests.length} component pages -> ${path.relative(ROOT, OUT_DIR)}`);
}

main();
