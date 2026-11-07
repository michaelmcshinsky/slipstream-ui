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
 * Native HTML/React attributes are inherited through `...props` and are not
 * documented in manifests (manifests list component-specific props). Treat
 * them as valid so the validator catches hallucinated props without flagging
 * standard DOM attributes.
 */
const NATIVE_ATTRIBUTES = new Set([
  'id', 'name', 'className', 'style', 'title', 'role', 'tabIndex', 'disabled',
  'required', 'placeholder', 'type', 'value', 'defaultValue', 'checked',
  'defaultChecked', 'form', 'autoComplete', 'autoFocus', 'min', 'max', 'step',
  'multiple', 'readOnly', 'hidden', 'target', 'rel', 'href', 'src', 'alt',
  'width', 'height', 'htmlFor', 'children', 'key', 'ref', 'dir', 'lang',
  'draggable', 'contentEditable', 'spellCheck', 'accept', 'capture', 'files',
  'rows', 'cols', 'wrap', 'maxLength', 'minLength', 'pattern', 'size',
  'inputMode', 'enterKeyHint', 'download', 'referrerPolicy', 'crossOrigin',
  'loading', 'decoding', 'srcSet', 'sizes', 'media', 'poster', 'controls',
  'loop', 'muted', 'preload', 'playsInline', 'colSpan', 'rowSpan', 'scope',
  'headers', 'abbr', 'dateTime', 'open', 'start', 'reversed', 'valueAsNumber',
]);

function isNativeAttribute(name: string): boolean {
  return (
    NATIVE_ATTRIBUTES.has(name) ||
    name.startsWith('aria-') ||
    name.startsWith('data-') ||
    /^on[A-Z]/.test(name)
  );
}

/** Read a balanced `{...}` expression starting at `start`. */
function readBalanced(code: string, start: number): number {
  let depth = 0;
  let quote: string | null = null;
  for (let index = start; index < code.length; index += 1) {
    const char = code[index];
    if (quote) {
      if (char === '\\') {
        index += 1;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }
    if (char === '"' || char === "'" || char === '`') {
      quote = char;
    } else if (char === '{') {
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  return code.length - 1;
}

/**
 * Find the `>` that closes an opening tag, ignoring `>` inside quoted strings
 * and brace expressions (nested JSX such as `brand={<Logo />}`).
 */
function findOpeningTagEnd(code: string, start: number): number {
  let braceDepth = 0;
  let quote: string | null = null;
  for (let index = start; index < code.length; index += 1) {
    const char = code[index];
    if (quote) {
      if (char === '\\') {
        index += 1;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
    } else if (char === '{') {
      braceDepth += 1;
    } else if (char === '}') {
      braceDepth = Math.max(0, braceDepth - 1);
    } else if (char === '>' && braceDepth === 0) {
      return index;
    }
  }
  return -1;
}

function parseAttributes(raw: string): ComponentAttribute[] {
  const attributes: ComponentAttribute[] = [];
  let index = 0;

  while (index < raw.length) {
    while (index < raw.length && /\s/.test(raw[index])) index += 1;
    if (index >= raw.length) break;
    if (raw[index] === '/') {
      index += 1;
      continue;
    }
    if (raw[index] === '{') {
      // Spread props cannot be validated.
      attributes.push({ name: '...' });
      index = readBalanced(raw, index) + 1;
      continue;
    }

    const nameStart = index;
    while (index < raw.length && /[A-Za-z0-9_:-]/.test(raw[index])) index += 1;
    if (index === nameStart) {
      index += 1;
      continue;
    }
    const name = raw.slice(nameStart, index);

    while (index < raw.length && /\s/.test(raw[index])) index += 1;
    let value: string | undefined;
    if (raw[index] === '=') {
      index += 1;
      while (index < raw.length && /\s/.test(raw[index])) index += 1;
      if (raw[index] === '"' || raw[index] === "'") {
        const quote = raw[index];
        index += 1;
        const valueStart = index;
        while (index < raw.length && raw[index] !== quote) index += 1;
        value = raw.slice(valueStart, index);
        index += 1;
      } else if (raw[index] === '{') {
        index = readBalanced(raw, index) + 1;
      }
    }

    attributes.push({ name, value });
  }

  return attributes;
}

/**
 * Extract attribute names from JSX usages of the component. Handles JSX-valued
 * props, arrow functions, and nested elements inside attribute braces.
 */
function findComponentUsages(code: string, exportName: string): ComponentUsage[] {
  const usages: ComponentUsage[] = [];
  let searchFrom = 0;

  while (searchFrom < code.length) {
    const start = code.indexOf(`<${exportName}`, searchFrom);
    if (start === -1) break;

    const afterName = code[start + exportName.length + 1];
    if (afterName && !/[\s/>]/.test(afterName)) {
      searchFrom = start + 1;
      continue;
    }

    const end = findOpeningTagEnd(code, start);
    if (end === -1) break;

    const raw = code.slice(start + exportName.length + 1, end);
    const selfClosing = /\/\s*$/.test(raw);
    const attributes = parseAttributes(raw);

    let hasChildren = false;
    if (!selfClosing) {
      const after = code.slice(end + 1);
      const closing = new RegExp(`</${exportName}\\s*>`).exec(after);
      hasChildren = closing !== null && after.slice(0, closing.index).trim().length > 0;
    }

    usages.push({ attributes, selfClosing, hasChildren });
    searchFrom = end + 1;
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
          // Spread props cannot be validated; native HTML attributes are
          // inherited through ...props and are intentionally not in manifests.
          if (attribute.name === '...' || isNativeAttribute(attribute.name)) continue;
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
