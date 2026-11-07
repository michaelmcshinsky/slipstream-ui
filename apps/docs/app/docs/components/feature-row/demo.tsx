'use client';

import { Button, FeatureRow, Section } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function FeatureRowPage() {
  return (
    <ComponentPage
      id="feature-row"
      title="FeatureRow"
      description="Alternating media and copy row for mid-page feature sections."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'title', type: 'ReactNode', defaultValue: 'required', description: 'Row heading.' },
        { name: 'description', type: 'ReactNode', description: 'Supporting copy.' },
        { name: 'eyebrow', type: 'ReactNode', description: 'Small overline above the heading.' },
        { name: 'actions', type: 'ReactNode', description: 'Calls to action.' },
        { name: 'media', type: 'ReactNode', defaultValue: 'required', description: 'Image, mockup, video or form beside the copy.' },
        { name: 'mediaPosition', type: "'left' | 'right'", defaultValue: "'right'", description: 'Media side at lg and up.' },
        { name: 'level', type: '2 | 3', defaultValue: '2', description: 'Heading level.' },
        { name: 'size', type: "'md' | 'lg'", defaultValue: "'md'", description: 'Heading scale.' },
      ]}
      accessibility={[
        'Defaults to h2; use level={3} for a nested subsection.',
        'Media is a slot so the consumer owns alt text.',
      ]}
    >
      <DemoCard
        title="Feature row"
        preview={
          <Section padding="lg" className="rounded-lg">
            <FeatureRow
              eyebrow="For acquirers"
              title="Source relevant, actionable deals"
              description="Discover deals tailored to your thesis from 12,000+ opportunities brought to market each year."
              actions={<Button>Learn more</Button>}
              media={
                <div className="aspect-[4/3] rounded-2xl border border-border bg-muted p-6">
                  <div className="flex h-full flex-col justify-between rounded-xl bg-card p-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary">Deal flow</p>
                    <p className="text-3xl font-semibold">12,856</p>
                    <p className="text-sm text-muted-foreground">deals brought to market</p>
                  </div>
                </div>
              }
            />
          </Section>
        }
        code={`<Section>
  <FeatureRow
    eyebrow="For acquirers"
    title="Source relevant, actionable deals"
    description="Discover deals tailored to your thesis."
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
    </ComponentPage>
  );
}
