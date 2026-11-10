import type { MetadataRoute } from 'next';
import { COMPONENT_COUNT } from '@/lib/component-count';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Slipstream UI',
    short_name: 'Slipstream',
    description:
      'AI-first React component library. Every component ships a machine-readable manifest, an MCP server, and a usage validator.',
    id: '/',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    lang: 'en',
    dir: 'ltr',
    categories: ['developer', 'developer tools', 'productivity', 'education'],
    background_color: '#0b1220',
    theme_color: '#0b1220',
    icons: [
      { src: '/icon.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
    shortcuts: [
      { name: 'Documentation', url: '/docs', description: 'Install, theme and compose components' },
      { name: 'Components', url: '/docs/components', description: `Browse ${COMPONENT_COUNT} components` },
      { name: 'MCP server', url: '/docs/mcp', description: 'Connect an agent to the manifest registry' },
    ],
  };
}
