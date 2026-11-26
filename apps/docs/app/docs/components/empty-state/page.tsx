import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/empty-state', {
  title: 'EmptyState',
  description:
    'Placeholder for empty collections and zero-result searches: icon, title, description and actions.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('empty-state')}
      id="empty-state"
      title="EmptyState"
      description="Placeholder for empty collections, zero-result searches and unconfigured features: title, description and action slots."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'title', type: 'string', defaultValue: 'required', description: 'Primary message.' },
        { name: 'description', type: 'string', description: 'Supporting line explaining the next step.' },
        { name: 'icon', type: 'ReactNode', description: 'Decorative icon above the title.' },
        { name: 'action', type: 'ReactNode | EmptyStateAction', description: 'Primary action as a rendered node, or { label, onClick?, href?, variant? } to have the button/link rendered for you.' },
        { name: 'secondaryAction', type: 'ReactNode', description: 'Secondary action beside the primary one.' },
        { name: 'actions', type: 'ReactNode', description: 'Alias for action.' },
        { name: 'titleAs', type: "'p' | 'h2' | 'h3' | 'h4'", description: 'Heading level for the title; defaults to a paragraph.' },
        { name: 'size', type: "'sm' | 'md'", defaultValue: "'md'", description: 'Compact padding for panels and table bodies.' },
        { name: 'align', type: "'center' | 'start'", defaultValue: "'center'", description: 'Horizontal alignment of content and actions.' },
        { name: 'tone', type: "'plain' | 'panel'", defaultValue: "'plain'", description: "Surface treatment; 'panel' is a tinted solid border for content pages." },
        { name: 'linkComponent', type: 'React.ElementType', description: 'Custom link element for action hrefs.' },
        { name: 'linkHrefProp', type: "'href' | 'to'", defaultValue: "'href'", description: 'Prop used to pass the destination to linkComponent.' },
      ]}
      accessibility={['Actions are real controls, so they stay focusable and announced.', 'Use Alert for failures: empty is a normal state, not an error.']}
    >
      <Demo />
    </ComponentPage>
  );
}
