'use client';

import { MetricCard } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  return (
    <>
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
  label?: string;            // alias: title
  title?: string;            // alias for label
  value: string | number;
  delta?: string;
  trend?: 'up' | 'down' | 'flat';
  hint?: string;             // alias: description
  description?: string;      // alias for hint
  tone?: 'default' | 'success' | 'warning' | 'destructive';
  loading?: boolean;
  icon?: React.ReactNode;
};`}
      />
    </>
  );
}
