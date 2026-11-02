import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { RadioGroup, RadioGroupItem } from '@slipstream-ui/core';

export default function RadioPage() {
  return (
    <ComponentPage
      id="radio"
      title="Radio"
      description="Native radio buttons grouped for mutually exclusive choices, with an accessible fieldset/legend."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'name', type: 'string', description: 'Shared group name (RadioGroup).' },
        { name: 'value / defaultValue', type: 'string', description: 'Controlled or initial selection (RadioGroup).' },
        { name: 'onValueChange', type: '(value: string) => void', description: 'Called with the newly selected value (RadioGroup).' },
        { name: 'legend', type: 'string', description: 'Accessible group label rendered as the fieldset legend.' },
        { name: 'value', type: 'string', description: 'The value this item contributes to the group (RadioGroupItem).' },
        { name: 'label', type: 'string', description: 'Visible label rendered next to the radio (RadioGroupItem).' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables an individual item.' },
      ]}
      accessibility={[
        'RadioGroup renders a fieldset with a legend so the group name is announced.',
        'Native arrow-key navigation within the group; only the selected radio is tabbable.',
        'Disabled items are announced natively and skipped by arrow keys.',
      ]}
    >
      <DemoCard
        title="States"
        preview={
          <div className="w-full space-y-5">
            <RadioGroup name="demo-plan" legend="Choose a plan" defaultValue="free">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="plan-free" value="free" label="Free — 1 project" />
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="plan-pro" value="pro" label="Pro — unlimited projects" />
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="plan-team" value="team" label="Team — SSO + audit log" />
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="plan-legacy" value="legacy" label="Legacy plan (unavailable)" disabled />
                </div>
              </div>
            </RadioGroup>

            <RadioGroup name="demo-density" legend="Interface density" defaultValue="comfortable">
              <div className="flex flex-wrap gap-4">
                <RadioGroupItem id="density-comfy" value="comfortable" label="Comfortable" />
                <RadioGroupItem id="density-compact" value="compact" label="Compact" />
              </div>
            </RadioGroup>
          </div>
        }
        code={`import { RadioGroup, RadioGroupItem } from '@slipstream-ui/core';

<RadioGroup name="plan" legend="Choose a plan" defaultValue="free">
  <RadioGroupItem value="free" label="Free — 1 project" />
  <RadioGroupItem value="pro" label="Pro — unlimited projects" />
  <RadioGroupItem value="team" label="Team — SSO + audit log" />
  <RadioGroupItem value="legacy" label="Legacy plan" disabled />
</RadioGroup>

{/* Controlled */}
<RadioGroup
  name="density"
  legend="Interface density"
  value={density}
  onValueChange={setDensity}
>
  <RadioGroupItem value="comfortable" label="Comfortable" />
  <RadioGroupItem value="compact" label="Compact" />
</RadioGroup>`}
        usage={`import { RadioGroup, RadioGroupItem } from '@slipstream-ui/core';

// Uncontrolled with initial selection
<RadioGroup name="size" legend="Size" defaultValue="m">
  <RadioGroupItem value="s" label="Small" />
  <RadioGroupItem value="m" label="Medium" />
  <RadioGroupItem value="l" label="Large" />
</RadioGroup>`}
        types={`interface RadioGroupProps {
  name: string;
  legend?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

interface RadioGroupItemProps {
  value: string;
  label?: string;
  disabled?: boolean;
}`}
      />
    </ComponentPage>
  );
}
