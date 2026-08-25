import { getManifest } from '../registry';
import type { McpTool } from './types';

export const getComponentManifestTool: McpTool = {
  definition: {
    name: 'get_component_manifest',
    description:
      'Get the full COMPONENT_MANIFEST for a component, including props, examples, accessibility, and composition rules.',
    inputSchema: {
      type: 'object',
      properties: {
        componentId: { type: 'string', description: 'Kebab-case component ID, such as button or prompt-input.' },
      },
      required: ['componentId'],
    },
  },
  handler: async (args) => {
    const componentId = typeof args?.componentId === 'string' ? args.componentId : undefined;
    if (!componentId) throw new Error('componentId is required');
    const manifest = getManifest(componentId);
    if (!manifest) throw new Error(`Component not found: ${componentId}`);
    return { content: [{ type: 'text', text: JSON.stringify(manifest, null, 2) }] };
  },
};
