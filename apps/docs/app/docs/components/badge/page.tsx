import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/badge', {
  title: "Badge",
  description: "A small status indicator component for displaying tags, counts, or status information.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('badge')}
      id="badge"
      title="Badge"
      description="A small status indicator component for displaying tags, counts, or status information."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'asChild', type: 'boolean', defaultValue: 'false', description: 'Render the child (e.g. a router Link) with badge styling.' },
        { name: 'variant', type: "'default' | 'primary' | 'neutral' | 'accent' | 'danger' | 'success' | 'warning' | 'info' | 'secondary' | 'destructive' | 'outline' | 'outline-success' | 'outline-warning' | 'outline-info' | 'outline-danger'", defaultValue: "'default'", description: 'Visual style variant; primary/danger are aliases, outline-* are quiet status tones for metadata chips.' },
        { name: 'dot', type: 'boolean', defaultValue: 'false', description: 'Leading status dot colored to match the variant.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Pill scale: sm for dense tables, lg for hero and metadata strips.' },
        { name: 'children', type: 'ReactNode', defaultValue: 'required', description: 'Content to display' },
      ]}
      accessibility={[
        'Badge content is announced by screen readers',
        'All variants meet WCAG AA contrast requirements',
        'Consider adding aria-label for status-only badges',
        'Use semantic status terminology',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
