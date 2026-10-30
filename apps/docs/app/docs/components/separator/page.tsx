import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { Separator } from '@slipstream-ui/core';

export default function SeparatorPage() {
  return (
    <ComponentPage
      id="separator"
      title="Separator"
      description="Visual divider between content blocks, decorative or semantic."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'orientation', type: "'horizontal' | 'vertical'", defaultValue: "'horizontal'", description: 'Direction of the divider line.' },
        { name: 'label', type: 'string', description: 'Accessible name; when set, the separator becomes semantic.' },
      ]}
      accessibility={[
        'Decorative by default (role=none) so screen readers skip it.',
        'Pass a label to make it a semantic separator.',
      ]}
    >
      <DemoCard
        title="Usage"
        preview={
          <div className="space-y-4">
            <div>Section A</div>
        <Separator className="my-3" />
        <div>Section B</div>
          </div>
        }
        code="// See the examples in the props table above"
      />
    </ComponentPage>
  );
}
