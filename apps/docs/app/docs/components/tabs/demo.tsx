import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@slipstream-ui/core';

export default function TabsPage() {
  return (
    <ComponentPage
      id="tabs"
      title="Tabs"
      description="Tabbed content container with ARIA tablist semantics, size variants, and underline/default strip designs."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'value', type: 'string', description: 'Controlled active tab value.' },
        { name: 'defaultValue', type: 'string', description: 'Initial tab value when uncontrolled.' },
        { name: 'onValueChange', type: '(value: string) => void', description: 'Called when the active tab changes.' },
        { name: 'variant', type: "'default' | 'underline'", defaultValue: "'default'", description: 'Strip design: enclosed pill track or background-free underline.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Density for strip and triggers.' },
        { name: 'TabsTrigger className', type: 'string', description: 'Per-trigger overrides (twMerge resolves conflicts with variant/size).' },
      ]}
      accessibility={[
        'role=tablist/tab/tabpanel with aria-selected and aria-controls.',
        'Roving tabindex: only the active tab is tabbable.',
        'Full keyboard operation: ArrowLeft/Right + ArrowUp/Down move AND activate (wrapping), Home/End jump to first/last, Enter/Space activate.',
        'Underline variant keeps a 2px border indicator so state is not color-only.',
      ]}
    >
      <DemoCard
        title="Default (pill track)"
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
            <Tabs defaultValue="code" variant="underline">
              <TabsList>
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
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
        code={`{/* variant="underline": no strip background — the 2px border
    alone marks the active tab (item 18) */}
<Tabs defaultValue="code" variant="underline">
  <TabsList>
    <TabsTrigger value="code">Code</TabsTrigger>
    <TabsTrigger value="preview">Preview</TabsTrigger>
  </TabsList>
  …
</Tabs>`}
      />

      <DemoCard
        title="Sizes"
        preview={
          <div className="w-full space-y-5">
            {(['sm', 'md', 'lg'] as const).map((size) => (
              <div key={size} className="flex items-center gap-4">
                <span className="w-8 shrink-0 font-mono text-xs text-muted-foreground">{size}</span>
                <Tabs defaultValue="a" size={size}>
                  <TabsList>
                    <TabsTrigger value="a">First</TabsTrigger>
                    <TabsTrigger value="b">Second</TabsTrigger>
                    <TabsTrigger value="c">Third</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            ))}
            <div className="flex items-center gap-4">
              <span className="w-8 shrink-0 font-mono text-xs text-muted-foreground">sm+ul</span>
              <Tabs defaultValue="a" variant="underline" size="sm">
                <TabsList>
                  <TabsTrigger value="a">One</TabsTrigger>
                  <TabsTrigger value="b">Two</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        }
        code={`{/* size applies to strip + triggers; combines with variant */}
<Tabs size="sm">…</Tabs>
<Tabs size="md">…</Tabs>   {/* default */}
<Tabs size="lg">…</Tabs>
<Tabs variant="underline" size="sm">…</Tabs>`}
        usage={`import { Tabs, TabsList, TabsTrigger } from '@slipstream-ui/core';

// Controlled with explicit design + density
<Tabs value={tab} onValueChange={setTab} variant="underline" size="lg">
  <TabsList>…</TabsList>
</Tabs>`}
        types={`type TabsProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: 'default' | 'underline';
  size?: 'sm' | 'md' | 'lg';
};`}
      />
    </ComponentPage>
  );
}
