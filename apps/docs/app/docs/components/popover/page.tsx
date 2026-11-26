import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/popover', {
  title: "Popover",
  description: "Floating panel anchored to a trigger with interactive content.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('popover')}
      id="popover"
      title="Popover"
      description="Floating panel anchored to a trigger with interactive content."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'open', type: 'boolean', description: 'Controlled open state.' },
        { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the open state changes.' },
        { name: '.PopoverContent', type: 'PopoverContentProps', description: 'side, align, sideOffset, alignOffset, collisionPadding and matchTriggerWidth control placement, flipping and clamping.' },
        { name: '.PopoverAnchor', type: 'PopoverAnchorProps', description: 'Anchors the panel to this element instead of the trigger wrapper.' },
      ]}
      accessibility={[
        'role=dialog with aria-labelledby linking to the trigger.',
        'Escape closes the popover; outside click dismisses it.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
