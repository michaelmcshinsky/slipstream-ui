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
      ]}
    >
      <DemoCard
        title="Usage"
        preview={
          <div className="space-y-4">
            <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
        </Alert>
          </div>
        }
        code={"import { Alert, AlertDescription, AlertTitle } from '@slipstream-ui/core';\n\nexport default function Example() {\n  return (\n    <>\n      <Alert variant=\"destructive\">\n          <AlertTitle>Error</AlertTitle>\n          <AlertDescription>Your session has expired. Please log in again.</AlertDescription>\n        </Alert>\n    </>\n  );\n}"}
        usage={"import { Alert } from '@slipstream-ui/core';\n\n// Basic usage\n<Alert />"}
        types={"interface AlertProps {\n  variant: 'default' | 'destructive' | 'success' | 'warning' | 'info';\n  children: ReactNode;\n}"}
      />
    </ComponentPage>
  );
}
