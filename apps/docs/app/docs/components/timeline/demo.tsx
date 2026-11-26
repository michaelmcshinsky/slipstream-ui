'use client';

import { Timeline } from '@slipstream-ui/core';
import { ComponentPage, type ComponentPageProps } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function TimelinePage({ manifest }: { manifest?: ComponentPageProps['manifest'] }) {
  return (
    <ComponentPage
        manifest={manifest}
      id="timeline"
      title="Timeline"
      description="Vertical chronology for experience, activity and audit trails, built on an ordered list."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'items[].title', type: 'string', defaultValue: 'required', description: 'Entry heading.' },
        { name: 'items[].period', type: 'string', description: 'Date range or timestamp shown beside the title.' },
        { name: 'items[].description', type: 'string', description: 'Supporting detail under the title.' },
        { name: 'items[].icon', type: 'ReactNode', description: 'Optional marker glyph rendered before the title.' },
        { name: 'items[].muted', type: 'boolean', defaultValue: 'false', description: 'Dims the entry for ended/inactive periods.' },
      ]}
      accessibility={['Ordered-list semantics keep the sequence structural.', 'Muted entries dim visually; text content stays unchanged.']}
    >
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
    </ComponentPage>
  );
}
