import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/drawer', {
  title: 'Drawer',
  description:
    'Edge sheet for secondary flows: slides from any side (sm/md/lg), with Dialog-grade modal semantics (portal, focus trap, Escape, focus restoration).',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('drawer')}
      id="drawer"
      title="Drawer"
      description="Edge sheet for secondary flows: slides from any side (sm/md/lg), with Dialog-grade modal semantics (portal, focus trap, Escape, focus restoration)."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'open', type: 'boolean', defaultValue: 'required', description: 'Whether the drawer is visible (controlled).' },
        { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Close requests (✕, Escape, backdrop, your own triggers).' },
        { name: 'onClose', type: '() => void', description: 'Close-request alias for onOpenChange(false); used when only a close handler is passed.' },
        { name: 'title', type: 'string', defaultValue: 'required', description: 'Accessible dialog name rendered as the header title.' },
        { name: 'description', type: 'string', description: 'Supporting line under the title (wired via aria-describedby).' },
        { name: 'side', type: "'left' | 'right' | 'top' | 'bottom'", defaultValue: "'right'", description: 'Edge the drawer slides from.' },
        { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl' | '2xl'", defaultValue: "'md'", description: 'Preset extent along the side axis (width for sides, height for top/bottom).' },
        { name: 'width', type: 'number | string', description: 'Custom extent for left/right drawers: pixels (520) or any CSS length ("70vw"). Overrides size.' },
        { name: 'height', type: 'number | string', description: 'Custom extent for top/bottom drawers - pixels (320) or any CSS length ("60vh"). Overrides size.' },
        { name: 'resizable', type: 'boolean', defaultValue: 'false', description: 'Drag the inner edge to resize a left/right drawer. Arrow keys nudge 16px, Shift+Arrow 64px, Home/End jump to the bounds.' },
        { name: 'minWidth', type: 'number', defaultValue: '240', description: 'Lower width bound in pixels while resizable.' },
        { name: 'maxWidth', type: 'number', defaultValue: '960', description: 'Upper width bound in pixels while resizable.' },
        { name: 'defaultWidth', type: 'number', description: 'Initial width in pixels while resizable; defaults to the size preset.' },
        { name: 'onWidthChange', type: '(width: number) => void', description: 'Fired with the next width in pixels when a resize commits.' },
        { name: 'resizeLabel', type: 'string', defaultValue: "'Resize drawer'", description: 'Accessible label for the resize handle.' },
        { name: 'closeOnBackdrop', type: 'boolean', defaultValue: 'true', description: 'Clicking the backdrop closes the drawer.' },
        { name: 'showClose', type: 'boolean', defaultValue: 'true', description: 'Hide the header ✕ (Escape and backdrop still close).' },
        { name: 'initialFocusRef', type: 'RefObject<HTMLElement | null>', description: 'Element focused on open (defaults to first focusable).' },
        { name: 'animate', type: 'boolean', defaultValue: 'false', description: 'Slide the panel in from its edge and out on close (needs tailwindcss-animate).' },
      ]}
      accessibility={[
        'role=dialog + aria-modal, labelled by title, described by description; portals to body.',
        'Focus moves in on open, Tab/Shift+Tab are trapped, focus restores to the opener on close.',
        'Escape closes; backdrop click closes when closeOnBackdrop (default).',
        'Body scrolls internally: the page behind never moves.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
