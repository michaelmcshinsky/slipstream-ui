import { DemoCard } from '@/components/demo-card';
import { Progress } from '@slipstream-ui/core';

export default function Demo() {
  return (
    <>
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
        types={"type ProgressProps = {\n  value?: number;\n  max?: number;\n  label?: string;\n};"}
      />
    </>
  );
}
