import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@slipstream-ui/core';

export default function TabsPage() {
  return (
    <ComponentPage
      id="tabs"
      title="Tabs"
      description="Tabbed content container with ARIA tablist semantics and keyboard navigation."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'value', type: 'string', description: 'Controlled active tab value.' },
        { name: 'defaultValue', type: 'string', description: 'Initial tab value when uncontrolled.' },
        { name: 'onValueChange', type: '(value: string) => void', description: 'Called when the active tab changes.' },
      ]}
      accessibility={[
        'role=tablist/tab/tabpanel with aria-selected and aria-controls.',
        'Roving tabindex: only the active tab is tabbable.',
      ]}
    >
      <DemoCard
        title="Usage"
        preview={
          <div className="space-y-4">
            <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">Overview panel content.</TabsContent>
          <TabsContent value="analytics">Analytics panel content.</TabsContent>
        </Tabs>
          </div>
        }
        code={"import { Tabs, TabsList, TabsTrigger, TabsContent } from '@slipstream-ui/core';\n\nexport default function Example() {\n  return (\n    <>\n      <Tabs defaultValue=\"overview\">\n          <TabsList>\n            <TabsTrigger value=\"overview\">Overview</TabsTrigger>\n            <TabsTrigger value=\"analytics\">Analytics</TabsTrigger>\n          </TabsList>\n          <TabsContent value=\"overview\">Overview panel content.</TabsContent>\n          <TabsContent value=\"analytics\">Analytics panel content.</TabsContent>\n        </Tabs>\n    </>\n  );\n}"}
        usage={"import { Tabs } from '@slipstream-ui/core';\n\n// Basic usage\n<Tabs />"}
        types={"interface TabsProps {\n  value: string;\n  defaultValue: string;\n  onValueChange: (value: string) => void;\n}"}
      />
    </ComponentPage>
  );
}
