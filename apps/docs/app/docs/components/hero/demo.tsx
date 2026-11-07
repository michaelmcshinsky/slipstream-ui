'use client';

import { Button, Hero, Section } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function HeroPage() {
  return (
    <ComponentPage
      id="hero"
      title="Hero"
      description="Marketing hero with badge, eyebrow, headline, copy, actions and an optional media slot."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'title', type: 'ReactNode', defaultValue: 'required', description: 'Main headline. Accepts inline markup for a highlighted phrase.' },
        { name: 'description', type: 'ReactNode', description: 'Supporting sentence under the headline.' },
        { name: 'eyebrow', type: 'ReactNode', description: 'Small overline above the headline.' },
        { name: 'badge', type: 'ReactNode', description: 'Pill above the headline.' },
        { name: 'actions', type: 'ReactNode', description: 'Primary and secondary calls to action.' },
        { name: 'media', type: 'ReactNode', description: 'Product shot, illustration, video or form shown beside the copy.' },
        { name: 'mediaPosition', type: "'left' | 'right'", defaultValue: "'right'", description: 'Which side the media sits on at lg and up.' },
        { name: 'align', type: "'left' | 'center'", defaultValue: "'left'", description: 'Copy alignment.' },
        { name: 'size', type: "'md' | 'lg'", defaultValue: "'lg'", description: 'Headline scale.' },
        { name: 'level', type: '1 | 2', defaultValue: '1', description: 'Heading level.' },
        { name: 'variant', type: "'split' | 'centered'", description: 'Split or centered layout. Defaults to split when media is provided.' },
        { name: 'as', type: "'div' | 'section' | 'header'", defaultValue: "'div'", description: 'Semantic element to render.' },
      ]}
      accessibility={[
        'Renders h1 by default; use level={2} for a second hero-like band.',
        'Media is a slot, so the consumer owns alt text and decorative treatment.',
      ]}
    >
      <DemoCard
        title="Split hero on an inverse band"
        preview={
          <Section tone="inverse" padding="lg" className="overflow-hidden rounded-lg">
            <Hero
              badge="The private deal network"
              title={
                <>
                  Find your next <span className="text-inverse-primary">buyer.</span>
                </>
              }
              description="Join 20,000+ investors, M&A advisors, and business owners who trust Axial to source deals and hire the right advisor."
              actions={
                <>
                  <Button>Get started</Button>
                  <Button variant="outline">Learn more</Button>
                </>
              }
              media={
                <div className="aspect-[4/3] rounded-2xl border border-inverse-border bg-inverse-card p-5">
                  <div className="flex h-full flex-col justify-between rounded-xl bg-inverse-muted p-5 text-inverse-foreground">
                    <p className="text-xs font-semibold uppercase tracking-widest">Network overview</p>
                    <p className="text-3xl font-semibold">12,000+</p>
                    <p className="text-sm text-inverse-muted-foreground">deals brought to market annually</p>
                  </div>
                </div>
              }
            />
          </Section>
        }
        code={`<Section tone="inverse">
  <Hero
    badge="The private deal network"
    title={<>Find your next <span className="text-inverse-primary">buyer.</span></>}
    description="Join 20,000+ investors, M&A advisors, and business owners."
    actions={<><Button>Get started</Button><Button variant="outline">Learn more</Button></>}
    media={<ProductMockup />}
  />
</Section>`}
        usage={`// Hero is the content block; Section owns the band and padding.
// Use level={2} when the page already has an h1.
// mediaPosition="left" flips the media to the left at lg and up.`}
        types={`type HeroProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  media?: React.ReactNode;
  mediaPosition?: 'left' | 'right';
  align?: 'left' | 'center';
  size?: 'md' | 'lg';
  level?: 1 | 2;
  variant?: 'split' | 'centered';
  as?: 'div' | 'section' | 'header';
};`}
      />
    </ComponentPage>
  );
}
