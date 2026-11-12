import { getManifest, loadRegistry, type RegistryManifest } from '../registry';
import type { McpTool } from './types';

type UsageIssue = {
  severity: 'error' | 'warning';
  message: string;
  /** Concrete next action an agent can apply without more context. */
  fix?: string;
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

type ComponentValidation = {
  componentId: string;
  exportName: string;
  usageCount: number;
  valid: boolean;
  issues: UsageIssue[];
};

type SourceFile = {
  path: string;
  code: string;
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

/** Levenshtein distance, used to suggest the prop the author probably meant. */
function editDistance(a: string, b: string): number {
  const cols = b.length + 1;
  let previous: number[] = Array.from({ length: cols }, (_, index) => index);

  for (let row = 1; row <= a.length; row += 1) {
    const current: number[] = [row];
    for (let col = 1; col < cols; col += 1) {
      const cost = a[row - 1] === b[col - 1] ? 0 : 1;
      current[col] = Math.min(
        previous[col] + 1,
        current[col - 1] + 1,
        previous[col - 1] + cost
      );
    }
    previous = current;
  }

  return previous[cols - 1];
}

/** Closest candidate within a length-relative threshold, else undefined. */
function closestMatch(value: string, candidates: string[]): string | undefined {
  const needle = value.toLowerCase();
  let best: { candidate: string; distance: number } | undefined;
  for (const candidate of candidates) {
    const distance = editDistance(needle, candidate.toLowerCase());
    if (!best || distance < best.distance) best = { candidate, distance };
  }
  if (!best) return undefined;
  const threshold = Math.max(2, Math.floor(value.length / 3));
  return best.distance <= threshold ? best.candidate : undefined;
}

function exportNameOf(manifest: RegistryManifest): string {
  return manifest.exportName ?? manifest.name.replace(/\s/g, '');
}

/** Validate every usage of one component in a single source string. */
function validateComponentUsage(
  manifest: RegistryManifest,
  code: string
): ComponentValidation {
  const issues: UsageIssue[] = [];
  const exportName = exportNameOf(manifest);
  const schemaByName = new Map((manifest.props ?? []).map((prop) => [prop.name, prop]));
  const documentedProps = [...schemaByName.keys()].filter((name) => name !== 'children');

  const usages = findComponentUsages(code, exportName);
  if (usages.length === 0 && code.includes(exportName)) {
    issues.push({
      severity: 'warning',
      message: `Found "${exportName}" in code but not as a JSX element; verify it is used as <${exportName} ... />.`,
      fix: `Replace the text reference with a rendered element, for example <${exportName} />.`,
    });
  }
  if (usages.length === 0) {
    issues.push({
      severity: 'error',
      message: `No <${exportName}> usage found in the provided code.`,
      fix: `Render the component as <${exportName} ... /> in this file.`,
    });
  }

  for (const [index, usage] of usages.entries()) {
    const where = usages.length > 1 ? `usage #${index + 1}` : 'usage';

    for (const attribute of usage.attributes) {
      const schema = schemaByName.get(attribute.name);
      if (!schema) {
        // Spread props cannot be validated; native HTML attributes are
        // inherited through ...props and are intentionally not in manifests.
        if (attribute.name === '...' || isNativeAttribute(attribute.name)) continue;
        const suggestion = closestMatch(attribute.name, documentedProps);
        issues.push({
          severity: 'error',
          message: `Unknown prop "${attribute.name}" on <${exportName}> (${where}). This prop does not exist in the manifest.`,
          fix: suggestion
            ? `Rename "${attribute.name}" to "${suggestion}" on <${exportName}>.`
            : `Remove "${attribute.name}". Documented props: ${documentedProps.slice(0, 8).join(', ')}${documentedProps.length > 8 ? ', ...' : ''}.`,
        });
        continue;
      }

      if (schema.enum && attribute.value !== undefined && !schema.enum.includes(attribute.value)) {
        const suggestion = closestMatch(attribute.value, schema.enum);
        issues.push({
          severity: 'error',
          message: `Invalid value "${attribute.value}" for prop "${attribute.name}" on <${exportName}> (${where}). Allowed values: ${schema.enum.join(', ')}.`,
          fix: suggestion
            ? `Set ${attribute.name}="${suggestion}" (nearest allowed value; allowed: ${schema.enum.join(', ')}).`
            : `Set ${attribute.name} to one of: ${schema.enum.join(', ')}.`,
        });
      }
    }

    const missingRequired = (manifest.props ?? [])
      .filter((prop) => prop.required)
      .filter((prop) => {
        if (prop.name === 'children') {
          return !usage.hasChildren && !usage.attributes.some((a) => a.name === prop.name);
        }
        return !usage.attributes.some((a) => a.name === prop.name);
      });

    if (missingRequired.length > 0) {
      const names = missingRequired.map((prop) => `"${prop.name}"`);
      const fixes = missingRequired.map(
        (prop) => `${prop.name}${prop.type ? ` (${prop.type})` : ''}`
      );
      issues.push({
        severity: 'error',
        message: `Missing required prop(s) on <${exportName}> (${where}): ${names.join(', ')}.`,
        fix: `Add ${fixes.join(', ')} to <${exportName}>.`,
      });
    }
  }

  return {
    componentId: manifest.id,
    exportName,
    usageCount: usages.length,
    valid: issues.filter((issue) => issue.severity === 'error').length === 0 && usages.length > 0,
    issues,
  };
}

/** PascalCase JSX tags in a file, deduplicated and in first-seen order. */
function findJsxTagNames(code: string): string[] {
  const seen = new Set<string>();
  const tags: string[] = [];
  const pattern = /<([A-Z][A-Za-z0-9_]*)/g;
  let match = pattern.exec(code);
  while (match) {
    const name = match[1];
    if (!seen.has(name)) {
      seen.add(name);
      tags.push(name);
    }
    match = pattern.exec(code);
  }
  return tags;
}

function readSources(args: Record<string, unknown> | undefined): SourceFile[] {
  const raw = args?.files;
  if (!Array.isArray(raw) || raw.length === 0) return [];
  return raw
    .filter((entry): entry is Record<string, unknown> => typeof entry === 'object' && entry !== null)
    .map((entry, index) => ({
      path: typeof entry.path === 'string' ? entry.path : `file-${index + 1}.tsx`,
      code: typeof entry.code === 'string' ? entry.code : '',
    }));
}

export const validateUsageTool: McpTool = {
  definition: {
    name: 'validate_usage',
    description:
      'Validate generated JSX against Slipstream UI manifests before emitting it. Detects unknown (hallucinated) props, invalid enum values and missing required props, and returns a concrete fix for each issue. Pass componentId + code for one component, or files to validate a whole tree and infer every Slipstream component used in each file.',
    inputSchema: {
      type: 'object',
      properties: {
        componentId: { type: 'string', description: 'Kebab-case component ID, such as button or prompt-input. Use with code.' },
        code: { type: 'string', description: 'The JSX code to validate. Use with componentId.' },
        files: {
          type: 'array',
          description: 'Whole-tree mode: validate every Slipstream component found in each file. Requires path and code per entry.',
          items: {
            type: 'object',
            properties: {
              path: { type: 'string', description: 'File path, echoed in the results.' },
              code: { type: 'string', description: 'File contents.' },
            },
            required: ['path', 'code'],
          },
        },
      },
    },
  },
  handler: async (args) => {
    const sources = readSources(args);
    const componentId = typeof args?.componentId === 'string' ? args.componentId : undefined;
    const code = typeof args?.code === 'string' ? args.code : undefined;

    if (sources.length > 0) {
      const byExportName = new Map<string, RegistryManifest>();
      for (const manifest of loadRegistry()) {
        byExportName.set(exportNameOf(manifest), manifest);
      }

      let errors = 0;
      let warnings = 0;
      let componentsChecked = 0;
      const skippedTags = new Set<string>();

      const files = sources.map((file) => {
        const results: ComponentValidation[] = [];
        for (const tag of findJsxTagNames(file.code)) {
          const manifest = byExportName.get(tag);
          if (!manifest) {
            skippedTags.add(tag);
            continue;
          }
          const result = validateComponentUsage(manifest, file.code);
          componentsChecked += 1;
          for (const issue of result.issues) {
            if (issue.severity === 'error') errors += 1;
            else warnings += 1;
          }
          results.push(result);
        }
        return {
          path: file.path,
          valid: results.every((result) => result.valid),
          components: results,
        };
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                mode: 'tree',
                valid: errors === 0,
                fileCount: files.length,
                summary: {
                  files: files.length,
                  components: componentsChecked,
                  errors,
                  warnings,
                  skippedTags: [...skippedTags],
                },
                files,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    if (!componentId) {
      throw new Error('Provide componentId + code, or files for whole-tree validation');
    }
    if (code === undefined) throw new Error('code is required');

    const manifest = getManifest(componentId);
    if (!manifest) throw new Error(`Component not found: ${componentId}`);

    const result = validateComponentUsage(manifest, code);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              componentId,
              valid: result.valid,
              usageCount: result.usageCount,
              issues: result.issues,
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
