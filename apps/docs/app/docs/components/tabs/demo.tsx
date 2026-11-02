import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@slipstream-ui/core';

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
        { name: 'TabsList className', type: 'string', description: 'Restyles the tab strip (pill, underline, plain — see designs below).' },
        { name: 'TabsTrigger / TabsContent className', type: 'string', description: 'Per-trigger/per-panel styling; content panels stack and hide inactive ones.' },
      ]}
      accessibility={[
        'role=tablist/tab/tabpanel with aria-selected and aria-controls.',
        'Roving tabindex: only the active tab is tabbable.',
        'Arrow keys move between tabs; Home/End jump to first/last (WAI-ARIA tabs pattern).',
        'Keep panel content short-circuitable: each TabsContent owns its heading order.',
      ]}
    >
      <DemoCard
        title="Default (pill) design"
        preview={
          <div className="w-full max-w-md">
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="reports" disabled>Reports</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
                Account summary, recent activity, and quick actions live here.
              </TabsContent>
              <TabsContent value="analytics" className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
                Charts of usage over time — conversations, tokens, and latency.
              </TabsContent>
            </Tabs>
          </div>
        }
        code={`import { Tabs, TabsContent, TabsList, TabsTrigger } from '@slipstream-ui/core';

<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger>
    <TabsTrigger value="reports" disabled>Reports</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">…</TabsContent>
  <TabsContent value="analytics">…</TabsContent>
</Tabs>`}
      />

      <DemoCard
        title="Underline design"
        preview={
          <div className="w-full max-w-md">
            <Tabs defaultValue="code">
              <TabsList className="gap-6 rounded-none border-b border-border bg-transparent p-0">
                <TabsTrigger
                  value="code"
                  className="rounded-none border-b-2 border-transparent px-1 pb-3 data-[state=active]:border-primary data-[state=active]:shadow-none"
                >
                  Code
                </TabsTrigger>
                <TabsTrigger
                  value="preview"
                  className="rounded-none border-b-2 border-transparent px-1 pb-3 data-[state=active]:border-primary data-[state=active]:shadow-none"
                >
                  Preview
                </TabsTrigger>
                <TabsTrigger
                  value="notes"
                  className="rounded-none border-b-2 border-transparent px-1 pb-3 data-[state=active]:border-primary data-[state=active]:shadow-none"
                >
                  Notes
                </TabsTrigger>
              </TabsList>
              <TabsContent value="code" className="pt-4 text-sm text-muted-foreground">
                Source snippet for the current example.
              </TabsContent>
              <TabsContent value="preview" className="pt-4 text-sm text-muted-foreground">
                Rendered output of the example.
              </TabsContent>
              <TabsContent value="notes" className="pt-4 text-sm text-muted-foreground">
                Implementation notes and gotchas.
              </TabsContent>
            </Tabs>
          </div>
        }
        code={`{/* Tabs are unstyled at the strip level: design them with className.
    Underline style = transparent list, active border on the trigger. */}
<TabsList className="gap-6 rounded-none border-b border-border bg-transparent p-0">
  <TabsTrigger
    value="code"
    className="rounded-none border-b-2 border-transparent px-1 pb-3 data-[state=active]:border-primary data-[state=active]:shadow-none"
  >
    Code
  </TabsTrigger>
  …
</TabsList>`}
      />

      <DemoCard
        title="Segmented (enclosed) design"
        preview={
          <div className="w-full max-w-md">
            <Tabs defaultValue="s">
              <TabsList className="h-auto gap-1 rounded-lg bg-muted p-1">
                <TabsTrigger value="s" className="h-8 rounded-md px-4 text-xs">Small</TabsTrigger>
                <TabsTrigger value="m" className="h-8 rounded-md px-4 text-xs">Medium</TabsTrigger>
                <TabsTrigger value="l" className="h-8 rounded-md px-4 text-xs">Large</TabsTrigger>
              </TabsList>
              <TabsContent value="s" className="pt-3 text-sm text-muted-foreground">
                Compact controls for dense toolbars.
              </TabsContent>
              <TabsContent value="m" className="pt-3 text-sm text-muted-foreground">
                The default sizing that matches Button sm.
              </TabsContent>
              <TabsContent value="l" className="pt-3 text-sm text-muted-foreground">
                Comfortable targets for touch-first interfaces.
              </TabsContent>
            </Tabs>
          </div>
        }
        code={`{/* Segmented control: pills inside a muted track, tighter sizing */}
<TabsList className="h-auto gap-1 rounded-lg bg-muted p-1">
  <TabsTrigger value="s" className="h-8 rounded-md px-4 text-xs">Small</TabsTrigger>
  <TabsTrigger value="m" className="h-8 rounded-md px-4 text-xs">Medium</TabsTrigger>
  <TabsTrigger value="l" className="h-8 rounded-md px-4 text-xs">Large</TabsTrigger>
</TabsList>`}
      />
    </ComponentPage>
  );
}
