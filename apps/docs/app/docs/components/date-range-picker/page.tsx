import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'DateRangePicker',
  description: 'Start/end date range with ISO strings and quick presets.',
};

export default function Page() {
  return <Demo />;
}
