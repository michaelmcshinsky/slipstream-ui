'use client';

import { Button, CTASection } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  return (
    <>
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
    </>
  );
}
