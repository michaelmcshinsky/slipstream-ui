import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { listComponentsTool } from './tools/list-components';
import { getComponentManifestTool } from './tools/get-manifest';
import { getUsageExamplesTool } from './tools/get-usage-examples';
import { validateUsageTool } from './tools/validate-usage';
import { searchComponentsTool } from './tools/search-components';
import { recommendComponentsTool } from './tools/recommend-components';
import packageJson from '../package.json';

const server = new Server(
  {
    name: 'slipstream-ui-mcp-server',
    // Read from the package manifest so the advertised server version cannot
    // drift from the published package.
    version: packageJson.version,
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
      validateUsageTool.definition,
      searchComponentsTool.definition,
      recommendComponentsTool.definition,
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
      case 'validate_usage':
        return await validateUsageTool.handler(args);
      case 'get_usage_examples':
        return await getUsageExamplesTool.handler(args);
      case 'search_components':
        return await searchComponentsTool.handler(args);
      case 'recommend_components':
        return await recommendComponentsTool.handler(args);
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
