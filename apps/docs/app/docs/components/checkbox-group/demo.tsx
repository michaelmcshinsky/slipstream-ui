'use client';

import { useState } from 'react';
import { CheckboxGroup, CheckboxGroupItem } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  const [langs, setLangs] = useState<string[]>(['ts']);
  const [alerts, setAlerts] = useState<string[]>([]);

  return (
    <>
      <DemoCard
        title="Vertical group (interactive)"
        preview={
          <div className="w-full max-w-lg">
            <CheckboxGroup
              name="langs"
              legend="Languages"
              value={langs}
              onValueChange={setLangs}
            >
              <CheckboxGroupItem value="ts" label="TypeScript" />
              <CheckboxGroupItem value="go" label="Go" />
              <CheckboxGroupItem value="rs" label="Rust" />
            </CheckboxGroup>
            <p className="mt-3 text-sm text-muted-foreground">
              selection: <code className="text-foreground">[{langs.map((l) => `'${l}'`).join(', ')}]</code>
            </p>
          </div>
        }
        code={`<CheckboxGroup
  name="langs"
  legend="Languages"
  value={langs}
  onValueChange={setLangs}
>
  <CheckboxGroupItem value="ts" label="TypeScript" />
  <CheckboxGroupItem value="go" label="Go" />
  <CheckboxGroupItem value="rs" label="Rust" />
</CheckboxGroup>`}
        usage={`import { CheckboxGroup, CheckboxGroupItem } from '@slipstream-ui/core';

// Uncontrolled with an initial selection
<CheckboxGroup name="langs" legend="Languages" defaultValue={['ts']}>
  <CheckboxGroupItem value="ts" label="TypeScript" />
  <CheckboxGroupItem value="go" label="Go" />
</CheckboxGroup>`}
        types={`type CheckboxGroupProps = {
  name: string;
  legend?: string;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  orientation?: 'vertical' | 'horizontal';
};`}
      />

      <DemoCard
        title="Horizontal layout (interactive)"
        preview={
          <div className="w-full">
            <CheckboxGroup
              name="alerts"
              legend="Alert channels"
              orientation="horizontal"
              value={alerts}
              onValueChange={setAlerts}
            >
              <CheckboxGroupItem value="email" label="Email" />
              <CheckboxGroupItem value="slack" label="Slack" />
              <CheckboxGroupItem value="pager" label="PagerDuty" />
              <CheckboxGroupItem value="webhook" label="Webhook" />
            </CheckboxGroup>
            <p className="mt-3 text-sm text-muted-foreground">
              {alerts.length === 0 ? 'No channels selected' : `Will notify: ${alerts.join(', ')}`}
            </p>
          </div>
        }
        code={`<CheckboxGroup name="alerts" legend="Alert channels" orientation="horizontal">
  <CheckboxGroupItem value="email" label="Email" />
  <CheckboxGroupItem value="slack" label="Slack" />
  <CheckboxGroupItem value="pager" label="PagerDuty" />
</CheckboxGroup>`}
        usage={`// Horizontal lays options in a wrapping row: ideal for short
// parallel labels; keep vertical for long or nested sets.`}
      />

      <DemoCard
        title="Group-level error"
        preview={
          <div className="w-full max-w-lg">
            <CheckboxGroup
              name="fmt"
              legend="Export format"
              orientation="horizontal"
              error="Choose at least one format"
            >
              <CheckboxGroupItem value="csv" label="CSV" />
              <CheckboxGroupItem value="json" label="JSON" />
              <CheckboxGroupItem value="parquet" label="Parquet" />
            </CheckboxGroup>
          </div>
        }
        code={`<CheckboxGroup
  name="fmt"
  legend="Export format"
  orientation="horizontal"
  error="Choose at least one format"
>
  <CheckboxGroupItem value="csv" label="CSV" />
  <CheckboxGroupItem value="json" label="JSON" />
</CheckboxGroup>`}
        usage={`// Group-scoped validation (required selection) belongs on the group's
// error slot: it renders role=alert next to the legend, one fieldset
// total. For layout grouping of unrelated controls, use Fieldset.`}
      />
    </>
  );
}
