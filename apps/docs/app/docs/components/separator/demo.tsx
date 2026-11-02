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
        code={"import { Separator } from '@slipstream-ui/core';\n\nexport default function Example() {\n  return (\n    <>\n      <div>Section A</div>\n        <Separator className=\"my-3\" />\n        <div>Section B</div>\n    </>\n  );\n}"}
        usage={"import { Separator } from '@slipstream-ui/core';\n\n// Basic usage\n<Separator />"}
        types={"interface SeparatorProps {\n  orientation: 'horizontal' | 'vertical';\n  label: string;\n}"}
      />
    </ComponentPage>
  );
}
