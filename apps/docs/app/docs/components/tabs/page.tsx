import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/tabs', {
  title: "Tabs",
  description: "Tabbed content container with ARIA tablist semantics and keyboard navigation.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('tabs')}
      id="tabs"
      title="Tabs"
      description="Tabbed content container with ARIA tablist semantics, size variants, and underline/default strip designs."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'value', type: 'string', description: 'Controlled active tab value.' },
        { name: 'defaultValue', type: 'string', description: 'Initial tab value when uncontrolled.' },
        { name: 'onValueChange', type: '(value: string) => void', description: 'Called when the active tab changes.' },
        { name: 'variant', type: "'default' | 'underline' | 'rounded'", defaultValue: "'default'", description: 'Strip design: enclosed pill track, background-free underline, or fully-rounded pills.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Density for strip and triggers.' },
        { name: 'TabsTrigger className', type: 'string', description: 'Per-trigger overrides (twMerge resolves conflicts with variant/size).' },
      ]}
      accessibility={[
        'role=tablist/tab/tabpanel with aria-selected and aria-controls.',
        'Roving tabindex: only the active tab is tabbable.',
        'Full keyboard operation: ArrowLeft/Right + ArrowUp/Down move AND activate (wrapping), Home/End jump to first/last, Enter/Space activate.',
        'Underline variant keeps a 2px border indicator so state is not color-only.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
