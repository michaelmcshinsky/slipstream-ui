import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { Popover, PopoverContent, PopoverTrigger, Button } from '@slipstream-ui/core';

export default function PopoverPage() {
  return (
    <ComponentPage
      id="popover"
      title="Popover"
      description="Floating panel anchored to a trigger with interactive content."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'open', type: 'boolean', description: 'Controlled open state.' },
        { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the open state changes.' },
      ]}
      accessibility={[
        'role=dialog with aria-labelledby linking to the trigger.',
        'Escape closes the popover; outside click dismisses it.',
      ]}
    >
      <DemoCard
        title="Usage"
        preview={
          <div className="space-y-4">
            <Popover>
          <PopoverTrigger>Details</PopoverTrigger>
          <PopoverContent>
            <p className="text-sm text-muted-foreground">More information here.</p>
            <Button size="sm" className="mt-2">Action</Button>
          </PopoverContent>
        </Popover>
          </div>
        }
        code={"import { Popover, PopoverContent, PopoverTrigger, Button } from '@slipstream-ui/core';\n\nexport default function Example() {\n  return (\n    <>\n      <Popover>\n          <PopoverTrigger>Details</PopoverTrigger>\n          <PopoverContent>\n            <p className=\"text-sm text-muted-foreground\">More information here.</p>\n            <Button size=\"sm\" className=\"mt-2\">Action</Button>\n          </PopoverContent>\n        </Popover>\n    </>\n  );\n}"}
        usage={"import { Popover } from '@slipstream-ui/core';\n\n// Basic usage\n<Popover />"}
        types={"interface PopoverProps {\n  open: boolean;\n  onOpenChange: (open: boolean) => void;\n}"}
      />
    </ComponentPage>
  );
}
