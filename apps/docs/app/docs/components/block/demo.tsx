import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { Block, Heading, Text } from '@slipstream-ui/core';

export default function BlockPage() {
  return (
    <ComponentPage
      id="block"
      title="Block"
      description="Semantic container (div by default, swappable element) — the structural counterpart to Text (p)."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'as', type: "'div' | 'span' | 'section' | 'article' | 'figure' | 'header' | 'footer' | 'nav' | 'main' | 'aside'", defaultValue: "'div'", description: 'Semantic element to render.' },
        { name: 'inline', type: 'boolean', defaultValue: 'false', description: 'Shorthand for as="span" — inline flow.' },
        { name: 'muted', type: 'boolean', defaultValue: 'false', description: "Use the muted-foreground token for the block's text." },
      ]}
      accessibility={[
        'Element choice is explicit — pick the element matching the content role (section/article/figure).',
        'Block adds no interactive behavior; children keep their own keyboard/ARIA contracts.',
        'Copy belongs in Text (p), not Block — document semantics stay queryable.',
      ]}
    >
      <DemoCard
        title="Semantic elements"
        preview={
          <div className="w-full space-y-4">
            <Block as="section" className="rounded-lg border border-border p-4">
              <Heading level={3} size="sm">as="section"</Heading>
              <Text size="sm" muted>
                A titled region — screen readers can jump between sections.
              </Text>
            </Block>
            <div className="flex gap-4">
              <Block as="article" className="flex-1 rounded-lg border border-border p-4">
                <Heading level={4} size="sm">as="article"</Heading>
                <Text size="xs" muted>Self-composition content.</Text>
              </Block>
              <Block as="figure" className="flex-1 rounded-lg border border-dashed border-border p-4">
                <Heading level={4} size="sm">as="figure"</Heading>
                <Text size="xs" muted>Illustrative content.</Text>
              </Block>
            </div>
          </div>
        }
        code={`import { Block, Heading, Text } from '@slipstream-ui/core';

<Block as="section" className="rounded-lg border border-border p-4">
  <Heading level={3} size="sm">as="section"</Heading>
  <Text size="sm" muted>A titled region — screen readers can jump between sections.</Text>
</Block>

<Block as="article" className="flex-1">…</Block>
<Block as="figure" className="flex-1">…</Block>`}
      />

      <DemoCard
        title="Inline + utilities"
        preview={
          <div className="w-full space-y-3">
            <Block className="rounded-lg border border-border bg-muted/40 p-4">
              <Text size="sm">Block with utilities — the layout-friendly default div.</Text>
            </Block>
            <Text size="sm" muted>
              Inline blocks stay in flow:{' '}
              <Block inline className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                as="span"
              </Block>{' '}
              inside a paragraph line.
            </Text>
          </div>
        }
        code={`{/* Decorate with utilities when a surface is needed */}
<Block className="rounded-lg border border-border bg-muted/40 p-4">…</Block>

{/* Inline flow — renders a <span> */}
<Block inline className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">token</Block>`}
        usage={`import { Block } from '@slipstream-ui/core';

<Block as="section" className="space-y-2">…</Block>
<Block inline>…</Block>`}
        types={`type BlockProps = {
  as?: 'div' | 'span' | 'section' | 'article' | 'figure'
    | 'header' | 'footer' | 'nav' | 'main' | 'aside';
  inline?: boolean;
  muted?: boolean;
};`}
      />
    </ComponentPage>
  );
}
