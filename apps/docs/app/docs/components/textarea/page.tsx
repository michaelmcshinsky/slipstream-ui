import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/textarea', {
  title: "Textarea",
  description: "Multi-line text input styled to match Input.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('textarea')}
      id="textarea"
      title="Textarea"
      description="Multi-line text input styled to match Input."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'value', type: 'string', description: 'Controlled value; omit for uncontrolled usage.' },
        { name: 'defaultValue', type: 'string', description: 'Initial value for uncontrolled usage.' },
        { name: 'placeholder', type: 'string', description: 'Placeholder text shown when empty.' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the textarea.' },
        { name: 'onChange', type: 'React.ChangeEventHandler<HTMLTextAreaElement>', description: 'Native change handler for controlled or uncontrolled updates.' },
      ]}
      accessibility={[
        'Native textarea semantics: multiline text entry and form validation work natively.',
        'Provide an accessible name via Label or aria-label.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
