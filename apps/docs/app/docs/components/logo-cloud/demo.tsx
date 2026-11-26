'use client';

import { LogoCloud, Section } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  return (
    <>
      <DemoCard
        title="Trusted by"
        preview={
          <Section tone="muted" padding="lg" className="rounded-lg">
            <LogoCloud
              caption="Trusted by teams everywhere"
              items={[
                { name: 'Example', logo: <span className="text-lg font-semibold tracking-tight">EXAMPLE</span> },
                { name: 'Northwind', logo: <span className="text-lg font-semibold tracking-tight">NORTHWIND</span> },
                { name: 'Contoso', logo: <span className="text-lg font-semibold tracking-tight">CONTOSO</span> },
                { name: 'Fabrikam', logo: <span className="text-lg font-semibold tracking-tight">fabrikam</span> },
              ]}
            />
          </Section>
        }
        code={`<Section tone="muted">
  <LogoCloud
    caption="Trusted by teams everywhere"
    items={[
      { name: 'Example', logo: <img src="/example.svg" alt="" /> },
      { name: 'Northwind', logo: <img src="/northwind.svg" alt="" />, href: '/directory/northwind' },
    ]}
  />
</Section>`}
        usage={`// Mark logo images alt="" because the item name supplies the accessible text.
// columns 3-6; size controls the logo box height; grayscale is on by default.`}
        types={`type LogoItem = {
  name: string;
  logo: React.ReactNode;
  href?: string;
};

type LogoCloudProps = {
  items: LogoItem[];
  caption?: string;
  columns?: 3 | 4 | 5 | 6;
  grayscale?: boolean;
  size?: 'sm' | 'md' | 'lg';
  align?: 'left' | 'center';
  linkComponent?: React.ElementType;
  linkHrefProp?: 'href' | 'to';
};`}
      />
    </>
  );
}
