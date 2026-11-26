import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/streaming-indicator', {
  title: "StreamingIndicator",
  description: "Give immediate feedback while an assistant response is arriving.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('streaming-indicator')}
      id="streaming-indicator"
      title="StreamingIndicator"
      description="Give immediate feedback while an assistant response is arriving."
      npmPackages="@slipstream-ui/ai"
      propsRows={[
        { name: 'isStreaming', type: 'boolean', defaultValue: 'required', description: 'Render the indicator only while a response is arriving' },
        { name: 'text', type: 'string', defaultValue: "'Generating...'", description: 'Label rendered beside the dots and used as the accessible name' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Dot and label scale' },
        { name: 'tone', type: "'primary' | 'muted' | 'current'", defaultValue: "'primary'", description: 'Dot colour: brand primary, muted foreground, or the inherited text colour' },
        { name: 'dotCount', type: 'number', defaultValue: '3', description: 'How many dots pulse' },
        { name: 'showLabel', type: 'boolean', defaultValue: 'true', description: 'Hide the label visually; the text stays the accessible name' },
      ]}
      accessibility={[
        'role="status" with aria-live="polite" announces generation once.',
        'The dots are decorative; the text is the accessible name.',
        'Pulse animation is suppressed under prefers-reduced-motion.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
