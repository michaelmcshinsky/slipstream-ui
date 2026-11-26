'use client';

import { Newsletter, Section } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  return (
    <>
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
      <DemoCard
        title="Error state"
        preview={
          <Section tone="muted" padding="lg" className="rounded-lg">
            <Newsletter
              title="Weekly exit insights"
              description="One email a week with guides, market data and owner stories."
              onSubmit={async () => {
                await new Promise((_, reject) => setTimeout(reject, 400));
              }}
              errorMessage="Could not subscribe — try again in a moment."
            />
          </Section>
        }
        code={`<Newsletter
  title="Weekly exit insights"
  onSubmit={async (email) => subscribe(email)}
  errorMessage="Could not subscribe — try again in a moment."
/>`}
        usage={`// When onSubmit rejects, the form shows errorMessage in role="alert"
// and re-enables the field so the visitor can retry.`}
      />
    </>
  );
}
