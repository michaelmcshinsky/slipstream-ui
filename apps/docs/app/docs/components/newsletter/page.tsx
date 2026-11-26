import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/newsletter', {
  title: 'Newsletter',
  description: 'Email capture block with inline or stacked layout, pending state, success and failure feedback.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('newsletter')}
      id="newsletter"
      title="Newsletter"
      description="Email capture block with inline or stacked layout, pending state, success and failure feedback."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'title', type: 'string', defaultValue: 'required', description: 'Headline for the signup block.' },
        { name: 'description', type: 'string', description: 'Supporting copy.' },
        { name: 'placeholder', type: 'string', defaultValue: "'you@example.com'", description: 'Email placeholder.' },
        { name: 'buttonLabel', type: 'string', defaultValue: "'Subscribe'", description: 'Submit button label.' },
        { name: 'label', type: 'string', defaultValue: "'Email address'", description: 'Visible or screen-reader label for the email field.' },
        { name: 'successMessage', type: 'string', description: 'Success message.' },
        { name: 'errorMessage', type: 'string', description: 'Failure message when onSubmit rejects.' },
        { name: 'consent', type: 'ReactNode', description: 'Consent or privacy copy.' },
        { name: 'onSubmit', type: '(email: string) => void | Promise<void>', description: 'Submit handler; owns the CRM and double opt-in.' },
        { name: 'layout', type: "'inline' | 'stacked'", defaultValue: "'inline'", description: 'Inline on desktop or always stacked.' },
        { name: 'level', type: '2 | 3', defaultValue: '2', description: 'Heading level.' },
      ]}
      accessibility={[
        'The email field has an associated label, visible to screen readers.',
        'Success uses aria-live polite; errors use role alert.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
