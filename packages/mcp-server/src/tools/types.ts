/** JSON-schema-ish shape accepted by the MCP SDK for tool input schemas. */
export type McpToolSchema = {
  type: 'object';
  properties?: Record<string, unknown>;
  required?: string[];
};

export type McpToolResult = {
  content: { type: 'text'; text: string }[];
  isError?: boolean;
  /** Allows assignment to the SDK's permissive result record shape. */
  [key: string]: unknown;
};

export type McpTool = {
  definition: {
    name: string;
    description: string;
    inputSchema: McpToolSchema;
  };
  handler: (args: Record<string, unknown> | undefined) => Promise<McpToolResult>;
};
