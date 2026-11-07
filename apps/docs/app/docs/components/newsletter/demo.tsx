'use client';

import { Newsletter, Section } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function NewsletterPage() {
  return (
    <ComponentPage
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
      <DemoCard
        title="Weekly insights"
        preview={
          <Section tone="muted" padding="lg" className="rounded-lg">
            <Newsletter
              title="Weekly exit insights"
              description="One email a week with guides, market data and owner stories."
              consent="By subscribing you agree to the privacy policy."
              onSubmit={async () => {
                await new Promise((resolve) => setTimeout(resolve, 600));
              }}
            />
          </Section>
        }
        code={`<Section tone="muted">
  <Newsletter
    title="Weekly exit insights"
    description="One email a week with guides, market data and owner stories."
    consent="By subscribing you agree to the privacy policy."
    onSubmit={async (email) => subscribe(email)}
  />
</Section>`}
        usage={`// Newsletter owns the field, pending state and feedback.
// The caller owns the CRM, double opt-in and error mapping.`}
        types={`type NewsletterProps = {
  title: string;
  description?: string;
  placeholder?: string;
  buttonLabel?: string;
  label?: string;
  successMessage?: string;
  errorMessage?: string;
  consent?: React.ReactNode;
  onSubmit?: (email: string) => void | Promise<void>;
  layout?: 'inline' | 'stacked';
  level?: 2 | 3;
};`}
      />
    </ComponentPage>
  );
}
