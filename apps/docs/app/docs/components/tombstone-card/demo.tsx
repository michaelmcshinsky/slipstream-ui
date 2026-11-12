'use client';

import { Grid, TombstoneCard } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function TombstoneCardPage() {
  return (
    <ComponentPage
      id="tombstone-card"
      title="TombstoneCard"
      description="Placeholder card for archived, closed or unavailable marketplace items."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'title', type: 'string', defaultValue: 'required', description: 'Listing, item or document name.' },
        { name: 'reason', type: 'string', description: 'Why the item is unavailable.' },
        { name: 'status', type: "'archived' | 'unavailable' | 'closed'", defaultValue: "'unavailable'", description: 'Unavailable state.' },
        { name: 'logo', type: 'ReactNode', description: 'Logo or document icon slot.' },
        { name: 'href', type: 'string', description: 'Optional detail destination.' },
        { name: 'actionLabel', type: 'string', defaultValue: "'View details'", description: 'Link label.' },
        { name: 'linkComponent', type: 'React.ElementType', description: 'Custom link element for routers.' },
      ]}
      accessibility={[
        'The unavailable state is a text badge, not color alone.',
        'The reason stays visible so a saved link still explains the state.',
      ]}
    >
      <DemoCard
        title="Archived and closed items"
        preview={
          <Grid mdCols={2} gap="lg">
            <TombstoneCard
              title="Archived listing"
              reason="This listing closed in 2025."
              status="archived"
              href="/items/archived"
            />
            <TombstoneCard
              title="Document no longer available"
              reason="The seller withdrew this opportunity."
              status="unavailable"
            />
          </Grid>
        }
        code={`<TombstoneCard
  title="Archived listing"
  reason="This listing closed in 2025."
  status="archived"
  href="/items/archived"
/>`}
        usage={`// Use in place of a live card when the item is archived or withdrawn.
// Keep the reason specific so the state is understandable.`}
        types={`type TombstoneStatus = 'archived' | 'unavailable' | 'closed';

type TombstoneCardProps = {
  title: string;
  reason?: string;
  status?: TombstoneStatus;
  logo?: React.ReactNode;
  href?: string;
  actionLabel?: string;
  linkComponent?: React.ElementType;
};`}
      />
    </ComponentPage>
  );
}
