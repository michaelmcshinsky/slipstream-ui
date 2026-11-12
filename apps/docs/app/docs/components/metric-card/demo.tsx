'use client';

import { MetricCard } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function MetricCardPage() {
  return (
    <ComponentPage
      id="metric-card"
      title="MetricCard"
      description="KPI tile: label, value, directional delta (arrow + color) and a supporting hint."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'label', type: 'string', description: 'Metric name. Alias: title.' },
        { name: 'title', type: 'string', description: 'Alias for label (migration-friendly).' },
        { name: 'value', type: 'string | number', defaultValue: 'required', description: 'Primary value, rendered tabular.' },
        { name: 'delta', type: 'string', description: 'Signed change, e.g. +12.4%.' },
        { name: 'trend', type: "'up' | 'down' | 'flat'", defaultValue: "'flat'", description: 'Delta direction color + arrow glyph.' },
        { name: 'hint', type: 'string', description: 'Comparison context (vs last month). Alias: description.' },
        { name: 'description', type: 'string', description: 'Alias for hint (migration-friendly).' },
        { name: 'icon', type: 'ReactNode', description: 'Decorative icon.' },
      ]}
      accessibility={['Deltas always render ↑/↓/→ glyphs, so direction is never color-only.', 'Values use tabular-nums so columns align.']}
    >
      <DemoCard
        title="KPI row"
        preview={
          <div className="grid w-full gap-4 sm:grid-cols-3">
            <MetricCard label="Revenue" value="$12,480" delta="+12.4%" trend="up" hint="vs last month" />
            <MetricCard label="Active students" value={318} delta="+6" trend="up" hint="this week" />
            <MetricCard label="Churn" value="2.1%" delta="-0.4" trend="down" hint="vs last month" />
          </div>
        }
        code={`<div className="grid gap-4 sm:grid-cols-3">
  <MetricCard label="Revenue" value="$12,480" delta="+12.4%" trend="up" hint="vs last month" />
  <MetricCard label="Active students" value={318} delta="+6" trend="up" hint="this week" />
  <MetricCard label="Churn" value="2.1%" delta="-0.4" trend="down" hint="vs last month" />
</div>`}
        usage={`// Pair with Grid for even rows. Always pass trend when you pass delta.`}
        types={`type MetricCardProps = {
  label: string;
  value: string | number;
  delta?: string;
  trend?: 'up' | 'down' | 'flat';
  hint?: string;
  icon?: React.ReactNode;
};`}
      />
    </ComponentPage>
  );
}
