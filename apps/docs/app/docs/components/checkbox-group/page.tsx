import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/checkbox-group', {
  title: 'CheckboxGroup',
  description:
    'Multi-select counterpart of RadioGroup: shared name, fieldset/legend context, selection as string[], vertical or horizontal layout.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('checkbox')}
      id="checkbox-group"
      manifestId="checkbox"
      title="CheckboxGroup"
      description="Multi-select counterpart of RadioGroup: shared name, fieldset/legend context, the selection as string[], and vertical or horizontal layout."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'name', type: 'string', defaultValue: 'required', description: 'Shared name applied to every checkbox in the group.' },
        { name: 'legend', type: 'string', description: 'Accessible group label rendered as <legend>.' },
        { name: 'value', type: 'string[]', description: 'Currently selected values (controlled).' },
        { name: 'defaultValue', type: 'string[]', description: 'Initial selection (uncontrolled).' },
        { name: 'onValueChange', type: '(value: string[]) => void', description: 'Called with the full selection after a toggle.' },
        { name: 'orientation', type: "'vertical' | 'horizontal'", defaultValue: "'vertical'", description: 'Stack options or lay them out in a wrapping row.' },
        { name: 'error', type: 'string', description: 'Group-level validation message; announced via role=alert.' },
      ]}
      accessibility={[
        'Renders a native fieldset/legend so the group name is announced before each option.',
        'Selection lives in a string[]: perfect for form state, URLs, and API payloads.',
        'Keyboard behavior is the platform’s: Tab reaches the group, Space toggles the focused box.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
