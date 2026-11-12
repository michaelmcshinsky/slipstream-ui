'use client';

import { LogoCloud, Section } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function LogoCloudPage() {
  return (
    <ComponentPage
      id="logo-cloud"
      title="LogoCloud"
      description="Trust strip for member, customer or partner logos with captions, columns and optional links."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'items', type: 'LogoItem[]', defaultValue: 'required', description: 'Logos: accessible name, decorative artwork and optional href.' },
        { name: 'caption', type: 'string', description: 'Caption above the strip.' },
        { name: 'columns', type: '3 | 4 | 5 | 6', defaultValue: '4', description: 'Desktop column count.' },
        { name: 'grayscale', type: 'boolean', defaultValue: 'true', description: 'Desaturate logos until hover.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Logo box height.' },
        { name: 'align', type: "'left' | 'center'", defaultValue: "'center'", description: 'Caption and grid alignment.' },
        { name: 'linkComponent', type: 'React.ElementType', description: 'Custom link element for routers.' },
      ]}
      accessibility={[
        'Logos are decorative; the item name is announced once through sr-only text.',
        'Linked logos are a single focusable link named by the item.',
      ]}
    >
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
};`}
      />
    </ComponentPage>
  );
}
