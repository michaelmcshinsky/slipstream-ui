import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { Checkbox, Fieldset, Label, RadioGroup, RadioGroupItem } from '@slipstream-ui/core';

export default function FieldsetPage() {
  return (
    <ComponentPage
      id="fieldset"
      title="Fieldset"
      description="Groups related form controls in a native fieldset with a legend, optional description, and an error slot."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'legend', type: 'string', description: "Legend rendered as the group's accessible name." },
        { name: 'description', type: 'string', description: 'Muted supporting line under the legend.' },
        { name: 'error', type: 'string', description: 'Group-level error rendered under the controls (role=alert).' },
        { name: 'children', type: 'ReactNode', description: 'The controls this group names.' },
      ]}
      accessibility={[
        'Native <fieldset>/<legend> — the legend is announced as the group name before each control.',
        'The error slot renders with role=alert so group errors are announced when they appear.',
        'Always pass a legend (or an equivalent aria-label).',
      ]}
      browserNotes={[
        'Pure native fieldset/legend semantics — supported in every browser; only the styling is Tailwind.',
      ]}
    >
      <DemoCard
        title="With description"
        preview={
          <div className="w-full max-w-sm">
            <Fieldset legend="Notification preferences" description="Applies to every project in this workspace">
              <div className="flex items-center gap-2 py-1">
                <Checkbox id="fs-product" aria-label="Product updates" defaultChecked />
                <Label htmlFor="fs-product">Product updates</Label>
              </div>
              <div className="flex items-center gap-2 py-1">
                <Checkbox id="fs-security" aria-label="Security alerts" defaultChecked />
                <Label htmlFor="fs-security">Security alerts</Label>
              </div>
              <div className="flex items-center gap-2 py-1">
                <Checkbox id="fs-tips" aria-label="Tips" />
                <Label htmlFor="fs-tips">Tips &amp; tricks</Label>
              </div>
            </Fieldset>
          </div>
        }
        code={`import { Checkbox, Fieldset, Label } from '@slipstream-ui/core';

<Fieldset legend="Notification preferences" description="Applies to every project in this workspace">
  <div className="flex items-center gap-2">
    <Checkbox id="product" defaultChecked />
    <Label htmlFor="product">Product updates</Label>
  </div>
  <div className="flex items-center gap-2">
    <Checkbox id="security" defaultChecked />
    <Label htmlFor="security">Security alerts</Label>
  </div>
</Fieldset>`}
        usage={`import { Fieldset, RadioGroup, RadioGroupItem } from '@slipstream-ui/core';

// A fieldset names a GROUP of controls
<Fieldset legend="Visibility">
  <RadioGroup name="visibility" defaultValue="team">
    <RadioGroupItem value="private" label="Private" />
    <RadioGroupItem value="team" label="Team" />
  </RadioGroup>
</Fieldset>`}
        types={`type FieldsetProps = {
  legend?: string;
  description?: string;
  error?: string;
  children?: ReactNode;
};`}
      />

      <DemoCard
        title="Group-level error"
        preview={
          <div className="w-full max-w-sm">
            <Fieldset
              legend="Billing interval"
              description="Choose how often you are charged"
              error="Select an interval to continue"
            >
              <RadioGroup name="fs-interval" defaultValue="">
                <div className="flex flex-wrap gap-4">
                  <RadioGroupItem id="fs-monthly" value="monthly" label="Monthly" />
                  <RadioGroupItem id="fs-yearly" value="yearly" label="Yearly" />
                </div>
              </RadioGroup>
            </Fieldset>
          </div>
        }
        code={`import { Fieldset, RadioGroup, RadioGroupItem } from '@slipstream-ui/core';

{/* Errors that belong to the whole group live on the fieldset */}
<Fieldset
  legend="Billing interval"
  description="Choose how often you are charged"
  error="Select an interval to continue"
>
  <RadioGroup name="interval" defaultValue="">
    <RadioGroupItem value="monthly" label="Monthly" />
    <RadioGroupItem value="yearly" label="Yearly" />
  </RadioGroup>
</Fieldset>`}
      />
    </ComponentPage>
  );
}
