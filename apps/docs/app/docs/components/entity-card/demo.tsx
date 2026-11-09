'use client';

import { Button, EntityCard, Grid } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function EntityCardPage() {
  return (
    <ComponentPage
      id="entity-card"
      title="EntityCard"
      description="Firm or member profile card with logo, type, location, stats, tags and actions."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'name', type: 'string', defaultValue: 'required', description: 'Firm or member name.' },
        { name: 'entityType', type: 'string', defaultValue: 'required', description: 'Firm type, role or member category.' },
        { name: 'location', type: 'string', description: 'Region or office location.' },
        { name: 'description', type: 'string', description: 'Short firm description.' },
        { name: 'logo', type: 'ReactNode', description: 'Logo slot; initials are used when omitted.' },
        { name: 'stats', type: 'EntityStat[]', description: 'Small stats such as closed deals.' },
        { name: 'tags', type: 'string[]', description: 'Sector or service tags.' },
        { name: 'href', type: 'string', description: 'Profile destination.' },
        { name: 'linkComponent', type: 'React.ElementType', description: 'Custom link element for routers.' },
        { name: 'actions', type: 'ReactNode', description: 'Extra footer actions.' },
      ]}
      accessibility={[
        'The title and footer link are the destinations; actions stay separate.',
        'The avatar fallback derives initials from the name.',
      ]}
    >
      <DemoCard
        title="Directory cards"
        preview={
          <Grid mdCols={2} gap="lg">
            <EntityCard
              name="Peakstone Group"
              entityType="Investment bank"
              location="New York, NY"
              description="M&A advisory and capital raising for middle market clients."
              stats={[
                { label: 'Closed deals', value: '60' },
                { label: 'Via Axial', value: '3' },
              ]}
              tags={['Industrials', 'Healthcare']}
              href="/members/peakstone"
              actions={<Button size="sm" variant="outline">Contact</Button>}
            />
            <EntityCard
              name="North Park Capital"
              entityType="Private equity"
              location="Chicago, IL"
              description="Lower middle market buyout firm focused on family-owned businesses."
              stats={[
                { label: 'Platforms', value: '12' },
                { label: 'Active', value: 'Yes' },
              ]}
              tags={['Business services']}
              href="/members/north-park"
            />
          </Grid>
        }
        code={`<EntityCard
  name="Peakstone Group"
  entityType="Investment bank"
  location="New York, NY"
  stats={[
    { label: 'Closed deals', value: '60' },
    { label: 'Via Axial', value: '3' },
  ]}
  tags={['Industrials', 'Healthcare']}
  href="/members/peakstone"
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
  linkComponent?: React.ElementType;
  actions?: React.ReactNode;
};`}
      />
    </ComponentPage>
  );
}
