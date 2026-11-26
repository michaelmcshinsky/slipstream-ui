import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/dialog', {
  title: "Dialog",
  description: "Accessible modal dialog with focus trapping, escape-to-close and focus restoration.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('dialog')}
      id="dialog"
      title="Dialog"
      description="Accessible modal dialog with focus trapping, escape-to-close and focus restoration."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'open', type: 'boolean', defaultValue: 'required', description: 'Whether the dialog is visible (controlled)' },
        { name: 'onOpenChange', type: '(open: boolean) => void', defaultValue: 'required', description: 'Open/close requests' },
        { name: 'title', type: 'string', description: 'Accessible name + default header title (optional with a composed header)' },
        { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl' | '2xl'", defaultValue: "'md'", description: 'Panel max-width preset' },
        { name: 'header', type: 'ReactNode', description: 'Replaces the default header: compose DialogHeader/DialogTitle/DialogDescription' },
        { name: 'footer', type: 'ReactNode', description: 'Action row under the body' },
        { name: 'scrollable', type: 'boolean', defaultValue: 'false', description: 'Cap the body height and scroll inside the panel' },
        { name: 'description', type: 'string', defaultValue: '-', description: 'Optional supporting text' },
        { name: 'closeOnBackdrop', type: 'boolean', defaultValue: 'true', description: 'Backdrop click closes the dialog' },
        { name: 'showClose', type: 'boolean', defaultValue: 'true', description: 'Hide the ✕ button in the header (Escape and backdrop still close)' },
        { name: 'initialFocusRef', type: 'RefObject<HTMLElement>', defaultValue: 'first focusable', description: 'Element focused on open' },
        { name: 'animate', type: 'boolean', defaultValue: 'false', description: 'Fade the backdrop and panel in/out (needs tailwindcss-animate)' },
        { name: 'bodyClassName', type: 'string', description: 'Extra classes for the scrollable body region.' },
        { name: 'closeLabel', type: 'string', defaultValue: "'Close dialog'", description: 'Accessible label for the header close button.' },
        { name: 'ariaLabel', type: 'string', description: 'Accessible name when title is omitted; otherwise the title labels the dialog.' },
      ]}
      accessibility={[
        'role=dialog with aria-modal, labelled by title and described by description',
        'Initial focus moves into the dialog and returns to the opener on close',
        'Tab and Shift+Tab wrap inside the dialog',
        'Escape closes the dialog',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
