import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/checkbox-group', {
  title: 'CheckboxGroup',
  description:
    'Multi-select counterpart of RadioGroup: shared name, fieldset/legend context, selection as string[], vertical or horizontal layout.',
});

export default function Page() {
  return <Demo />;
}
