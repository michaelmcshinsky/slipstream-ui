'use client';

import { Section } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function SectionPage() {
  return (
    <ComponentPage
      id="section"
      title="Section"
      description="Full-width page section with a surface tone, vertical rhythm and an optional centered container."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'tone', type: "'default' | 'muted' | 'subtle' | 'brand' | 'inverse'", defaultValue: "'default'", description: 'Surface treatment. inverse flips background, foreground, card, border and muted tokens for its subtree.' },
        { name: 'padding', type: "'none' | 'sm' | 'md' | 'lg' | 'xl'", defaultValue: "'md'", description: 'Vertical rhythm.' },
        { name: 'width', type: "'sm' | 'md' | 'lg' | 'xl' | 'full'", defaultValue: "'lg'", description: 'Inner Container width.' },
        { name: 'container', type: 'boolean', defaultValue: 'true', description: 'Wrap children in a centered Container.' },
        { name: 'containerClassName', type: 'string', description: 'Extra classes for the inner Container.' },
        { name: 'as', type: "'section' | 'div' | 'article' | 'header' | 'footer' | 'main' | 'aside'", defaultValue: "'section'", description: 'Semantic element to render.' },
      ]}
      accessibility={[
        'tone="inverse" scopes background, foreground, card, border and muted tokens so child components stay readable.',
        'Add aria-label or aria-labelledby when the section is a named landmark.',
      ]}
    >
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
    </ComponentPage>
  );
}
