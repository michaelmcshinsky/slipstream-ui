import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/response', {
  title: "Response",
  description: "Streaming-optimized markdown renderer for AI responses: GitHub-flavored markdown, automatic repair of incomplete syntax while tokens arrive, and code blocks routed through CodeBlock.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('response')}
      id="response"
      title="Response"
      description="Streaming-optimized markdown renderer for AI responses: GitHub-flavored markdown, automatic repair of incomplete syntax while tokens arrive, and code blocks routed through CodeBlock."
      propsRows={[
        { name: 'children', type: 'string', description: 'Markdown content to render.' },
        { name: 'parseIncompleteMarkdown', type: 'boolean', defaultValue: 'true', description: 'Close unclosed emphasis/inline-code/fences during streaming.' },
      ]}
      accessibility={[
        'Headings, lists, and tables render as real semantic elements.',
        'Code blocks use the accessible CodeBlock copy control.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
