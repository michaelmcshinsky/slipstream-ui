import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'ThemeToggle',
  description: 'Presentational light/dark toggle with accessible labels and sun/moon state.',
};

export default function Page() {
  return <Demo />;
}
