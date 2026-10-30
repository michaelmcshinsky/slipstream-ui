import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { Progress } from '@slipstream-ui/core';

export default function ProgressPage() {
  return (
    <ComponentPage
      id="progress"
      title="Progress"
      description="Determinate progress bar with role=progressbar and exact value semantics."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'value', type: 'number', defaultValue: '0', description: 'Current value between 0 and max.' },
        { name: 'max', type: 'number', defaultValue: '100', description: 'Upper bound of the progress scale.' },
        { name: 'label', type: 'string', description: 'Accessible label announced by screen readers.' },
      ]}
      accessibility={[
        'role="progressbar" with aria-valuenow/min/max so assistive tech reports the exact percentage.',
        'Provide an accessible label describing the task.',
      ]}
    >
      <DemoCard
        title="Usage"
        preview={
          <div className="space-y-4">
            <Progress value={25} label="Upload progress" />
        <Progress value={66} label="Setup progress" />
        <Progress value={100} label="Complete" />
          </div>
        }
        code={"import { Progress } from '@slipstream-ui/core';\n\nexport default function Example() {\n  return (\n    <>\n      <Progress value={25} label=\"Upload progress\" />\n        <Progress value={66} label=\"Setup progress\" />\n        <Progress value={100} label=\"Complete\" />\n    </>\n  );\n}"}
        usage={"import { Progress } from '@slipstream-ui/core';\n\n// Basic usage\n<Progress />"}
        types={"interface ProgressProps {\n  value: number;\n  max: number;\n  label: string;\n}"}
      />
    </ComponentPage>
  );
}
