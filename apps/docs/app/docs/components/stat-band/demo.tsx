'use client';

import { Section, StatBand } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function StatBandPage() {
  return (
    <ComponentPage
      id="stat-band"
      title="StatBand"
      description="Semantic description list of headline stats with labels, optional hints and column presets."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'items', type: 'StatItem[]', defaultValue: 'required', description: 'Stats to display: value, label and optional hint.' },
        { name: 'columns', type: '2 | 3 | 4', defaultValue: '3', description: 'Desktop column count.' },
        { name: 'align', type: "'left' | 'center'", defaultValue: "'center'", description: 'Copy alignment.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Value scale.' },
        { name: 'divided', type: 'boolean', defaultValue: 'true', description: 'Draw dividers between stats at sm and up.' },
      ]}
      accessibility={[
        'Renders dl/dt/dd so each number is structurally paired with its label.',
        'Labels are read before values even though the value appears first visually.',
      ]}
    >
      <DemoCard
        title="Proof band on an inverse surface"
        preview={
          <Section tone="inverse" padding="lg" className="rounded-lg">
            <StatBand
              items={[
                { value: '3,500+', label: 'Advisory firms', hint: 'Vetted for your business' },
                { value: '5,000+', label: 'Active investors', hint: 'Aligned to your thesis' },
                { value: '12,000+', label: 'Deals annually', hint: 'Brought to market' },
              ]}
            />
          </Section>
        }
        code={`<Section tone="inverse">
  <StatBand
    items={[
      { value: '3,500+', label: 'Advisory firms', hint: 'Vetted for your business' },
      { value: '5,000+', label: 'Active investors', hint: 'Aligned to your thesis' },
      { value: '12,000+', label: 'Deals annually', hint: 'Brought to market' },
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
    </ComponentPage>
  );
}
