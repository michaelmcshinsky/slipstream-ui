import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Button } from '@slipstream-ui/core';

export default function CardPage() {
  return (
    <ComponentPage
      id="card"
      title="Card"
      description="Content container with header, body, and footer sections."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'children', type: 'ReactNode', description: 'Card sub-components (CardHeader, CardContent, CardFooter).' },
      ]}
      accessibility={[
        'CardTitle renders as h3; maintain logical heading order in your page.',
      ]}
    >
      <DemoCard
        title="Usage"
        preview={
          <div className="space-y-4">
            <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Form fields here.</p>
          </CardContent>
          <CardFooter>
            <Button size="sm">Save</Button>
          </CardFooter>
        </Card>
          </div>
        }
        code="// See the examples in the props table above"
      />
    </ComponentPage>
  );
}
