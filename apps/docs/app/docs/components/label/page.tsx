import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { Label, Input } from '@slipstream-ui/core';

export default function LabelPage() {
  return (
    <ComponentPage
      id="label"
      title="Label"
      description="Accessible form label that associates with its control."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'htmlFor', type: 'string', description: 'The id of the control this label describes.' },
        { name: 'children', type: 'ReactNode', description: 'The label text.' },
      ]}
      accessibility={[
        'htmlFor/id pairing links the label to its control.',
        'Placeholders are not a replacement for labels.',
      ]}
    >
      <DemoCard
        title="Usage"
        preview={
          <div className="space-y-4">
            <Label htmlFor="demo-email">Email address</Label>
        <Input id="demo-email" type="email" placeholder="you@example.com" />
          </div>
        }
        code="// See the examples in the props table above"
      />
    </ComponentPage>
  );
}
