'use client';

import { Section } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  return (
    <>
      <DemoCard
        title="Section tones"
        preview={
          <div className="w-full space-y-3 overflow-hidden rounded-lg border border-border">
            <Section padding="sm" container={false}>
              <p className="px-5 text-sm font-medium">Default band</p>
            </Section>
            <Section tone="muted" padding="sm" container={false}>
              <p className="px-5 text-sm font-medium">Muted band</p>
            </Section>
            <Section tone="inverse" padding="sm" container={false}>
              <p className="px-5 text-sm font-medium">Inverse band</p>
              <p className="mt-1 px-5 text-sm text-muted-foreground">Muted text stays readable inside the scope.</p>
            </Section>
          </div>
        }
        code={`<Section tone="inverse" padding="lg" width="lg">
  <SectionHeading
    eyebrow="Get started"
    title="Ready to build?"
    description="Connect with the right tools."
    align="center"
  />
</Section>`}
        usage={`// Section owns the full-bleed band and vertical padding.
// Container owns the width and gutters (container defaults to true).
// tone="inverse" scopes the token ladder for cards, borders and muted text.`}
        types={`type SectionProps = {
  tone?: 'default' | 'muted' | 'subtle' | 'brand' | 'inverse';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  width?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  container?: boolean;
  containerClassName?: string;
  as?: 'section' | 'div' | 'article' | 'header' | 'footer' | 'main' | 'aside';
};`}
      />

      <DemoCard
        title="Layout variants"
        preview={
          <div className="w-full space-y-3 overflow-hidden rounded-lg border border-border">
            <Section padding="lg" width="sm" container={false} className="bg-muted/50">
              <p className="px-5 text-sm">padding=&quot;lg&quot; width=&quot;sm&quot; container=&#123;false&#125; — narrow flush band</p>
            </Section>
            <Section as="article" padding="md" width="full" tone="subtle">
              <p className="text-sm">as=&quot;article&quot; width=&quot;full&quot; — edge-to-edge article band</p>
            </Section>
          </div>
        }
        code={`<Section padding="lg" width="sm" container={false}>
  {/* narrow flush band, no centered container */}
</Section>

<Section as="article" width="full" tone="subtle">
  {/* semantic article element, edge-to-edge width */}
</Section>`}
        usage={`// container={false} hands width control to you (pair with width or your own wrapper).
// as swaps the landmark element; width="full" skips the max-width container.`}
      />
    </>
  );
}
