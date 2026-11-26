'use client';

import { FeatureGrid, Section } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  return (
    <>
      <DemoCard
        title="Three benefits"
        preview={
          <Section padding="lg" className="rounded-lg">
            <FeatureGrid
              features={[
                {
                  title: 'Shared components',
                  description: 'Components curated for your product, stage and team.',
                  icon: <span aria-hidden="true">◆</span>,
                },
                {
                  title: 'Team workspaces',
                  description: 'Invite the right people to every project.',
                  icon: <span aria-hidden="true">◎</span>,
                  href: '/about',
                  actionLabel: 'Learn more',
                },
                {
                  title: 'Secure documents',
                  description: 'Streamlined contracts and document sharing.',
                  icon: <span aria-hidden="true">▣</span>,
                },
              ]}
            />
          </Section>
        }
        code={`<Section>
  <FeatureGrid
    features={[
      { title: 'Shared components', description: 'Curated for your product.', icon: <Shield /> },
      { title: 'Team workspaces', description: 'Invite the right people.', href: '/about', actionLabel: 'Learn more' },
      { title: 'Secure documents', description: 'Streamlined contracts and files.', icon: <Lock /> },
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
    </>
  );
}
