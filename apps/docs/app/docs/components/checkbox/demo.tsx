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
        code={"import { Checkbox } from '@slipstream-ui/core';\n\nexport default function Example() {\n  return (\n    <>\n      <Checkbox id=\"terms\" aria-label=\"Accept terms\" />\n        <Checkbox id=\"updates\" defaultChecked aria-label=\"Email updates\" />\n        <Checkbox id=\"disabled\" disabled aria-label=\"Disabled\" />\n    </>\n  );\n}"}
        usage={"import { Checkbox } from '@slipstream-ui/core';\n\n// Basic usage\n<Checkbox />"}
        types={"interface CheckboxProps {\n  checked: boolean;\n  onCheckedChange: (checked: boolean) => void;\n  disabled: boolean;\n}"}
      />
    </ComponentPage>
  );
}
