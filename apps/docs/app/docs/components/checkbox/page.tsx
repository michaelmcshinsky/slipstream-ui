import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { Checkbox } from '@slipstream-ui/core';

export default function CheckboxPage() {
  return (
    <ComponentPage
      id="checkbox"
      title="Checkbox"
      description="Native checkbox input styled to match the design system, with controlled and uncontrolled support."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'checked', type: 'boolean', description: 'Controlled checked state; omit for uncontrolled usage.' },
        { name: 'onCheckedChange', type: '(checked: boolean) => void', description: 'Fired when the user toggles the checkbox.' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the checkbox.' },
      ]}
      accessibility={[
        'Native input semantics: keyboard, form, and screen-reader behavior is identical to platform checkboxes.',
        'Provide an accessible name via aria-label or an associated Label.',
      ]}
    >
      <DemoCard
        title="Usage"
        preview={
          <div className="space-y-4">
            <Checkbox id="terms" aria-label="Accept terms" />
        <Checkbox id="updates" defaultChecked aria-label="Email updates" />
        <Checkbox id="disabled" disabled aria-label="Disabled" />
          </div>
        }
        code="// See the examples in the props table above"
      />
    </ComponentPage>
  );
}
