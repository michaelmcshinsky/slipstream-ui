import { DemoCard } from '@/components/demo-card';
import { Text } from '@slipstream-ui/core';

export default function Demo() {
  return (
    <>
      <DemoCard
        title="Sizes and weights"
        preview={
          <div className="w-full space-y-2">
            <Text size="xl" weight="semibold">xl semibold: lead paragraph</Text>
            <Text size="base">base: the default body paragraph, rendered as a real p element.</Text>
            <Text size="sm" weight="medium">sm medium: emphasized supporting copy</Text>
            <Text size="xs" muted>xs muted: captions, footnotes, meta lines</Text>
            <Text size="lg">lg: short marketing lines</Text>
          </div>
        }
        code={`import { Text } from '@slipstream-ui/core';

<Text size="xl" weight="semibold">xl semibold: lead paragraph</Text>
<Text>base: the default body paragraph.</Text>
<Text size="sm" weight="medium">sm medium: emphasized supporting copy</Text>
<Text size="xs" muted>xs muted: captions, footnotes</Text>`}
      />

      <DemoCard
        title="Inline variation"
        preview={
          <div className="w-full space-y-3">
            <Text size="sm">
              Inline text flows with its neighbors:{' '}
              <Text inline weight="semibold" className="text-primary">
                this fragment is a span
              </Text>{' '}
              inside the paragraph, not a block box.
            </Text>
            <Text size="sm" muted>
              Use <Text inline className="font-mono">inline</Text> for terms, tokens, and
              mid-sentence emphasis that must stay in flow.
            </Text>
          </div>
        }
        code={`{/* inline renders a <span>: stays in the paragraph's text flow */}
<Text size="sm">
  Inline text flows with its neighbors:{' '}
  <Text inline weight="semibold" className="text-primary">
    this fragment is a span
  </Text>{' '}
  inside the paragraph.
</Text>`}
        usage={`import { Text } from '@slipstream-ui/core';

// Block paragraph (default)
<Text size="sm" muted>Supporting copy.</Text>

// Inline fragment
<Text inline weight="medium">Term</Text>`}
        types={`type TextProps = {
  inline?: boolean;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  muted?: boolean;
};`}
      />
    </>
  );
}
