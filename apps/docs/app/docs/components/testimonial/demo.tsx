'use client';

import { Avatar, AvatarFallback, Grid, Section, Testimonial } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function TestimonialPage() {
  return (
    <ComponentPage
      id="testimonial"
      title="Testimonial"
      description="Semantic written testimonial with quote, person, role, company, avatar and logo slots."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'quote', type: 'string', defaultValue: 'required', description: 'Testimonial copy without quotation marks.' },
        { name: 'name', type: 'string', defaultValue: 'required', description: 'Person or company name.' },
        { name: 'role', type: 'string', description: 'Role or title.' },
        { name: 'company', type: 'string', description: 'Company name.' },
        { name: 'avatar', type: 'ReactNode', description: 'Avatar slot.' },
        { name: 'logo', type: 'ReactNode', description: 'Brand or logo slot.' },
        { name: 'variant', type: "'card' | 'plain'", defaultValue: "'card'", description: 'Card surface or plain quote.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Quote scale.' },
      ]}
      accessibility={[
        'Renders figure, blockquote and figcaption so the attribution is structural.',
        'The quote prop should not include quotation marks; the component adds them.',
      ]}
    >
      <DemoCard
        title="Quote wall"
        preview={
          <Section tone="muted" padding="lg" className="rounded-lg">
            <Grid mdCols={2} gap="lg">
              <Testimonial
                quote="The right advisor changed the outcome. We would never have known the true value of the business otherwise."
                name="Bob Falahee"
                role="CEO"
                company="Blind & Shade"
                avatar={<Avatar><AvatarFallback>BF</AvatarFallback></Avatar>}
              />
              <Testimonial
                quote="Axial is focused on effective matchmaking with a personal touch, and most importantly, getting deals done."
                name="Kate Faust"
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
      quote="The right advisor changed the outcome."
      name="Bob Falahee"
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
    </ComponentPage>
  );
}
