'use client';

import { Section, StatBand } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  return (
    <>
      <DemoCard
        title="Proof band on an inverse surface"
        preview={
          <Section tone="inverse" padding="lg" className="rounded-lg">
            <StatBand
              items={[
                { value: '350+', label: 'Active teams', hint: 'Verified for your workspace' },
                { value: '5,000+', label: 'Monthly users', hint: 'Aligned to your goals' },
                { value: '12,000+', label: 'Projects shipped', hint: 'Brought to production' },
              ]}
            />
          </Section>
        }
        code={`<Section tone="inverse">
  <StatBand
    items={[
      { value: '350+', label: 'Active teams', hint: 'Verified for your workspace' },
      { value: '5,000+', label: 'Monthly users', hint: 'Aligned to your goals' },
      { value: '12,000+', label: 'Projects shipped', hint: 'Brought to production' },
    ]}
  />
</Section>`}
        usage={`// Use StatBand for marketing proof, not app KPIs.
// MetricCard is the app tile with delta, trend and loading states.
// columns={2 | 3 | 4}; mobile stacks to one column.`}
        types={`type StatItem = {
  value: React.ReactNode;
  label: string;
  hint?: string;
};

type StatBandProps = {
  items: StatItem[];
  columns?: 2 | 3 | 4;
  align?: 'left' | 'center';
  size?: 'sm' | 'md' | 'lg';
  divided?: boolean;
};`}
      />
      <DemoCard
        title="Left-aligned, undivided, four columns"
        preview={
          <div className="w-full rounded-lg border border-border p-6">
            <StatBand
              columns={4}
              align="left"
              size="sm"
              divided={false}
              items={[
                { value: '12', label: 'Open roles' },
                { value: '48', label: 'Customers' },
                { value: '9', label: 'Regions' },
                { value: '24/7', label: 'Support' },
              ]}
            />
          </div>
        }
        code={`<StatBand
  columns={4}
  align="left"
  size="sm"
  divided={false}
  items={[
    { value: '12', label: 'Open roles' },
    { value: '48', label: 'Customers' },
    { value: '9', label: 'Regions' },
    { value: '24/7', label: 'Support' },
  ]}
/>`}
        usage={`// align="left" + divided={false} suits dense spec sheets; keep
// size="lg" for hero proof bands.`}
      />
    </>
  );
}
