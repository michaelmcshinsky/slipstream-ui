'use client';

import { ComparisonTable } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  return (
    <>
      <DemoCard
        title="With an advisor vs. on your own"
        preview={
          <ComparisonTable
            caption="Working with an advisor compared with selling alone"
            columns={[
              { label: 'With an advisor', highlight: true },
              { label: 'On your own' },
            ]}
            rows={[
              { feature: 'Accurate valuation', values: [true, false], hint: 'Market-tested range' },
              { feature: 'Buyer targeting', values: ['Curated', 'Limited'] },
              { feature: 'Negotiation support', values: [true, false] },
              { feature: 'Confidentiality', values: [true, false] },
            ]}
          />
        }
        code={`<ComparisonTable
  caption="Working with an advisor compared with selling alone"
  columns={[
    { label: 'With an advisor', highlight: true },
    { label: 'On your own' },
  ]}
  rows={[
    { feature: 'Accurate valuation', values: [true, false], hint: 'Market-tested range' },
    { feature: 'Buyer targeting', values: ['Curated', 'Limited'] },
    { feature: 'Negotiation support', values: [true, false] },
  ]}
/>`}
        usage={`// values must have one entry per column.
// true -> check + sr-only "Included"; false -> dash + sr-only "Not included".
// Use string cells for qualitative differences instead of forcing a boolean.`}
        types={`type ComparisonColumn = {
  label: string;
  highlight?: boolean;
};

type ComparisonRow = {
  feature: string;
  values: Array<string | boolean>;
  hint?: string;
};

type ComparisonTableProps = {
  columns: ComparisonColumn[];
  rows: ComparisonRow[];
  caption?: string;
  featureLabel?: string;
  valueLabels?: { yes?: string; no?: string };
};`}
      />
    </>
  );
}
