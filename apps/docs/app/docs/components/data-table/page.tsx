import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'DataTable',
  description:
    'Config-driven table: one component plus a columns config that owns shape, sorting, pagination, and row interaction.',
};

export default function Page() {
  return <Demo />;
}
