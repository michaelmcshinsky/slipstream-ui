import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { RadioGroup, RadioGroupItem } from '@slipstream-ui/core';

export default function RadioPage() {
  return (
    <ComponentPage
      id="radio"
      title="Radio"
      description="Native radio buttons grouped for mutually exclusive choices."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'value', type: 'string', description: 'The value this item contributes to the group.' },
        { name: 'label', type: 'string', description: 'Visible label rendered next to the radio.' },
        { name: 'legend', type: 'string', description: 'Accessible group label (RadioGroup component).' },
      ]}
      accessibility={[
        'RadioGroup renders a fieldset with a legend so the group name is announced.',
        'Native arrow-key navigation within the group.',
      ]}
    >
      <DemoCard
        title="Usage"
        preview={
          <div className="space-y-4">
            <RadioGroup name="demo-plan" legend="Choose a plan" defaultValue="free">
          <RadioGroupItem value="free" label="Free" />
          <RadioGroupItem value="pro" label="Pro" />
          <RadioGroupItem value="enterprise" label="Enterprise" />
        </RadioGroup>
          </div>
        }
        code="// See the examples in the props table above"
      />
    </ComponentPage>
  );
}
