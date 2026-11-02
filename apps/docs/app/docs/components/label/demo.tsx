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
          <div className="w-full space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="demo-email">Email address</Label>
              <Input id="demo-email" type="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="demo-password">Password</Label>
              <Input id="demo-password" type="password" placeholder="At least 8 characters" />
            </div>
          </div>
        }
        code={"import { Label, Input } from '@slipstream-ui/core';\n\nexport default function Example() {\n  return (\n    // Keep labels tight against their control (space-y-1.5) and use a\n    // larger gap (space-y-5) between separate fields.\n    <div className=\"space-y-5\">\n      <div className=\"space-y-1.5\">\n        <Label htmlFor=\"email\">Email address</Label>\n        <Input id=\"email\" type=\"email\" placeholder=\"you@example.com\" />\n      </div>\n      <div className=\"space-y-1.5\">\n        <Label htmlFor=\"password\">Password</Label>\n        <Input id=\"password\" type=\"password\" />\n      </div>\n    </div>\n  );\n}"}
        usage={"import { Label, Input } from '@slipstream-ui/core';\n\n// Label sits directly above its control\n<Label htmlFor=\"email\">Email</Label>\n<Input id=\"email\" type=\"email\" />"}
        types={"interface LabelProps {\n  htmlFor: string;\n  children: ReactNode;\n}"}
      />
    </ComponentPage>
  );
}
