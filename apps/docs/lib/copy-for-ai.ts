/**
 * Builds the compact, version-specific instruction copied by the "Copy for AI"
 * button and the playground. Pure so it can be unit-tested without React.
 */
import { MANIFEST_VERSION, RELEASE, RELEASE_DATE, SCHEMA_VERSION, VERSION } from './release';

export type ManifestProp = {
  name?: string;
  type?: string;
  required?: boolean;
  defaultValue?: unknown;
  description?: string;
};

export type ManifestExample = { title?: string; description?: string; code?: string };

export type RegistryManifest = {
  componentId?: string;
  id?: string;
  name?: string;
  description?: string;
  package?: string;
  packageVersion?: string;
  version?: string;
  importPath?: string;
  exportName?: string;
  docs?: string;
  props?: ManifestProp[];
  examples?: ManifestExample[];
  antiPatterns?: { title?: string; explanation?: string; example?: string }[];
  accessibility?: { feature?: string; implementation?: string }[];
  compositionRules?: { component?: string; relationship?: string; example?: string }[];
  relatedComponents?: string[];
};

export function componentName(manifest: RegistryManifest): string {
  return manifest.exportName ?? manifest.name ?? 'Component';
}

export function buildAiInstruction(manifest: RegistryManifest, componentId: string): string {
  const name = componentName(manifest);
  const props = manifest.props ?? [];
  const required = props.filter((prop) => prop.required).map((prop) => prop.name);
  const optional = props.filter((prop) => !prop.required);

  const lines: string[] = [
    `# Slipstream UI — ${name}`,
    '',
    manifest.description ?? '',
    '',
    `Release: ${VERSION} (${RELEASE_DATE}) · manifest schema v${SCHEMA_VERSION} · manifest v${MANIFEST_VERSION}.`,
    `Package: ${manifest.package ?? '@slipstream-ui/core'}@${manifest.packageVersion ?? manifest.version ?? VERSION}`,
    `Import: \`import { ${name} } from '${manifest.importPath ?? '@slipstream-ui/core'}'\``,
    `Docs: ${manifest.docs ?? `${RELEASE.urls.docs}/components/${componentId}`}`,
    `Manifest: ${RELEASE.urls.registry.replace('/all.json', '')}/${componentId}.json`,
    '',
    '## Rules',
    '- Use only the props listed below. `validate_usage` rejects unknown props and missing required props.',
    '- Match the composition and accessibility notes before inventing markup around the component.',
    '- Verify the rendered result yourself; static validation is not a visual or semantic guarantee.',
    '',
    `## Required props${required.length ? '' : ' (none)'}`,
    ...(required.length ? required.map((prop) => `- ${prop}`) : []),
    '',
    '## Props',
    ...(props.length
      ? props.map((prop) => {
          const flags = [prop.required ? 'required' : 'optional'];
          if (prop.defaultValue !== undefined) flags.push(`default: ${String(prop.defaultValue)}`);
          return `- ${prop.name ?? 'prop'} (${prop.type ?? 'unknown'}) — ${flags.join(', ')}${prop.description ? ` — ${prop.description}` : ''}`;
        })
      : ['- No public props.']),
  ];

  if (optional.length === 0 && props.length > 0) {
    lines.push('', 'All documented props are required.');
  }

  const examples = (manifest.examples ?? []).filter((example) => example.code).slice(0, 2);
  if (examples.length > 0) {
    lines.push('', '## Examples');
    for (const example of examples) {
      lines.push('', `### ${example.title ?? 'Example'}`);
      if (example.description) lines.push('', example.description);
      lines.push('', '```tsx', example.code ?? '', '```');
    }
  }

  const antiPatterns = (manifest.antiPatterns ?? []).filter((pattern) => pattern.title || pattern.explanation);
  if (antiPatterns.length > 0) {
    lines.push('', '## Anti-patterns');
    for (const pattern of antiPatterns) {
      lines.push(`- ${pattern.title ?? 'Avoid'}${pattern.explanation ? ` — ${pattern.explanation}` : ''}`);
      if (pattern.example) lines.push('', '```tsx', pattern.example, '```');
    }
  }

  const accessibility = (manifest.accessibility ?? []).filter((entry) => entry.feature || entry.implementation);
  if (accessibility.length > 0) {
    lines.push('', '## Accessibility');
    for (const entry of accessibility) {
      lines.push(`- ${entry.feature ?? 'Requirement'}: ${entry.implementation ?? ''}`.trim());
    }
  }

  const composition = (manifest.compositionRules ?? []).filter((rule) => rule.component || rule.relationship);
  if (composition.length > 0 || (manifest.relatedComponents ?? []).length > 0) {
    lines.push('', '## Composition');
    for (const rule of composition) {
      lines.push(`- ${rule.component ?? 'Sibling'} — ${rule.relationship ?? ''}`.trim());
    }
    if ((manifest.relatedComponents ?? []).length > 0) {
      lines.push(`- Related: ${(manifest.relatedComponents ?? []).join(', ')}`);
    }
  }

  return `${lines.join('\n')}\n`;
}
