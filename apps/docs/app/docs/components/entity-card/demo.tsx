'use client';

import { Button, EntityCard, Grid } from '@slipstream-ui/core';
import { ComponentPage, type ComponentPageProps } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function EntityCardPage({ manifest }: { manifest?: ComponentPageProps['manifest'] }) {
  return (
    <ComponentPage
        manifest={manifest}
      id="entity-card"
      title="EntityCard"
      description="Profile card with logo, type, location, stats, tags and actions."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'name', type: 'string', defaultValue: 'required', description: 'Firm or member name.' },
        { name: 'entityType', type: 'string', defaultValue: 'required', description: 'Firm type, role or member category.' },
        { name: 'location', type: 'string', description: 'Region or office location.' },
        { name: 'description', type: 'string', description: 'Short firm description.' },
        { name: 'logo', type: 'ReactNode', description: 'Logo slot; initials are used when omitted.' },
        { name: 'stats', type: 'EntityStat[]', description: 'Small stats such as projects delivered.' },
        { name: 'tags', type: 'string[]', description: 'Sector or service tags.' },
        { name: 'href', type: 'string', description: 'Profile destination.' },
        { name: 'cardHref', type: 'string', description: 'Whole-card stretched link; suppresses the footer link.' },
        { name: 'linkComponent', type: 'React.ElementType', description: 'Custom link element for routers.' },
        { name: 'actions', type: 'ReactNode', description: 'Extra footer actions.' },
      ]}
      accessibility={[
        'The title and footer link are the destinations; cardHref makes the whole card one stretched link with actions layered above.',
        'The avatar fallback derives initials from the name.',
      ]}
    >
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
    </ComponentPage>
  );
}
