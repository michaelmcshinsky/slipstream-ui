import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'SelectMenu',
  description: 'Custom listbox select for rich options: descriptions, icons, groups and multi-select.',
};

export default function Page() {
  return <Demo />;
}
