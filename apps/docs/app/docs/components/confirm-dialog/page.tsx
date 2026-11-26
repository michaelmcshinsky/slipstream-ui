import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/confirm-dialog', {
  title: 'ConfirmDialog',
  description: 'Accessible confirmation dialog with async pending state and destructive variant.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('confirm-dialog')}
      id="confirm-dialog"
      title="ConfirmDialog"
      description="Accessible confirmation dialog with async pending state, destructive variant and cancellable actions, built on Dialog."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'open / onOpenChange', type: 'boolean, (open) => void', defaultValue: 'required', description: 'Controlled visibility.' },
        { name: 'title', type: 'string', defaultValue: 'required', description: 'Dialog title (accessible name).' },
        { name: 'description', type: 'string', description: 'Supporting line under the title.' },
        { name: 'onConfirm', type: '() => void | Promise<void>', defaultValue: 'required', description: 'Confirm handler; a promise shows a pending state.' },
        { name: 'confirmLabel / cancelLabel', type: 'string', defaultValue: "'Confirm' / 'Cancel'", description: 'Button labels.' },
        { name: 'destructive', type: 'boolean', defaultValue: 'false', description: 'Red confirm button for destructive actions.' },
      ]}
      accessibility={['Inherits Dialog: focus trap, Escape, backdrop dismissal and focus restoration.', 'Confirm shows aria-busy while a promise runs; dismissal is blocked.']}
    >
      <Demo />
    </ComponentPage>
  );
}
