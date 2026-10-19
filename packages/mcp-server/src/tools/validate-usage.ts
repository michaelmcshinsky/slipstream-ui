import { getManifest } from '../registry';
import type { McpTool } from './types';

interface UsageIssue {
  severity: 'error' | 'warning';
  message: string;
}

/**
 * Extract attribute names from JSX usages of the component, e.g. every
 * `name=` inside a <Message ... /> opening tag. Heuristic but effective for
 * catching hallucinated props — the failure mode this tool exists to prevent.
 */
function findComponentUsages(code: string, exportName: string): string[][] {
  const usages: string[][] = [];
  const tagPattern = new RegExp(`<${exportName}\\b([^>]*?)/?>`, 'gs');
  for (const match of code.matchAll(tagPattern)) {
    // Strip string literals and brace expressions so only the attribute
    // skeleton remains, then read each identifier token.
    const stripped = match[1].replace(/"[^"]*"|'[^']*'|\{[^{}]*\}/g, ' ');
    const attributes = [...stripped.matchAll(/(?:^|\s)([A-Za-z_][\w-]*)/g)]
      .map((attrMatch) => attrMatch[1])
      .filter((name) => !['true', 'false'].includes(name));
    usages.push(attributes);
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

    for (const [index, attributes] of usages.entries()) {
      const where = usages.length > 1 ? `usage #${index + 1}` : 'usage';
      for (const attribute of attributes) {
        if (!schemaByName.has(attribute)) {
          // Spread props cannot be validated.
          if (attribute === '...') continue;
          issues.push({
            severity: 'error',
            message: `Unknown prop "${attribute}" on <${exportName}> (${where}). This prop does not exist in the manifest.`,
          });
        }
      }

      const missingRequired = (manifest.props ?? [])
        .filter((prop) => prop.required)
        .filter((prop) => !attributes.includes(prop.name))
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
