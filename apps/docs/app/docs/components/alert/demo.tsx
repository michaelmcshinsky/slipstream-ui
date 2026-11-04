import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { Alert, AlertDescription, AlertTitle } from '@slipstream-ui/core';

export default function AlertPage() {
  return (
    <ComponentPage
      id="alert"
      title="Alert"
      description="Inline alert for status messages with semantic variants."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'variant', type: "'default' | 'destructive' | 'success' | 'warning' | 'info'", defaultValue: "'default'", description: 'Semantic style variant.' },
        { name: 'children', type: 'ReactNode', description: 'Alert content (AlertTitle and AlertDescription).' },
      ]}
      accessibility={[
        'role=alert announces the content when it appears.',
        'AlertTitle renders as h5; maintain logical heading order.',
        'Every semantic variant meets WCAG AA text contrast in light and dark modes.',
      ]}
    >
      <DemoCard
        title="All variants"
        preview={
          <div className="w-full space-y-3">
            <Alert>
              <AlertTitle>Heads up</AlertTitle>
              <AlertDescription>Neutral information — the default variant.</AlertDescription>
            </Alert>
            <Alert variant="info">
              <AlertTitle>New: validate_usage</AlertTitle>
              <AlertDescription>Your agent can now check JSX against manifests before emitting.</AlertDescription>
            </Alert>
            <Alert variant="success">
              <AlertTitle>Deployed</AlertTitle>
              <AlertDescription>42 pages published to production in 6.2s.</AlertDescription>
            </Alert>
            <Alert variant="warning">
              <AlertTitle>Token expires soon</AlertTitle>
              <AlertDescription>Your API key rotates in 7 days — update your agents.</AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
            </Alert>
          </div>
        }
        code={`import { Alert, AlertDescription, AlertTitle } from '@slipstream-ui/core';

<Alert>
  <AlertTitle>Heads up</AlertTitle>
  <AlertDescription>Neutral information — the default variant.</AlertDescription>
</Alert>
<Alert variant="info">…</Alert>
<Alert variant="success">…</Alert>
<Alert variant="warning">…</Alert>
<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
</Alert>`}
      />

      <DemoCard
        title="Title-only and description-only"
        preview={
          <div className="w-full space-y-3">
            <Alert variant="warning">
              <AlertTitle>Maintenance window</AlertTitle>
            </Alert>
            <Alert variant="info">
              <AlertDescription>Single-line notices work without a title.</AlertDescription>
            </Alert>
          </div>
        }
        code={`<Alert variant="warning">
  <AlertTitle>Maintenance window</AlertTitle>
</Alert>

<Alert variant="info">
  <AlertDescription>Single-line notices work without a title.</AlertDescription>
</Alert>`}
        usage={`import { Alert } from '@slipstream-ui/core';

// role="alert" is built in — the content is announced when it mounts
<Alert variant="destructive">Payment failed. Try again.</Alert>`}
        types={`type AlertProps = {
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  children?: ReactNode;
};`}
      />
    </ComponentPage>
  );
}
