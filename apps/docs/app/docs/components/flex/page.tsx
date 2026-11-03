import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'Flex / FlexItem',
  description:
    'Typed flexbox container (direction/align/justify/wrap/gap) with FlexItem for per-child grow/shrink/basis controls.',
};

export default function Page() {
  return <Demo />;
}
