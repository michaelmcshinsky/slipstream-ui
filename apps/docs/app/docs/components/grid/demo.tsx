import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { Card, CardContent, CardHeader, CardTitle, Grid, GridItem, Text } from '@slipstream-ui/core';

export default function GridPage() {
  return (
    <ComponentPage
      id="grid"
      title="Grid / GridItem"
      description="Typed CSS grid with column counts per breakpoint (literal utilities that survive purging), auto-fit min-column mode, and GridItem spans."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'cols', type: 'number', description: 'Base column count (1-6).' },
        { name: 'smCols / mdCols / lgCols', type: 'number', description: 'Column counts from each breakpoint up (1-6).' },
        { name: 'minCol', type: 'string', description: 'Auto-fit mode: repeat(auto-fit, minmax(<minCol>, 1fr)) — cards wrap responsively. Overrides cols*.' },
        { name: 'gap', type: "'none' | 'sm' | 'md' | 'lg' | 'xl'", defaultValue: "'md'", description: 'Token gap between cells.' },
        { name: 'as', type: "'div' | 'span' | 'section' | 'ul'", defaultValue: "'div'", description: "Semantic element (use 'ul' with GridItem as=\"li\")." },
        { name: 'span / smSpan / mdSpan / lgSpan', type: 'number', description: 'GridItem column spans per breakpoint (1-6).' },
      ]}
      accessibility={[
        'Visual column reflow never reorders DOM nodes — reading order equals source order.',
        'List grids pair as="ul" with GridItem as="li" for item semantics.',
        'Order cells by reading priority, not visual position.',
      ]}
    >
      <DemoCard
        title="Auto-fit card grid"
        preview={
          <div className="w-full">
            <Grid minCol="14rem" gap="md">
              {['Streaming chat', 'Agent dashboard', 'RAG citations', 'Settings form', 'Multi-thread', 'Empty state'].map(
                (name) => (
                  <Card key={name} className="p-0">
                    <CardHeader className="p-3 pb-1">
                      <CardTitle className="text-sm">{name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <Text size="xs" muted>Wraps at every width — no breakpoint math.</Text>
                    </CardContent>
                  </Card>
                )
              )}
            </Grid>
          </div>
        }
        code={`import { Card, Grid } from '@slipstream-ui/core';

{/* minmax() wrapping: cells reflow at every viewport width */}
<Grid minCol="14rem" gap="md">
  {cards.map((c) => <Card key={c.id}>…</Card>)}
</Grid>`}
      />

      <DemoCard
        title="Fixed columns + spans"
        preview={
          <div className="w-full">
            <Grid cols={2} mdCols={4} gap="sm">
              <GridItem mdSpan={4} className="rounded-lg border border-border bg-muted/40 p-3">
                <Text size="xs" muted>span=4 from md (hero row)</Text>
              </GridItem>
              <GridItem className="rounded-lg border border-border p-3">
                <Text size="xs" muted>cols=2 base</Text>
              </GridItem>
              <GridItem className="rounded-lg border border-border p-3">
                <Text size="xs" muted>4 from md</Text>
              </GridItem>
              <GridItem span={2} className="rounded-lg border border-border p-3">
                <Text size="xs" muted>span=2 (half width)</Text>
              </GridItem>
              <GridItem className="rounded-lg border border-border p-3">
                <Text size="xs" muted>…</Text>
              </GridItem>
            </Grid>
          </div>
        }
        code={`import { Grid, GridItem } from '@slipstream-ui/core';

{/* Literal grid-cols-*/col-span-* classes are pre-declared in the
    component source, so Tailwind's scanner keeps them */}
<Grid cols={2} mdCols={4} gap="sm">
  <GridItem mdSpan={4}>Hero row</GridItem>
  <GridItem>Cell</GridItem>
  <GridItem>Cell</GridItem>
  <GridItem span={2}>Half width</GridItem>
  <GridItem>Cell</GridItem>
</Grid>`}
        usage={`import { Grid, GridItem } from '@slipstream-ui/core';

// Semantic item grid
<Grid as="ul" mdCols={3} gap="md">
  <GridItem as="li">…</GridItem>
</Grid>`}
        types={`type GridProps = {
  cols?: number;
  smCols?: number;
  mdCols?: number;
  lgCols?: number;
  minCol?: string;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
};

type GridItemProps = {
  span?: number;
  smSpan?: number;
  mdSpan?: number;
  lgSpan?: number;
};`}
      />
    </ComponentPage>
  );
}
