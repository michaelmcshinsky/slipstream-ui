import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/accordion', {
  title: "Accordion",
  description: "Collapsible content sections with ARIA accordion semantics.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('accordion')}
      id="accordion"
      title="Accordion"
      description="Collapsible content sections with ARIA accordion semantics."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'value', type: 'string[]', description: 'Controlled open item ids.' },
        { name: 'defaultValue', type: 'string[]', defaultValue: '[]', description: 'Uncontrolled initial open item ids.' },
        { name: 'collapsible', type: 'boolean', defaultValue: 'true', description: 'When true, opening an item closes the others.' },
        { name: 'onValueChange', type: '(value: string[]) => void', description: 'Called when the open set changes.' },
        { name: 'variant', type: "'default' | 'borderless'", defaultValue: "'default'", description: 'Bordered card with dividers, or plain stacked sections.' },
        { name: 'gap', type: "'none' | 'sm' | 'md' | 'lg' | 'xl' | number", description: "Token gap ('lg') or exact pixels (16) between items." },
        { name: 'items', type: 'AccordionSection[]', description: 'Declarative sections ({ id, title, content, disabled }); one AccordionItem is rendered per entry instead of children.' },
        { name: 'AccordionTrigger icon', type: 'ReactNode', description: 'Swap the default chevron rendered at the far right of the header.' },
      ]}
      accessibility={[
        'Trigger has aria-expanded and aria-controls; panel has role=region.',
        'Hidden panels are removed from the tab order.',
        'The header is clickable edge-to-edge (w-full) in closed and open states; icon is pinned far right.',
      ]}
      browserNotes={[
        'Expansion animates via grid-template-rows interpolation (Chrome/Edge 117+, Safari 17+, recent Firefox). Older browsers toggle panels instantly: no functionality lost.',
        'prefers-reduced-motion: reduce disables the animation.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
