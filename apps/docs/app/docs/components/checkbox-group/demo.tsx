'use client';

import { useState } from 'react';
import { CheckboxGroup, CheckboxGroupItem } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function CheckboxGroupPage() {
  const [langs, setLangs] = useState<string[]>(['ts']);
  const [alerts, setAlerts] = useState<string[]>([]);

  return (
    <ComponentPage
      id="checkbox-group"
      title="CheckboxGroup"
      description="Multi-select counterpart of RadioGroup: shared name, fieldset/legend context, the selection as string[], and vertical or horizontal layout."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'name', type: 'string', defaultValue: 'required', description: 'Shared name applied to every checkbox in the group.' },
        { name: 'legend', type: 'string', description: 'Accessible group label rendered as <legend>.' },
        { name: 'value', type: 'string[]', description: 'Currently selected values (controlled).' },
        { name: 'defaultValue', type: 'string[]', description: 'Initial selection (uncontrolled).' },
        { name: 'onValueChange', type: '(value: string[]) => void', description: 'Called with the full selection after a toggle.' },
        { name: 'orientation', type: "'vertical' | 'horizontal'", defaultValue: "'vertical'", description: 'Stack options or lay them out in a wrapping row.' },
        { name: 'error', type: 'string', description: 'Group-level validation message; announced via role=alert.' },
      ]}
      accessibility={[
        'Renders a native fieldset/legend so the group name is announced before each option.',
        'Selection lives in a string[] — perfect for form state, URLs, and API payloads.',
        'Keyboard behavior is the platform’s: Tab reaches the group, Space toggles the focused box.',
      ]}
    >
      <DemoCard
        title="Vertical group (interactive)"
        preview={
          <div className="w-full max-w-lg">
            <CheckboxGroup
              name="langs"
              legend="Languages"
              value={langs}
              onValueChange={setLangs}
              defaultValue={['ts']}
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
        usage={`// Horizontal lays options in a wrapping row — ideal for short
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
// error slot — it renders role=alert next to the legend, one fieldset
// total. For layout grouping of unrelated controls, use Fieldset.`}
      />
    </ComponentPage>
  );
}
