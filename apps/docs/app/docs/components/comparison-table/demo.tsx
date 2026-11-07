'use client';

import { ComparisonTable } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function ComparisonTablePage() {
  return (
    <ComponentPage
      id="comparison-table"
      title="ComparisonTable"
      description="Marketing comparison table with check/dash boolean cells, a highlighted column and responsive overflow."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'columns', type: 'ComparisonColumn[]', defaultValue: 'required', description: 'Comparison columns, excluding the feature column. Each column has a label and optional highlight.' },
        { name: 'rows', type: 'ComparisonRow[]', defaultValue: 'required', description: 'Feature rows with one value per column. Booleans render check/dash; strings render as text.' },
        { name: 'caption', type: 'string', defaultValue: "'Comparison'", description: 'Accessible table caption.' },
        { name: 'featureLabel', type: 'string', defaultValue: "'Feature'", description: 'Heading for the feature column.' },
        { name: 'valueLabels', type: '{ yes?: string; no?: string }', description: 'Screen-reader labels for boolean cells.' },
      ]}
      accessibility={[
        'Renders a real table with caption, scope=col and scope=row.',
        'Boolean cells pair the visual check/dash with screen-reader Included/Not included text.',
      ]}
    >
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
    </ComponentPage>
  );
}
