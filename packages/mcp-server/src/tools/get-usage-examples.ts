import { getManifest } from '../registry';
import type { McpTool } from './types';

export const getUsageExamplesTool: McpTool = {
  definition: {
    name: 'get_usage_examples',
    description:
      'Get recommended usage examples and composition guidance for a Slipstream UI component.',
    inputSchema: {
      type: 'object',
      properties: { componentId: { type: 'string' } },
      required: ['componentId'],
    },
  },
  handler: async (args) => {
    const componentId = typeof args?.componentId === 'string' ? args.componentId : undefined;
    if (!componentId) throw new Error('componentId is required');
    const data = getManifest(componentId);
    if (!data) throw new Error(`Component not found: ${componentId}`);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              examples: data.examples,
              compositionRules: data.compositionRules ?? [],
              antiPatterns: data.antiPatterns ?? [],
            },
            null,
            2
          ),
        },
      ],
    };
  },
};
