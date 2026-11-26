'use client';

import { Button, FeatureRow, Section } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  return (
    <>
      <DemoCard
        title="Feature row"
        preview={
          <Section padding="lg" className="rounded-lg">
            <FeatureRow
              eyebrow="For acquirers"
              title="Find relevant, actionable insights"
              description="Discover insights tailored to your team from 12,000+ events processed each year."
              actions={<Button>Learn more</Button>}
              media={
                <div className="aspect-[4/3] rounded-2xl border border-border bg-muted p-6">
                  <div className="flex h-full flex-col justify-between rounded-xl bg-card p-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary">Event flow</p>
                    <p className="text-3xl font-semibold">1,284</p>
                    <p className="text-sm text-muted-foreground">events processed</p>
                  </div>
                </div>
              }
            />
          </Section>
        }
        code={`<Section>
  <FeatureRow
    eyebrow="For acquirers"
    title="Find relevant, actionable insights"
    description="Discover insights tailored to your team."
    actions={<Button>Learn more</Button>}
    media={<ProductMockup />}
  />
</Section>`}
        usage={`// Media defaults to the right; set mediaPosition="left" to alternate rows.
// FeatureRow is for mid-page sections. Use Hero for the page h1.`}
        types={`type FeatureRowProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  actions?: React.ReactNode;
  media: React.ReactNode;
  mediaPosition?: 'left' | 'right';
  level?: 2 | 3;
  size?: 'md' | 'lg';
};`}
      />
    </>
  );
}
