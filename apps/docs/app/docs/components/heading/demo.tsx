import { DemoCard } from '@/components/demo-card';
import { Heading } from '@slipstream-ui/core';

export default function Demo() {
  return (
    <>
      <DemoCard
        title="Levels"
        preview={
          <div className="w-full space-y-2">
            <Heading level={1}>Heading one: page title</Heading>
            <Heading level={2}>Heading two: section</Heading>
            <Heading level={3}>Heading three: sub-section</Heading>
            <Heading level={4}>Heading four: block</Heading>
            <Heading level={5}>Heading five: group</Heading>
            <Heading level={6}>Heading six: label</Heading>
          </div>
        }
        code={`import { Heading } from '@slipstream-ui/core';

<Heading level={1}>Heading one: page title</Heading>
<Heading level={2}>Heading two: section</Heading>
<Heading level={3}>Heading three: sub-section</Heading>`}
      />

      <DemoCard
        title="Visual size override + muted"
        preview={
          <div className="w-full space-y-3">
            <Heading level={4} size="2xl">h4 semantics, 2xl visual size</Heading>
            <Heading level={2} size="sm" muted>h2 semantics, small muted visual</Heading>
            <Heading level={3} size="lg">h3 semantics at lg size</Heading>
          </div>
        }
        code={`{/* Correct outline position (sequential levels) with independent visual size */}
<Heading level={4} size="2xl">h4 semantics, 2xl visual size</Heading>
<Heading level={2} size="sm" muted>h2 semantics, small muted visual</Heading>`}
        usage={`import { Heading } from '@slipstream-ui/core';

// Keep level sequential; use size for hierarchy breaks
<Heading level={2}>Section</Heading>
<Heading level={3} size="sm" muted>Sub-label</Heading>`}
        types={`type HeadingProps = {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  muted?: boolean;
};`}
      />
    </>
  );
}
