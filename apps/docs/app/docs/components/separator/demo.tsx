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
        title="Both orientations"
        preview={
          <div className="w-full space-y-4">
            <div className="text-sm">Section A</div>
            <Separator />
            <div className="text-sm">Section B</div>
            <div className="flex h-16 items-stretch gap-4 pt-2">
              <div className="flex items-center text-sm">Toolbar left</div>
              <Separator orientation="vertical" />
              <div className="flex items-center text-sm">Toolbar right</div>
            </div>
            <p className="text-xs text-muted-foreground">
              Also exported as <code className="rounded bg-muted px-1 py-0.5">Divider</code> — the same
              primitive under a layout-friendly name.
            </p>
          </div>
        }
        code={"import { Separator, Divider } from '@slipstream-ui/core';\n\nexport default function Example() {\n  return (\n    <>\n      <div>Section A</div>\n      <Separator />                       {/* horizontal, decorative */}\n      <div>Section B</div>\n\n      <div className=\"flex h-16 items-stretch gap-4\">\n        <span>Left</span>\n        <Separator orientation=\"vertical\" />\n        <span>Right</span>\n      </div>\n\n      {/* Divider is an alias for Separator */}\n      <Divider />\n    </>\n  );\n}"}
        usage={"import { Separator } from '@slipstream-ui/core';\n\n<Separator />\n<Separator orientation=\"vertical\" label=\"Toolbar sections\" />"}
        types={"type SeparatorProps = {\n  orientation: 'horizontal' | 'vertical';\n  label: string;\n};\n\n// Divider is a renamed export of the same component\nconst Divider: typeof Separator;"}
      />
    </ComponentPage>
  );
}
