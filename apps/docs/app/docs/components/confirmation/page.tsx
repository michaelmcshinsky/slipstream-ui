import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/confirmation', {
  title: "Confirmation",
  description: "Human-in-the-loop approval gate for agent actions. Pauses tool execution until the user approves or rejects: the standard pattern for destructive operations.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('confirmation')}
      id="confirmation"
      title="Confirmation"
      description="Human-in-the-loop approval gate for agent actions. Pauses tool execution until the user approves or rejects: the standard pattern for destructive operations."
      npmPackages="@slipstream-ui/ai"
      propsRows={[
        { name: 'title', type: 'string', description: 'Summary of the action requiring approval.' },
        { name: 'description', type: 'string', description: 'Detail: affected resource or risk note.' },
        { name: 'toolName', type: 'string', description: 'Tool name shown as mono text.' },
        { name: 'status', type: "'pending' | 'approved' | 'rejected'", defaultValue: "'pending'", description: 'Controlled outcome; omit for uncontrolled.' },
        { name: 'variant', type: "'default' | 'warning' | 'destructive' | 'info' | 'success'", defaultValue: "'default'", description: 'Accent color of the pending card; outcome chips always follow the result.' },
        { name: 'approveVariant', type: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'", defaultValue: "'default'", description: 'Button variant for the approve action.' },
        { name: 'rejectVariant', type: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'", defaultValue: "'outline'", description: 'Button variant for the reject action.' },
        { name: 'showActions', type: 'boolean', defaultValue: 'true', description: 'Hide the action buttons (controlled-only gate; status drives the chip).' },
        { name: 'labels', type: '{ approve?, reject?, approved?, rejected? }', description: 'Wording overrides for the buttons and outcome chips.' },
        { name: 'onApprove', type: '() => void', description: 'Called on approval.' },
        { name: 'onReject', type: '() => void', description: 'Called on rejection.' },
      ]}
      accessibility={[
        'Pending state renders role=alertdialog labeled by the title.',
        'Outcome chip announces Approved/Rejected.',
        'Never auto-approve on timeout: keep waiting or fail explicitly.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
