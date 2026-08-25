import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { listComponentsTool } from './tools/list-components';
import { getComponentManifestTool } from './tools/get-manifest';
import { getUsageExamplesTool } from './tools/get-usage-examples';

const server = new Server(
  {
    name: 'slipstream-ui-mcp-server',
    version: '0.0.1',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      listComponentsTool.definition,
      getComponentManifestTool.definition,
      getUsageExamplesTool.definition,
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'list_components':
        return await listComponentsTool.handler(args);
      case 'get_component_manifest':
        return await getComponentManifestTool.handler(args);
      case 'get_usage_examples':
        return await getUsageExamplesTool.handler(args);
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Slipstream UI MCP server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
