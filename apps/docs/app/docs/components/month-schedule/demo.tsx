'use client';

import { MonthSchedule } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

type DanceEvent = {
  id: string;
  date: string;
  title: string;
  kind: 'competition' | 'workshop' | 'social';
  href: string;
};

const events: DanceEvent[] = [
  { id: '1', date: '2026-03-07', title: 'Winter Showcase', kind: 'competition', href: '/events/winter-showcase' },
  { id: '2', date: '2026-03-14', title: 'Fall Classic', kind: 'competition', href: '/events/fall-classic' },
  { id: '3', date: '2026-03-14', title: 'Open Floor Social', kind: 'social', href: '/events/open-floor' },
  { id: '4', date: '2026-03-21', title: 'Foxtrot Technique', kind: 'workshop', href: '/events/foxtrot-technique' },
  { id: '5', date: '2026-03-21', title: 'Rumba Basics', kind: 'workshop', href: '/events/rumba-basics' },
  { id: '6', date: '2026-03-28', title: 'Spring Social', kind: 'social', href: '/events/spring-social' },
];

const legend = [
  { type: 'competition', label: 'Competition' },
  { type: 'workshop', label: 'Workshop' },
  { type: 'social', label: 'Social' },
];

export default function Demo() {
  return (
    <DemoCard
      title="Event schedule with legend"
      preview={
        <div className="w-full">
          <MonthSchedule
            events={events}
            getDate={(e) => e.date}
            getLabel={(e) => e.title}
            getType={(e) => e.kind}
            getHref={(e) => e.href}
            defaultMonth="2026-03"
            today="2026-03-01"
            legend={legend}
            maxPerDay={2}
          />
        </div>
      }
      code={`<MonthSchedule
  events={competitions}
  getDate={(c) => c.startDate}
  getLabel={(c) => c.name}
  getType={(c) => c.kind}
  getHref={(c) => '/competitions/' + c.slug}
  legend={[
    { type: 'competition', label: 'Competition' },
    { type: 'workshop', label: 'Workshop' },
  ]}
  today={todayKey}
/>`}
      usage={`// Events render as typed chips inside each day. Below the
// agendaBreakpoint (md by default) the grid is replaced by a
// per-day agenda list. maxPerDay collapses extras into "+N more".`}
      types={`type MonthScheduleProps<T> = {
  events: T[];
  getDate: (event: T) => string;      // 'YYYY-MM-DD'
  getLabel: (event: T) => string;
  getType?: (event: T) => string;     // legend/type key
  getHref?: (event: T) => string;
  month?: string;                    // controlled 'YYYY-MM'
  defaultMonth?: string;
  onMonthChange?: (month: string) => void;
  today?: string;                    // pass for SSR determinism
  maxPerDay?: number;                // default 3
  legend?: { type: string; label: string }[];
  agendaBreakpoint?: 'sm' | 'md';    // default 'md'
  linkComponent?: React.ElementType;
  linkHrefProp?: 'href' | 'to';
};`}
    />
  );
}
