import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/code-block', {
  title: "CodeBlock",
  description: "Syntax-highlighted code with a language label and one-click copy. Used internally by Response and available standalone.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('code-block')}
      id="code-block"
      title="CodeBlock"
      description="Syntax-highlighted code with a language label and one-click copy: the single shared code surface: every code example on this site renders through it (also used internally by Response)."
      npmPackages="@slipstream-ui/ai"
      propsRows={[
        { name: 'code', type: 'string', description: 'Raw code to display.' },
        { name: 'language', type: 'string', defaultValue: "'tsx'", description: 'Prism language identifier.' },
        { name: 'showCopyButton', type: 'boolean', defaultValue: 'true', description: 'Show/hide the copy control.' },
        { name: 'onCopied', type: '(code: string) => void', description: 'Called with the code after a successful clipboard write.' },
      ]}
      accessibility={[
        'Copy button carries an aria-label that flips to "Copied".',
        'Language label is plain text; code remains selectable.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
