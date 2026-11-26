import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/auth-layout', {
  title: 'AuthLayout',
  description:
    'Centered authentication surface with brand, title/description, form card and footer.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('auth-layout')}
      id="auth-layout"
      title="AuthLayout"
      description="Authentication surface with a centered card or a split form/aside layout, plus brand, title, footer and size presets."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'title', type: 'string', defaultValue: 'required', description: 'Card heading (h1).' },
        { name: 'description', type: 'string', description: 'Supporting line under the heading.' },
        { name: 'subtitle', type: 'string', description: 'Alias for description (migration-friendly).' },
        { name: 'brand', type: 'ReactNode', description: 'Mark rendered above the card.' },
        { name: 'logo', type: 'ReactNode', description: 'Alias for brand (migration-friendly).' },
        { name: 'footer', type: 'ReactNode', description: 'Links/legal copy under the card.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Card width preset.' },
        { name: 'variant', type: "'centered' | 'split'", defaultValue: "'centered'", description: 'Split renders the form beside an aside on desktop.' },
        { name: 'aside', type: 'ReactNode', description: 'Optional panel for the split variant; omitting it falls back to centered.' },
        { name: 'maxWidth', type: 'number | string', description: 'Overrides the card width: pixels (420) or any CSS width ("26rem").' },
      ]}
      accessibility={['Owns the page h1; keep the form free of additional h1s.', 'Centered layout keeps the form reachable on small screens.', 'The split variant keeps DOM order form then aside, so keyboard order stays correct.']}
    >
      <Demo />
    </ComponentPage>
  );
}
