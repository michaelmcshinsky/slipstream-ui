'use client';

import { Button, PageHeader } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function PageHeaderPage() {
  return (
    <ComponentPage
      id="page-header"
      title="PageHeader"
      description="Standard page heading: optional breadcrumbs, level-1 title, description, right-aligned actions and a sub-row slot."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'title', type: 'string', defaultValue: 'required', description: 'Page heading rendered as h1.' },
        { name: 'description', type: 'string', description: 'Supporting summary under the title.' },
        { name: 'breadcrumbs', type: 'ReactNode', description: 'Trail rendered above the title.' },
        { name: 'actions', type: 'ReactNode', description: 'Right-aligned actions (buttons, menus).' },
        { name: 'children', type: 'ReactNode', description: 'Sub-row under the title (tabs, filters).' },
      ]}
      accessibility={['Renders exactly one h1 per page.', 'Use Heading level={2} for section headings below the header.']}
    >
      <DemoCard
        title="List page header"
        preview={
          <div className="w-full rounded-xl border border-border p-6">
            <PageHeader
              title="Classes"
              description="Manage your weekly schedule and enrollment."
              breadcrumbs={<span>Studio / Classes</span>}
              actions={
                <>
                  <Button variant="outline">Export</Button>
                  <Button>New class</Button>
                </>
              }
            >
              <div className="flex gap-2 text-sm text-muted-foreground">
                <span className="rounded-md bg-muted px-2 py-1">Active 12</span>
                <span className="rounded-md bg-muted px-2 py-1">Archived 3</span>
              </div>
            </PageHeader>
          </div>
        }
        code={`<PageHeader
  title="Classes"
  description="Manage your weekly schedule and enrollment."
  breadcrumbs={<span>Studio / Classes</span>}
  actions={<><Button variant="outline">Export</Button><Button>New class</Button></>}
>
  <Tabs … />
</PageHeader>`}
        usage={`// One PageHeader per page: it owns the h1. Sections below use Heading level={2}.`}
        types={`type PageHeaderProps = {
  title: string;
  description?: string;
  breadcrumbs?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
};`}
      />
    </ComponentPage>
  );
}
