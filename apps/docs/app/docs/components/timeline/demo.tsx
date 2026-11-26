'use client';

import { Timeline } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  return (
    <>
      <DemoCard
        title="Experience"
        preview={
          <div className="w-full max-w-md">
            <Timeline
              items={[
                { title: 'Senior Engineer', period: '2023 — Present', description: 'Platform team; design system owner.', icon: <span aria-hidden className="text-xs">&#10003;</span> },
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
        usage={`// Keep the array in chronological order (newest-first is fine): don't
// reverse with CSS, which would break reading order.`}
        types={`type TimelineItem = {
  title: string;
  period?: string;
  description?: string;
  icon?: React.ReactNode;
  muted?: boolean;
};`}
      />
    </>
  );
}
