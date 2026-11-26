import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/password-input', {
  title: 'PasswordInput',
  description:
    'Password field with an accessible show/hide toggle (aria-pressed), built on Input.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('password-input')}
      id="password-input"
      title="PasswordInput"
      description="Password field with an accessible show/hide toggle (aria-pressed), built on Input."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'showLabel', type: 'string', defaultValue: "'Show password'", description: 'Accessible label while hidden.' },
        { name: 'hideLabel', type: 'string', defaultValue: "'Hide password'", description: 'Accessible label while visible.' },
        { name: '…InputProps', type: 'InputProps', description: 'All Input props pass through (value, onChange, autoComplete…).' },
      ]}
      browserNotes={['className lands on the wrapper div (for layout/width), not the <input>; the inner input keeps its own classes.']}
      accessibility={['The toggle is a real button with aria-pressed and Show/Hide labels.', 'Revealing never moves focus away from the field.']}
    >
      <Demo />
    </ComponentPage>
  );
}
