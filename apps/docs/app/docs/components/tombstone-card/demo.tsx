'use client';

import { Grid, TombstoneCard } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  return (
    <>
      <DemoCard
        title="Archived and closed items"
        preview={
          <Grid mdCols={2} gap="lg">
            <TombstoneCard
              title="Archived listing"
              reason="This listing closed in 2025."
              status="archived"
              href="/docs"
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
    </>
  );
}
