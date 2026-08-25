import { loadRegistry } from '../registry';

/** JSON-schema-ish shape accepted by the MCP SDK for tool input schemas. */
export interface McpToolSchema {
  type: 'object';
  properties?: Record<string, unknown>;
  required?: string[];
}

export interface McpToolResult {
  content: { type: 'text'; text: string }[];
  isError?: boolean;
  /** Allows assignment to the SDK's permissive result record shape. */
  [key: string]: unknown;
}

export interface McpTool {
  definition: {
    name: string;
    description: string;
    inputSchema: McpToolSchema;
  };
  handler: (args: Record<string, unknown> | undefined) => Promise<McpToolResult>;
}

export const listComponentsTool: McpTool = {
  definition: {
    name: 'list_components',
    description:
      'List available Slipstream UI components, optionally filtered by package or atomic-design tier.',
    inputSchema: {
      type: 'object',
      properties: {
        package: { type: 'string', enum: ['@slipstream-ui/core', '@slipstream-ui/ai'] },
        tier: { type: 'string', enum: ['atom', 'molecule', 'organism', 'pattern'] },
      },
    },
  },
  handler: async (args) => {
    let components = loadRegistry().map(({ id, name, package: packageName, tier, description }) => ({
      id,
      name,
      package: packageName,
      tier,
      description,
    }));
    if (typeof args?.package === 'string') {
      components = components.filter((component) => component.package === args.package);
    }
    if (typeof args?.tier === 'string') {
      components = components.filter((component) => component.tier === args.tier);
    }
    return { content: [{ type: 'text', text: JSON.stringify(components, null, 2) }] };
  },
};
