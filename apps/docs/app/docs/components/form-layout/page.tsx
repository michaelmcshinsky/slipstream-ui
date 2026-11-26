import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/form-layout', {
  title: 'FormLayout',
  description:
    'Groups form fields with even, tokenized spacing: vertical stack, horizontal row, or 1-4 column grid, optionally as a semantic fieldset.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('form-layout')}
      id="form-layout"
      title="FormLayout"
      description="Groups form fields with even, tokenized spacing: vertical stack, horizontal row, or 1-4 column grid, optionally as a semantic fieldset."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'layout', type: "'stack' | 'row' | 'grid'", defaultValue: "'stack'", description: 'Even vertical stack, horizontal row, or column grid.' },
        { name: 'columns', type: '1 | 2 | 3 | 4', defaultValue: '2', description: 'Grid column count (literal classes survive CSS purging). Only applies when layout="grid"; ignored for stack/row.' },
        { name: 'gap', type: "'none' | 'sm' | 'md' | 'lg' | 'xl' | number", description: 'Even spacing: token or exact pixels (16).' },
        { name: 'legend', type: 'string', description: 'Group label rendered as a semantic <legend> (fieldset mode).' },
        { name: 'description', type: 'string', description: 'Supporting line under the legend (fieldset mode).' },
        { name: 'as', type: "'div' | 'fieldset'", defaultValue: "'div'", description: 'Render as a semantic fieldset when the layout wraps related controls.' },
      ]}
      accessibility={[
        'Fieldset mode gives the group a name via a real <legend>.',
        'Reading order equals DOM order: row/grid layouts reflow visually only.',
        'Space fields with gap tokens: never spacer divs that drift from the scale.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
