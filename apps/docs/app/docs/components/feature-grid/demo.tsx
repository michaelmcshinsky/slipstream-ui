'use client';

import { FeatureGrid, Section } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function FeatureGridPage() {
  return (
    <ComponentPage
      id="feature-grid"
      title="FeatureGrid"
      description="Grid of feature or benefit cards with an icon, title, copy and optional link."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'features', type: 'FeatureItem[]', defaultValue: 'required', description: 'Features: title, optional description, icon, href and actionLabel.' },
        { name: 'columns', type: '2 | 3 | 4', defaultValue: '3', description: 'Desktop column count.' },
        { name: 'variant', type: "'card' | 'plain'", defaultValue: "'card'", description: 'Card surface or a plain stack.' },
        { name: 'align', type: "'left' | 'center'", defaultValue: "'left'", description: 'Content alignment.' },
        { name: 'linkComponent', type: 'React.ElementType', description: 'Custom link element for routers.' },
      ]}
      accessibility={[
        'Renders ul/li so the group and item count are announced.',
        'A linked feature is one link; do not nest buttons inside it.',
      ]}
    >
      <DemoCard
        title="Three benefits"
        preview={
          <Section padding="lg" className="rounded-lg">
            <FeatureGrid
              features={[
                {
                  title: 'Vetted advisors',
                  description: 'Advisors curated for your business, stage and sector.',
                  icon: <span aria-hidden="true">◆</span>,
                },
                {
                  title: 'Buyer targeting',
                  description: 'Reach the right investors for every mandate.',
                  icon: <span aria-hidden="true">◎</span>,
                  href: '/features/buyers',
                  actionLabel: 'Learn more',
                },
                {
                  title: 'Secure documents',
                  description: 'Streamlined NDAs and CIM distribution.',
                  icon: <span aria-hidden="true">▣</span>,
                },
              ]}
            />
          </Section>
        }
        code={`<Section>
  <FeatureGrid
    features={[
      { title: 'Vetted advisors', description: 'Curated for your business.', icon: <Shield /> },
      { title: 'Buyer targeting', description: 'Reach the right investors.', href: '/features/buyers', actionLabel: 'Learn more' },
      { title: 'Secure documents', description: 'Streamlined NDAs and CIMs.', icon: <Lock /> },
    ]}
  />
</Section>`}
        usage={`// Use card for standalone feature groups, plain inside an existing card.
// columns 2-4; align center for shorter benefit copy.`}
        types={`type FeatureItem = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  href?: string;
  actionLabel?: string;
};

type FeatureGridProps = {
  features: FeatureItem[];
  columns?: 2 | 3 | 4;
  variant?: 'card' | 'plain';
  align?: 'left' | 'center';
  linkComponent?: React.ElementType;
};`}
      />
    </ComponentPage>
  );
}
