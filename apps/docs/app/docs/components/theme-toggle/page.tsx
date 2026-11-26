import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/theme-toggle', {
  title: 'ThemeToggle',
  description: 'Presentational light/dark toggle with accessible labels and sun/moon state.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('theme-toggle')}
      id="theme-toggle"
      title="ThemeToggle"
      description="The button and its accessible label. The consumer owns persistence and the actual class/attribute switch."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'theme', type: "'light' | 'dark'", description: 'Current theme.' },
        { name: 'onThemeChange', type: "(theme: 'light' | 'dark') => void", description: 'Fired with the next theme.' },
        { name: 'labels', type: '{ toLight?: string; toDark?: string }', description: 'Accessible labels for the next action.' },
        { name: 'size', type: "'sm' | 'md'", defaultValue: "'md'", description: 'Control size.' },
      ]}
      accessibility={[
        'aria-label and title describe the next action.',
        'Native button with Enter/Space activation and a visible focus ring.',
        'Icons are aria-hidden; the label carries the meaning.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
