import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'List / ListItem',
  description:
    'Semantic list (ul/li) for rows of related items: settings, results, nav — with slots, selection, and pressable rows.',
};

export default function Page() {
  return <Demo />;
}
