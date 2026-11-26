import type { Metadata } from 'next';
import Demo from './demo';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/date-range-picker', {
  title: 'DateRangePicker',
  description: 'Start/end date range with ISO strings and quick presets.',
});

export default function Page() {
  return <Demo manifest={getRegistryManifest('date-range-picker')} />;
}
