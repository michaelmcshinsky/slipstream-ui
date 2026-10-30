import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { Tooltip, Button } from '@slipstream-ui/core';

export default function TooltipPage() {
  return (
    <ComponentPage
      id="tooltip"
      title="Tooltip"
      description="Hover/focus tooltip with aria-describedby association and Escape dismissal."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'content', type: 'string', description: 'The tooltip text.' },
        { name: 'side', type: "'top' | 'bottom' | 'left' | 'right'", defaultValue: "'top'", description: 'Placement relative to the trigger.' },
        { name: 'delay', type: 'number', defaultValue: '300', description: 'Delay before showing on hover, in ms.' },
      ]}
      accessibility={[
        'aria-describedby is injected into the trigger so the hint is announced with focus.',
        'Escape dismisses the tooltip without moving focus.',
      ]}
    >
      <DemoCard
        title="Usage"
        preview={
          <div className="space-y-4">
            <Tooltip content="Save your changes">
          <Button>Hover me</Button>
        </Tooltip>
          </div>
        }
        code={"import { Tooltip, Button } from '@slipstream-ui/core';\n\nexport default function Example() {\n  return (\n    <>\n      <Tooltip content=\"Save your changes\">\n          <Button>Hover me</Button>\n        </Tooltip>\n    </>\n  );\n}"}
        usage={"import { Tooltip } from '@slipstream-ui/core';\n\n// Basic usage\n<Tooltip />"}
        types={"interface TooltipProps {\n  content: string;\n  side: 'top' | 'bottom' | 'left' | 'right';\n  delay: number;\n}"}
      />
    </ComponentPage>
  );
}
