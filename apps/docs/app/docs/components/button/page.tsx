import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/button', {
  title: "Button",
  description: "A clickable button component with variants for different visual styles and sizes.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('button')}
      id="button"
      title="Button"
      description="A clickable button component with variants for different visual styles and sizes."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'variant', type: "'default' | 'primary' | 'destructive' | 'danger' | 'success' | 'warning' | 'info' | 'outline' | 'outline-destructive' | 'outline-success' | 'outline-warning' | 'outline-info' | 'secondary' | 'ghost' | 'link' | 'contrast' | 'onDark'", defaultValue: "'default'", description: 'Visual style variant. primary/danger are aliases of default/destructive; contrast/onDark are fixed-ink fills for always-dark surfaces (hero sections) that do not follow the theme.' },
        { name: 'size', type: "'default' | 'sm' | 'xs' | 'lg' | 'icon'", defaultValue: "'default'", description: 'Size variant' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the button' },
        { name: 'asChild', type: 'boolean', defaultValue: 'false', description: 'Renders the child element (e.g. <a>, <Link>) with button styling instead of a <button>.' },
        { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Disables the button and swaps the label for a spinner (used by ConfirmDialog internally).' },
        { name: 'loadingLabel', type: 'string', defaultValue: "'Loading'", description: 'Accessible label announced while loading.' },
      ]}
      accessibility={[
        'Full keyboard navigation with Enter and Space keys',
        'Screen reader support with proper ARIA attributes',
        'Disabled state is properly announced',
        'Visible focus indicator for keyboard users',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
