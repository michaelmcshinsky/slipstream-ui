import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/filter-panel', {
  title: 'FilterPanel',
  description: 'Structured filter panel with collapsible sections and reset/apply actions.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('filter-panel')}
      id="filter-panel"
      title="FilterPanel"
      description="Structured filter panel with collapsible sections and reset/apply actions."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'sections', type: 'FilterSection[]', defaultValue: 'required', description: 'Filter groups: title, optional description, content and defaultOpen.' },
        { name: 'title', type: 'string', defaultValue: "'Filters'", description: 'Panel heading.' },
        { name: 'description', type: 'string', description: 'Supporting copy under the panel heading.' },
        { name: 'onReset', type: '() => void', description: 'Reset action shown in the footer.' },
        { name: 'onApply', type: '() => void', description: 'Apply action shown in the footer.' },
        { name: 'resetLabel', type: 'string', defaultValue: "'Reset'", description: 'Reset button label.' },
        { name: 'applyLabel', type: 'string', defaultValue: "'Apply'", description: 'Apply button label.' },
        { name: 'collapsible', type: 'boolean', defaultValue: 'true', description: 'Allow sections to collapse.' },
        { name: 'defaultOpen', type: 'string[]', description: 'Section titles open on first render.' },
        { name: 'actions', type: 'ReactNode', description: 'Extra footer content.' },
        { name: 'as', type: "'div' | 'aside' | 'section'", defaultValue: "'div'", description: 'Semantic element.' },
      ]}
      accessibility={[
        'Each section header is a button with aria-expanded and aria-controls.',
        'Panel title is h2 and section titles are h3.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
