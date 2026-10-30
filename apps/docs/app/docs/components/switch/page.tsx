import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { Switch } from '@slipstream-ui/core';

export default function SwitchPage() {
  return (
    <ComponentPage
      id="switch"
      title="Switch"
      description="Toggle switch for binary settings, with role=switch and aria-checked."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'checked', type: 'boolean', description: 'Controlled on/off state.' },
        { name: 'onCheckedChange', type: '(checked: boolean) => void', description: 'Fired when the user toggles the switch.' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the switch.' },
      ]}
      accessibility={[
        'role="switch" with aria-checked announces on/off state.',
        'Space and Enter toggle the switch.',
      ]}
    >
      <DemoCard
        title="Usage"
        preview={
          <div className="space-y-4">
            <Switch id="demo-notify" defaultChecked aria-label="Email notifications" />
        <Switch id="demo-dark" aria-label="Dark mode" />
        <Switch id="demo-disabled" disabled aria-label="Disabled" />
          </div>
        }
        code="// See the examples in the props table above"
      />
    </ComponentPage>
  );
}
