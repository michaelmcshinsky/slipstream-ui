import type { Metadata } from 'next';
import HomePage from '@/components/site/home-page';
import { JsonLd } from '@/components/site/json-ld';
import { softwareApplicationSchema } from '@/lib/structured-data';

export const metadata: Metadata = {
  // Absolute so the layout's "%s · Slipstream UI" template doesn't double the brand.
  title: { absolute: 'Slipstream UI — the AI-first React component library' },
  description:
    'AI-native React components with machine-readable specs, an MCP server, and a usage validator. Stateless, accessible, Tailwind-native — your AI writes correct UI the first time.',
  alternates: { canonical: '/' },
};

export default function Page() {
  return (
    <>
      <JsonLd data={softwareApplicationSchema()} />
      <HomePage />
    </>
  );
}
