import { getManifest } from '../registry';
import type { McpTool } from './types';

type UsageIssue = {
  severity: 'error' | 'warning';
  message: string;
};

type ComponentAttribute = {
  name: string;
  value?: string;
};

type ComponentUsage = {
  attributes: ComponentAttribute[];
  selfClosing: boolean;
  hasChildren: boolean;
};

/**
 * Extract attribute names from JSX usages of the component, e.g. every
 * `name=` inside a <Message ... /> opening tag. Heuristic but effective for
 * catching hallucinated props — the failure mode this tool exists to prevent.
 */
function findComponentUsages(code: string, exportName: string): ComponentUsage[] {
  const usages: ComponentUsage[] = [];
  const tagPattern = new RegExp(`<${exportName}\\b([^>]*?)/?>`, 'gs');
  for (const match of code.matchAll(tagPattern)) {
    // Strip string literals and brace expressions so only the attribute
    // skeleton remains, then read each identifier token.
    const raw = match[1];
    const stripped = raw.replace(/"[^"]*"|'[^']*'|\{[^{}]*\}/g, ' ');

    const values = new Map<string, string>();
    for (const valueMatch of raw.matchAll(/([A-Za-z_][\w-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
      const value = valueMatch[2] ?? valueMatch[3];
      if (value !== undefined) values.set(valueMatch[1], value);
    }

    const attributes: ComponentAttribute[] = [...stripped.matchAll(/(?:^|\s)([A-Za-z_][\w-]*)/g)]
      .map((attrMatch) => attrMatch[1])
      .filter((name) => !['true', 'false'].includes(name))
      .map((name) => ({ name, value: values.get(name) }));

    const selfClosing = /\/\s*>$/.test(match[0].trimEnd());
    let hasChildren = false;
    if (!selfClosing && match.index !== undefined) {
      const after = code.slice(match.index + match[0].length);
      const closing = new RegExp(`</${exportName}\\s*>`).exec(after);
      hasChildren = closing !== null && after.slice(0, closing.index).trim().length > 0;
    }

    usages.push({ attributes, selfClosing, hasChildren });
  }
  return usages;
}

export const validateUsageTool: McpTool = {
  definition: {
    name: 'validate_usage',
    description:
      'Validate generated JSX against a Slipstream UI component manifest before emitting it. Detects unknown (hallucinated) props and missing required props, and surfaces anti-patterns to check.',
    inputSchema: {
      type: 'object',
      properties: {
        componentId: { type: 'string', description: 'Kebab-case component ID, such as button or prompt-input.' },
        code: { type: 'string', description: 'The JSX code to validate.' },
      },
      required: ['componentId', 'code'],
    },
  },
  handler: async (args) => {
    const componentId = typeof args?.componentId === 'string' ? args.componentId : undefined;
    const code = typeof args?.code === 'string' ? args.code : undefined;
    if (!componentId) throw new Error('componentId is required');
    if (code === undefined) throw new Error('code is required');

    const manifest = getManifest(componentId);
    if (!manifest) throw new Error(`Component not found: ${componentId}`);

    const issues: UsageIssue[] = [];
    const exportName = manifest.exportName ?? manifest.name.replace(/\s/g, '');
    const schemaByName = new Map((manifest.props ?? []).map((prop) => [prop.name, prop]));

    const usages = findComponentUsages(code, exportName);
    if (usages.length === 0 && code.includes(exportName)) {
      issues.push({
        severity: 'warning',
        message: `Found "${exportName}" in code but not as a JSX element; verify it is used as <${exportName} ... />.`,
      });
    }
    if (usages.length === 0) {
      issues.push({ severity: 'error', message: `No <${exportName}> usage found in the provided code.` });
    }

    for (const [index, usage] of usages.entries()) {
      const where = usages.length > 1 ? `usage #${index + 1}` : 'usage';
      for (const attribute of usage.attributes) {
        const schema = schemaByName.get(attribute.name);
        if (!schema) {
          // Spread props cannot be validated.
          if (attribute.name === '...') continue;
          issues.push({
            severity: 'error',
            message: `Unknown prop "${attribute.name}" on <${exportName}> (${where}). This prop does not exist in the manifest.`,
          });
          continue;
        }

        if (schema.enum && attribute.value !== undefined && !schema.enum.includes(attribute.value)) {
          issues.push({
            severity: 'error',
            message: `Invalid value "${attribute.value}" for prop "${attribute.name}" on <${exportName}> (${where}). Allowed values: ${schema.enum.join(', ')}.`,
          });
        }
      }

      const missingRequired = (manifest.props ?? [])
        .filter((prop) => prop.required)
        .filter((prop) => {
          if (prop.name === 'children') return !usage.hasChildren && !usage.attributes.some((attribute) => attribute.name === prop.name);
          return !usage.attributes.some((attribute) => attribute.name === prop.name);
        })
        .map((prop) => `"${prop.name}"`);
      if (missingRequired.length > 0) {
        issues.push({
          severity: 'error',
          message: `Missing required prop(s) on <${exportName}> (${where}): ${missingRequired.join(', ')}.`,
        });
      }
    }

    const valid =
      issues.filter((issue) => issue.severity === 'error').length === 0 && usages.length > 0;

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              componentId,
              valid,
              usageCount: usages.length,
              issues,
              antiPatternsToCheck: (manifest.antiPatterns ?? []).map((pattern) => ({
                title: pattern.title,
                explanation: pattern.explanation,
              })),
            },
            null,
            2
          ),
        },
      ],
    };
  },
};
