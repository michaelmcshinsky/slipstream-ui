import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/announcement-bar', {
  title: 'AnnouncementBar',
  description: 'Dismissible announcement bar with optional action, tone and sticky positioning.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('announcement-bar')}
      id="announcement-bar"
      title="AnnouncementBar"
      description="Dismissible announcement bar with optional action, tone and sticky positioning."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'message', type: 'ReactNode', defaultValue: 'required', description: 'Message shown in the bar.' },
        { name: 'href', type: 'string', description: 'Optional destination for the action.' },
        { name: 'actionLabel', type: 'string', description: 'Action text, shown when href is provided.' },
        { name: 'dismissible', type: 'boolean', defaultValue: 'true', description: 'Show a close control.' },
        { name: 'onDismiss', type: '() => void', description: 'Called after dismissal.' },
        { name: 'tone', type: "'muted' | 'brand' | 'inverse'", defaultValue: "'muted'", description: 'Surface treatment.' },
        { name: 'sticky', type: 'boolean', defaultValue: 'false', description: 'Pin the bar to the top.' },
        { name: 'linkComponent', type: 'React.ElementType', description: 'Custom link element for routers.' },
        { name: 'linkHrefProp', type: "'href' | 'to'", defaultValue: "'href'", description: 'Prop name used to pass the destination to linkComponent.' },
      ]}
      accessibility={[
        'Renders a named region (Announcement) with a keyboard-operable dismiss button.',
        'The caller owns persistence and dismissal policy.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
