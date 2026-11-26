import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/alert', {
  title: "Alert",
  description: "Inline alert for status messages with semantic variants.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('alert')}
      id="alert"
      title="Alert"
      description="Inline alert for status messages with semantic variants."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'variant', type: "'default' | 'destructive' | 'danger' | 'success' | 'warning' | 'info'", defaultValue: "'default'", description: 'Semantic style variant; danger is an alias of destructive kept for Bootstrap/shadcn-style codebases.' },
        { name: 'children', type: 'ReactNode', description: 'Alert content (AlertTitle and AlertDescription).' },
      ]}
      accessibility={[
        'role=alert announces the content when it appears.',
        'AlertTitle renders as h5; maintain logical heading order.',
        'Every semantic variant meets WCAG AA text contrast in light and dark modes.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
