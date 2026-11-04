'use client';

import { Timeline } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function TimelinePage() {
  return (
    <ComponentPage
      id="timeline"
      title="Timeline"
      description="Vertical chronology for experience, activity and audit trails, built on an ordered list."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'items', type: '{ title: string; period?: string; description?: string; icon?: ReactNode; muted?: boolean }[]', defaultValue: 'required', description: 'Ordered timeline entries.' },
      ]}
      accessibility={['Ordered-list semantics keep the sequence structural.', 'Muted entries dim visually; text content stays unchanged.']}
    >
      <DemoCard
        title="Experience"
        preview={
          <div className="w-full max-w-md">
            <Timeline
              items={[
                { title: 'Senior Engineer', period: '2023 — Present', description: 'Platform team; design system owner.' },
                { title: 'Engineer', period: '2020 — 2023', description: 'Built the scheduling pipeline.' },
                { title: 'Junior Engineer', period: '2018 — 2020', muted: true },
              ]}
            />
          </div>
        }
        code={`<Timeline
  items={[
    { title: 'Senior Engineer', period: '2023 — Present', description: 'Platform team.' },
    { title: 'Engineer', period: '2020 — 2023' },
  ]}
/>`}
        usage={`// Keep the array in chronological order (newest-first is fine) — don't
// reverse with CSS, which would break reading order.`}
        types={`type TimelineItem = {
  title: string;
  period?: string;
  description?: string;
  icon?: React.ReactNode;
  muted?: boolean;
};`}
      />
    </ComponentPage>
  );
}
