'use client';

import { Avatar, AvatarFallback, Grid, Section, Testimonial } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  return (
    <>
      <DemoCard
        title="Quote wall"
        preview={
          <Section tone="muted" padding="lg" className="rounded-lg">
            <Grid mdCols={2} gap="lg">
              <Testimonial
                quote="The shared component library changed how we ship. We would never have kept the design system consistent otherwise."
                name="Jane Doe"
                role="CEO"
                company="Blind & Shade"
                avatar={<Avatar><AvatarFallback>BF</AvatarFallback></Avatar>}
              />
              <Testimonial
                quote="The team is focused on practical collaboration, and most importantly, shipping work together."
                name="Alex Morgan"
                role="Partner"
                company="Rockwood Equity Partners"
                avatar={<Avatar><AvatarFallback>KF</AvatarFallback></Avatar>}
              />
            </Grid>
          </Section>
        }
        code={`<Section tone="muted">
  <Grid mdCols={2} gap="lg">
    <Testimonial
      quote="The shared library changed how we ship."
      name="Jane Doe"
      role="CEO"
      company="Blind & Shade"
      avatar={<Avatar><AvatarFallback>BF</AvatarFallback></Avatar>}
    />
  </Grid>
</Section>`}
        usage={`// quote is plain text; the component renders the quotation marks.
// logo sits above the quote; avatar sits in the figcaption.`}
        types={`type TestimonialProps = {
  quote: string;
  name: string;
  role?: string;
  company?: string;
  avatar?: React.ReactNode;
  logo?: React.ReactNode;
  variant?: 'card' | 'plain';
  size?: 'sm' | 'md' | 'lg';
};`}
      />
      <DemoCard
        title="Logo, plain variant and sizes"
        preview={
          <div className="w-full max-w-md space-y-6">
            <Testimonial
              variant="plain"
              size="lg"
              quote="Plain quotes scale up for hero sections."
              name="Sam Rivera"
              role="Founder"
              company="Northwind"
              logo={<span className="text-sm font-bold tracking-wide">NORTHWIND</span>}
            />
            <Testimonial
              size="sm"
              quote="Compact cards fit dense pages."
              name="Lee Chen"
              company="Acme"
            />
          </div>
        }
        code={`<Testimonial
  variant="plain"
  size="lg"
  quote="Plain quotes scale up for hero sections."
  name="Sam Rivera"
  role="Founder"
  company="Northwind"
  logo={<BrandMark />}
/>

<Testimonial size="sm" quote="…" name="Lee Chen" company="Acme" />`}
        usage={`// logo renders above the quote; avatar sits in the figcaption.
// variant="plain" drops the card surface for hero and band layouts.`}
      />
    </>
  );
}
