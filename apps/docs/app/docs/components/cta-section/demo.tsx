'use client';

import { Button, CTASection } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function CTASectionPage() {
  return (
    <ComponentPage
      id="cta-section"
      title="CTASection"
      description="Full-width conversion band with eyebrow, headline, supporting copy and actions."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'title', type: 'string', defaultValue: 'required', description: 'Headline for the call to action.' },
        { name: 'description', type: 'string', description: 'Supporting copy under the headline.' },
        { name: 'eyebrow', type: 'string', description: 'Small overline above the headline.' },
        { name: 'actions', type: 'ReactNode', description: 'Buttons or links.' },
        { name: 'tone', type: "'default' | 'muted' | 'brand' | 'inverse'", defaultValue: "'inverse'", description: 'Surface treatment.' },
        { name: 'align', type: "'left' | 'center'", defaultValue: "'center'", description: 'Copy alignment.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Vertical space.' },
        { name: 'width', type: "'sm' | 'md' | 'lg' | 'xl' | 'full'", defaultValue: "'lg'", description: 'Inner container width.' },
      ]}
      accessibility={[
        'Renders an h2 under the page h1.',
        'Inverse tone scopes the token ladder, so semantic Button variants keep their contrast.',
      ]}
    >
      <DemoCard
        title="Default inverse band"
        preview={
          <CTASection
            eyebrow="Get started"
            title="Start building"
            description="Connect your data, invite your team and ship the next release."
            actions={<Button>Get started</Button>}
            className="rounded-lg"
          />
        }
        code={`<CTASection
  eyebrow="Get started"
  title="Start building"
  description="Connect your data, invite your team and ship the next release."
  actions={<Button>Get started</Button>}
/>`}
        usage={`// One CTA section per page is enough.
// tone: default | muted | brand | inverse (default)
// align: left | center; size: sm | md | lg`}
        types={`type CTASectionProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: React.ReactNode;
  tone?: 'default' | 'muted' | 'brand' | 'inverse';
  align?: 'left' | 'center';
  size?: 'sm' | 'md' | 'lg';
  width?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
};`}
      />
    </ComponentPage>
  );
}
