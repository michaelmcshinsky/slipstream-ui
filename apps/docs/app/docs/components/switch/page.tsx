import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/switch', {
  title: "Switch",
  description: "Toggle switch for binary settings, with role=switch and aria-checked.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('switch')}
      id="switch"
      title="Switch"
      description="Toggle switch for binary settings, with role=switch and aria-checked."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'checked', type: 'boolean', description: 'Controlled on/off state.' },
        { name: 'defaultChecked', type: 'boolean', defaultValue: 'false', description: 'Initial state when uncontrolled.' },
        { name: 'onCheckedChange', type: '(checked: boolean) => void', description: 'Fired when the user toggles the switch.' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the switch.' },
        { name: 'name', type: 'string', description: 'Renders a hidden checkbox with this name so the state submits with a plain form.' },
        { name: 'value', type: 'string | number | readonly string[]', defaultValue: "'on'", description: 'Value submitted by the hidden checkbox; only used together with name.' },
        { name: 'aria-label', type: 'string', description: 'Accessible name when no visible label is associated.' },
      ]}
      accessibility={[
        'role="switch" with aria-checked announces on/off state.',
        'Space and Enter toggle the switch.',
        'Disabled switches use the native disabled attribute: they leave the tab order and are announced as dimmed.',
        'Prefer a visible <Label> (htmlFor) over aria-label when space allows.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
