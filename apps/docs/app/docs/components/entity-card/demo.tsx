'use client';

import { Button, EntityCard, Grid } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  return (
    <>
      <DemoCard
        title="Directory cards"
        preview={
          <Grid mdCols={2} gap="lg">
            <EntityCard
              name="Example Group"
              entityType="Investment bank"
              location="Springfield"
              description="Consulting and advisory services for growing teams."
              stats={[
                { label: 'Projects delivered', value: '60' },
                { label: 'Via platform', value: '3' },
              ]}
              tags={['Industrials', 'Healthcare']}
              href="/about"
              actions={<Button size="sm" variant="outline">Contact</Button>}
            />
            <EntityCard
              name="Northwind Labs"
              entityType="Private equity"
              location="Riverton"
              description="Product studio focused on small business software."
              stats={[
                { label: 'Platforms', value: '12' },
                { label: 'Active', value: 'Yes' },
              ]}
              tags={['Business services']}
              href="/contact"
            />
          </Grid>
        }
        code={`<EntityCard
  name="Example Group"
  entityType="Investment bank"
  location="Springfield"
  stats={[
    { label: 'Projects delivered', value: '60' },
    { label: 'Via platform', value: '3' },
  ]}
  tags={['Industrials', 'Healthcare']}
  href="/about"
/>`}
        usage={`// ProfileCard is an alias for profile-oriented surfaces.
// Logos are optional; initials keep the card identifiable.`}
        types={`type EntityStat = { label: string; value: string };

type EntityCardProps = {
  name: string;
  entityType: string;
  location?: string;
  description?: string;
  logo?: React.ReactNode;
  stats?: EntityStat[];
  tags?: string[];
  href?: string;
  cardHref?: string;
  linkComponent?: React.ElementType;
  actions?: React.ReactNode;
};`}
      />
    </>
  );
}
