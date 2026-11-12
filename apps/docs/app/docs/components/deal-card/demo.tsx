'use client';

import { DealCard, Grid } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function DealCardPage() {
  return (
    <ComponentPage
      id="deal-card"
      title="DealCard"
      description="Marketplace listing card with sector, status, metrics, access badges and actions."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'title', type: 'string', defaultValue: 'required', description: 'Listing headline.' },
        { name: 'sector', type: 'string', defaultValue: 'required', description: 'Sector or industry label.' },
        { name: 'location', type: 'string', description: 'Region or location.' },
        { name: 'description', type: 'string', description: 'Optional short summary.' },
        { name: 'metrics', type: 'DealMetric[]', defaultValue: 'required', description: 'Three headline metrics.' },
        { name: 'status', type: "'available' | 'under-nda' | 'closed' | 'draft'", defaultValue: "'available'", description: 'Availability state.' },
        { name: 'ndaAvailable', type: 'boolean', description: 'Show the NDA badge.' },
        { name: 'cimAvailable', type: 'boolean', description: 'Show the CIM badge.' },
        { name: 'href', type: 'string', description: 'Optional detail link.' },
        { name: 'linkComponent', type: 'React.ElementType', description: 'Custom link element for routers.' },
        { name: 'saved', type: 'boolean', defaultValue: 'false', description: 'Save toggle state.' },
        { name: 'onSave', type: '() => void', description: 'Save toggle handler.' },
        { name: 'saveLabel', type: 'string', defaultValue: "'Save'", description: 'Save button label.' },
        { name: 'onRequestAccess', type: '() => void', description: 'Request access handler.' },
        { name: 'requestLabel', type: 'string', defaultValue: "'Request access'", description: 'Request access label.' },
      ]}
      accessibility={[
        'NDA and CIM access are text badges, never color or icons alone.',
        'Request access and Save are real buttons; Save exposes aria-pressed.',
      ]}
    >
      <DemoCard
        title="Deal grid"
        preview={
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
              onRequestAccess={() => {}}
              onSave={() => {}}
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
              onRequestAccess={() => {}}
              onSave={() => {}}
            />
          </Grid>
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
    </ComponentPage>
  );
}
