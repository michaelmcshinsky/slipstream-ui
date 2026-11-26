import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/toast', {
  title: "Toast",
  description: "Accessible app-level notifications announced through a polite live region, with auto-dismiss, stacking and optional actions.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('toast')}
      id="toast"
      title="Toast"
      description="Accessible app-level notifications announced through a polite live region, with auto-dismiss, stacking and optional actions."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'title', type: 'string', defaultValue: 'required', description: 'Short heading announced with the toast' },
        { name: 'description', type: 'string', defaultValue: '—', description: 'Optional supporting detail' },
        { name: 'variant', type: "'default' | 'success' | 'error' | 'warning' | 'info'", defaultValue: "'default'", description: 'Status tint for the toast.' },
        { name: 'action', type: '{ label, onClick }', defaultValue: '—', description: 'Inline action; invoking dismisses the toast' },
        { name: 'duration', type: 'number', defaultValue: '5000', description: 'Auto-dismiss delay in ms; 0 keeps it until dismissed' },
        { name: 'Toaster.position', type: 'ToasterPosition', defaultValue: "'bottom-right'", description: 'Corner/edge the stack renders at.' },
        { name: 'Toaster.richColors', type: 'boolean', defaultValue: 'false', description: 'Tint toast surfaces with their status color.' },
        { name: 'Toaster.label', type: 'string', defaultValue: "'Notifications'", description: 'Accessible name of the live region.' },
        { name: 'Toaster.dismissLabel', type: 'string', defaultValue: "'Dismiss notification'", description: 'Accessible label for each dismiss button.' },
      ]}
      accessibility={[
        'Toasts render inside role=status (implicit polite live region)',
        'Container is a labelled list for screen-reader navigation',
        'Actions and dismiss controls are regular keyboard-reachable buttons',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
