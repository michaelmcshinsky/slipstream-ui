'use client';

import { Button, Hero, Section } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

function ProductMockup() {
  return (
    <div className="aspect-[4/3] rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex h-full flex-col justify-between rounded-xl bg-muted p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Usage overview</p>
        <p className="text-3xl font-semibold">12,000+</p>
        <p className="text-sm text-muted-foreground">events processed monthly</p>
      </div>
    </div>
  );
}

function OverlayBackdrop() {
  return (
    <div className="bg-gradient-to-br from-primary via-primary/70 to-foreground" aria-hidden="true" />
  );
}

export default function Demo() {
  return (
    <>
      <div className="space-y-8">
        <DemoCard
          title="Split hero on an inverse band"
          preview={
            <Section tone="inverse" padding="lg" className="overflow-hidden rounded-lg">
              <Hero
                badge="The modern product platform"
                title={
                  <>
                    Ship your next <span className="text-inverse-primary">release.</span>
                  </>
                }
                description="Join 20,000+ product teams who ship customer-facing interfaces every week."
                actions={
                  <>
                    <Button>Get started</Button>
                    <Button variant="outline">Learn more</Button>
                  </>
                }
                media={<ProductMockup />}
              />
            </Section>
          }
          code={`<Section tone="inverse">
  <Hero
    badge="The modern product platform"
    title={<>Ship your next <span className="text-inverse-primary">release.</span></>}
    description="Join 20,000+ product teams building on a shared design system."
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
  variant?: 'split' | 'centered' | 'stacked' | 'overlay';
  as?: 'div' | 'section' | 'header';
};`}
        />

        <DemoCard
          title="Centered hero (no media)"
          preview={
            <Section tone="muted" padding="md" className="overflow-hidden rounded-lg">
              <Hero
                variant="centered"
                eyebrow="Usage overview"
                title="One workspace, fewer handoffs"
                description="Search every project, track the work, and keep the files in one place."
                actions={<Button>Explore the network</Button>}
              />
            </Section>
          }
          code={`<Section tone="muted">
  <Hero
    variant="centered"
    eyebrow="Usage overview"
    title="One workspace, fewer handoffs"
    description="Search every project, track the work, and keep the files in one place."
    actions={<Button>Explore the network</Button>}
  />
</Section>`}
        />

        <DemoCard
          title="Reversed split"
          preview={
            <Section padding="md" className="overflow-hidden rounded-lg">
              <Hero
                mediaPosition="left"
                size="md"
                eyebrow="Pipeline"
                title="Know the account before the first call"
                description="Every account arrives with the team, plan, and context attached."
                media={
                  <div className="aspect-[4/3] rounded-xl border border-border bg-gradient-to-br from-primary/15 to-accent p-6">
                    <div className="h-full rounded-lg border border-border bg-card/80 p-4">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">Account fit</p>
                      <p className="mt-2 text-2xl font-semibold">94%</p>
                      <p className="text-sm text-muted-foreground">plan and team size match</p>
                    </div>
                  </div>
                }
              />
            </Section>
          }
          code={`<Hero
  mediaPosition="left"
  size="md"
  eyebrow="Pipeline"
  title="Know the account before the first call"
  description="Every account arrives with the team, plan, and context attached."
  media={<BuyerFitCard />}
/>`}
        />

        <DemoCard
          title="Stacked hero (copy above media)"
          preview={
            <Section tone="muted" padding="md" className="overflow-hidden rounded-lg">
              <Hero
                variant="stacked"
                align="center"
                badge="Product tour"
                title="Every project in one workspace"
                description="Move from idea to launch without another spreadsheet."
                media={
                  <div className="aspect-[16/9] rounded-xl border border-border bg-card p-4 shadow-sm">
                    <div className="grid h-full grid-cols-3 gap-3">
                      {['Sourcing', 'Diligence', 'Close'].map((stage, index) => (
                        <div key={stage} className="flex flex-col justify-between rounded-lg bg-muted p-4">
                          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{stage}</p>
                          <p className="text-2xl font-semibold">{[42, 18, 7][index]}</p>
                          <div className="h-1.5 rounded-full bg-border">
                            <div className="h-1.5 rounded-full bg-primary" style={{ width: `${[80, 55, 30][index]}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                }
              />
            </Section>
          }
          code={`<Hero
  variant="stacked"
  align="center"
  badge="Product tour"
  title="Every project in one workspace"
  description="Move from idea to launch without another spreadsheet."
  media={<DashboardScreenshot />}
/>`}
        />

        <DemoCard
          title="Overlay hero (media behind the copy)"
          preview={
            <Section padding="none" className="overflow-hidden rounded-lg">
              <Hero
                variant="overlay"
                align="center"
                badge="Spring season"
                title="Build something people love"
                description="Three products, one platform, shipping every week."
                actions={<Button>Get tickets</Button>}
                media={<OverlayBackdrop />}
              />
            </Section>
          }
          code={`<Hero
  variant="overlay"
  align="center"
  badge="Spring season"
  title="Build something people love"
  description="Three products, one platform, shipping every week."
  actions={<Button>Get tickets</Button>}
  media={<img src="/ballroom.jpg" alt="" />}
/>`}
          usage={`// The media wrapper fills the hero and object-cover crops an <img>.
// A theme-aware scrim sits between media and copy; keep the crop calm
// and the headline short so contrast stays comfortable.
// Use a plain <div> with a gradient when you have no photo.`}
        />
      </div>
    </>
  );
}
