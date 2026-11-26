'use client';

import { useState } from 'react';
import { DealCard, Grid } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  const [savedTitles, setSavedTitles] = useState<ReadonlySet<string>>(new Set());
  const [accessRequests, setAccessRequests] = useState<ReadonlySet<string>>(new Set());

  const toggleSave = (title: string) =>
    setSavedTitles((current) => {
      const next = new Set(current);
      if (next.has(title)) next.delete(title); else next.add(title);
      return next;
    });

  const requestAccess = (title: string) =>
    setAccessRequests((current) => new Set(current).add(title));

  return (
    <>
      <DemoCard
        title="Deal grid"
        preview={
          <>
          <Grid mdCols={2} gap="lg">
            <DealCard
              title="Multi-regional logistics platform"
              sector="Transportation"
              location="West region"
              description="Recurring services and reporting across a multi-state operation."
              metrics={[
                { label: 'Revenue', value: '$20.4M' },
                { label: 'EBITDA', value: '$4.2M' },
                { label: 'Margin', value: '21%' },
              ]}
              ndaAvailable
              cimAvailable
              saved={savedTitles.has('Multi-regional logistics platform')}
              onSave={() => toggleSave('Multi-regional logistics platform')}
              onRequestAccess={() => requestAccess('Multi-regional logistics platform')}
            />
            <DealCard
              title="Retail procurement platform"
              sector="Technology"
              location="West region"
              metrics={[
                { label: 'Revenue', value: '$14.4M' },
                { label: 'EBITDA', value: '$6.8M' },
                { label: 'Margin', value: '47%' },
              ]}
              status="under-nda"
              ndaAvailable
              saved={savedTitles.has('Retail procurement platform')}
              onSave={() => toggleSave('Retail procurement platform')}
              onRequestAccess={() => requestAccess('Retail procurement platform')}
            />
          </Grid>
          {(savedTitles.size > 0 || accessRequests.size > 0) && (
            <p className="mt-3 text-xs text-muted-foreground" role="status">
              {savedTitles.size > 0 && `Saved: ${[...savedTitles].join(', ')}. `}
              {accessRequests.size > 0 && `Access requested: ${[...accessRequests].join(', ')}.`}
            </p>
          )}
          </>
        }
        code={`<DealCard
  title="Logistics platform"
  sector="Transportation"
  location="West region"
  metrics={[
    { label: 'Revenue', value: '$20.4M' },
    { label: 'EBITDA', value: '$4.2M' },
    { label: 'Margin', value: '21%' },
  ]}
  ndaAvailable
  cimAvailable
  onRequestAccess={requestAccess}
/>`}
        usage={`// Access is explicit through text badges.
// Use LoadMore below the grid for paginated results.`}
        types={`type DealMetric = { label: string; value: string };

type DealStatus = 'available' | 'under-nda' | 'closed' | 'draft';

type DealCardProps = {
  title: string;
  sector: string;
  location?: string;
  description?: string;
  metrics: DealMetric[];
  status?: DealStatus;
  ndaAvailable?: boolean;
  cimAvailable?: boolean;
  href?: string;
  linkComponent?: React.ElementType;
  saved?: boolean;
  onSave?: () => void;
  saveLabel?: string;
  onRequestAccess?: () => void;
  requestLabel?: string;
};`}
      />
    </>
  );
}
