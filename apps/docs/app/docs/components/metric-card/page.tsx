import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/metric-card', {
  title: 'MetricCard',
  description:
    'KPI tile with label, value, directional delta (arrow + color) and supporting hint.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('metric-card')}
      id="metric-card"
      title="MetricCard"
      description="KPI tile: label, value, directional delta (arrow + color) and a supporting hint."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'label', type: 'string', description: 'Metric name. Alias: title.' },
        { name: 'title', type: 'string', description: 'Alias for label (migration-friendly).' },
        { name: 'value', type: 'string | number', defaultValue: 'required', description: 'Primary value, rendered tabular.' },
        { name: 'delta', type: 'string', description: 'Signed change, e.g. +12.4%.' },
        { name: 'trend', type: "'up' | 'down' | 'flat'", defaultValue: "'flat'", description: 'Delta direction color + arrow glyph.' },
        { name: 'hint', type: 'string', description: 'Comparison context (vs last month). Alias: description.' },
        { name: 'description', type: 'string', description: 'Alias for hint (migration-friendly).' },
        { name: 'icon', type: 'ReactNode', description: 'Decorative icon.' },
        { name: 'tone', type: "'default' | 'success' | 'warning' | 'destructive'", defaultValue: "'default'", description: 'Semantic color for the value (not the delta).' },
        { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Renders a skeleton instead of the value and sets aria-busy.' },
      ]}
      accessibility={['Deltas always render ↑/↓/→ glyphs, so direction is never color-only.', 'Values use tabular-nums so columns align.']}
    >
      <Demo />
    </ComponentPage>
  );
}
