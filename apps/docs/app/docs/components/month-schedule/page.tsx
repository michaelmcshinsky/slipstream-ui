import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/month-schedule', {
  title: 'MonthSchedule',
  description:
    'Month grid that shows dated events inside each day, with a type legend and a small-screen agenda.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('month-schedule')}
      id="month-schedule"
      title="MonthSchedule"
      description="Month grid that shows dated events inside each day, with a type legend and a small-screen agenda."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'events', type: 'T[]', description: 'Events placed inside days via getDate.' },
        { name: 'getDate', type: '(event: T) => string', description: 'ISO date key (YYYY-MM-DD) per event.' },
        { name: 'getLabel', type: '(event: T) => string', description: 'Short label on the day chip and in the agenda.' },
        { name: 'getType', type: '(event: T) => string', description: 'Optional type key for chip color and legend.' },
        { name: 'getHref', type: '(event: T) => string', description: 'Optional destination per event.' },
        { name: 'month', type: 'string', description: 'Controlled month as YYYY-MM; falls back to defaultMonth, then today.' },
        { name: 'defaultMonth', type: 'string', description: 'Uncontrolled initial month (YYYY-MM).' },
        { name: 'onMonthChange', type: '(month: string) => void', description: 'Fired with the new YYYY-MM when paging.' },
        { name: 'today', type: 'string', description: 'Override "today" for deterministic SSR and tests.' },
        { name: 'maxPerDay', type: 'number', defaultValue: '3', description: 'Chips per day before collapsing into "+N more".' },
        { name: 'legend', type: 'MonthScheduleLegendItem[]', description: 'Type → label entries rendered as a legend; fixes chip tones.' },
        { name: 'agendaBreakpoint', type: "'sm' | 'md'", defaultValue: "'md'", description: 'Below this breakpoint an agenda list replaces the grid.' },
        { name: 'linkComponent', type: 'React.ElementType', description: 'Custom link element for event hrefs.' },
        { name: 'linkHrefProp', type: "'href' | 'to'", defaultValue: "'href'", description: 'Prop name used for linkComponent destinations.' },
        { name: 'locale', type: 'string', defaultValue: "'en-US'", description: 'BCP-47 locale for labels.' },
        { name: 'weekStartsOn', type: '0 | 1', defaultValue: '0', description: 'Sunday or Monday first.' },
      ]}
      accessibility={[
        'Day cells use role=grid with rows, columnheaders and gridcells; today gets aria-current="date".',
        'Below agendaBreakpoint a labelled agenda list replaces the grid for small screens.',
        'The month name sits in an aria-live="polite" region so paging is announced.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
