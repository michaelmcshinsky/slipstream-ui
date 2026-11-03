import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { Badge, Button, Flex, FlexItem, Text } from '@slipstream-ui/core';

export default function FlexPage() {
  return (
    <ComponentPage
      id="flex"
      title="Flex / FlexItem"
      description="Typed flexbox container (direction/align/justify/wrap/gap) with FlexItem for per-child grow/shrink/basis controls."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'direction', type: "'row' | 'column'", defaultValue: "'row'", description: 'Main axis direction.' },
        { name: 'align', type: "'start' | 'center' | 'end' | 'stretch' | 'baseline'", description: 'Cross-axis alignment (align-items; align-self on FlexItem).' },
        { name: 'justify', type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'", description: 'Main-axis distribution (justify-content).' },
        { name: 'wrap', type: 'boolean', defaultValue: 'false', description: 'Allow items to wrap onto multiple lines.' },
        { name: 'gap', type: "'none' | 'sm' | 'md' | 'lg' | 'xl'", defaultValue: "'md'", description: 'Token gap between children.' },
        { name: 'as', type: "'div' | 'span' | 'section' | 'article' | 'nav' | 'header' | 'footer'", defaultValue: "'div'", description: 'Semantic element.' },
        { name: 'grow / shrink / basis', type: 'boolean | string / string', description: 'Per-child flex values on FlexItem — emitted as inline style so nothing gets purged.' },
      ]}
      accessibility={[
        'Layout-only semantics: flex-wrap reflows visually while DOM (reading) order never changes.',
        'Interactive children keep their own keyboard/ARIA contracts.',
        'Put items in logical reading order regardless of visual layout.',
      ]}
    >
      <DemoCard
        title="Toolbar (between)"
        preview={
          <div className="w-full">
            <Flex align="center" justify="between" gap="sm" className="rounded-lg border border-border p-3">
              <Text size="sm" weight="medium">Document title</Text>
              <Flex gap="sm">
                <Button size="sm" variant="ghost">Cancel</Button>
                <Button size="sm">Save</Button>
              </Flex>
            </Flex>
          </div>
        }
        code={`import { Button, Flex, Text } from '@slipstream-ui/core';

<Flex align="center" justify="between" gap="sm" className="rounded-lg border border-border p-3">
  <Text size="sm" weight="medium">Document title</Text>
  <Flex gap="sm">
    <Button size="sm" variant="ghost">Cancel</Button>
    <Button size="sm">Save</Button>
  </Flex>
</Flex>`}
      />

      <DemoCard
        title="Sidebar + content (FlexItem)"
        preview={
          <div className="w-full">
            <Flex gap="lg">
              <FlexItem basis="10rem" shrink={false} className="rounded-lg border border-border bg-muted/40 p-3">
                <Text size="xs" muted>Sidebar — basis 10rem, shrink-0</Text>
              </FlexItem>
              <FlexItem grow className="rounded-lg border border-border p-3">
                <Text size="xs" muted>Content — grows to fill remaining space</Text>
              </FlexItem>
            </Flex>
            <div className="mt-4">
              <Flex gap="sm" wrap align="center">
                <Badge>wrap</Badge>
                <Badge variant="secondary">items</Badge>
                <Badge variant="outline">flow to</Badge>
                <Badge>the next</Badge>
                <Badge variant="secondary">line</Badge>
                <Badge variant="outline">instead of</Badge>
                <Badge>overflowing</Badge>
              </Flex>
            </div>
          </div>
        }
        code={`import { Flex, FlexItem } from '@slipstream-ui/core';

{/* Fixed sidebar + growing content — flex values render as inline
    style because runtime-built utility classes would be purged */}
<Flex gap="lg">
  <FlexItem basis="10rem" shrink={false}>…</FlexItem>
  <FlexItem grow>…</FlexItem>
</Flex>

<Flex gap="sm" wrap align="center">…</Flex>`}
        usage={`import { Flex, FlexItem } from '@slipstream-ui/core';

<Flex direction="column" gap="md" justify="between" className="h-full">…</Flex>`}
        types={`type FlexProps = {
  direction?: 'row' | 'column';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
};

type FlexItemProps = {
  grow?: boolean | string;
  shrink?: boolean | string;
  basis?: string;
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
};`}
      />
    </ComponentPage>
  );
}
