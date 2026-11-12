'use client';

import { Button, PageHeader, documentHead } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function PageHeaderPage() {
  const head = documentHead({
    title: 'Classes',
    description: 'Manage your weekly schedule and enrollment.',
    canonical: 'https://example.com/classes',
  });
  return (
    <ComponentPage
      id="page-header"
      title="PageHeader"
      description="Standard page heading with breadcrumbs, h1, description and actions, plus a router-agnostic documentHead helper for title, description, canonical and robots."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'title', type: 'string', defaultValue: 'required', description: 'Page heading rendered as h1.' },
        { name: 'description', type: 'string', description: 'Supporting summary under the title.' },
        { name: 'subtitle', type: 'string', description: 'Alias for description (migration-friendly).' },
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

      <DemoCard
        title="Document head"
        preview={
          <div className="w-full rounded-xl border border-border p-6">
            <dl className="grid gap-2 text-sm sm:grid-cols-[8rem_1fr]">
              <dt className="text-muted-foreground">title</dt>
              <dd className="font-medium">{head.title}</dd>
              <dt className="text-muted-foreground">description</dt>
              <dd>{head.description}</dd>
              <dt className="text-muted-foreground">canonical</dt>
              <dd className="break-all font-mono text-xs">{head.canonical}</dd>
              <dt className="text-muted-foreground">robots</dt>
              <dd className="font-mono text-xs">{head.robots}</dd>
            </dl>
          </div>
        }
        code={`// Next.js App Router
export function generateMetadata() {
  const head = documentHead({
    title: 'Classes',
    description: 'Manage your weekly schedule and enrollment.',
    canonical: 'https://example.com/classes',
  });
  return {
    title: head.title,
    description: head.description,
    alternates: { canonical: head.canonical },
    robots: head.robots,
  };
}

// Inertia
<Head title={head.title}>
  <meta name="description" content={head.description} />
  <meta name="robots" content={head.robots} />
</Head>

// React Router (head manager)
<meta name="description" content={head.description} />
<link rel="canonical" href={head.canonical} />
<meta name="robots" content={head.robots} />`}
        usage={`// documentHead is a pure descriptor: build it once, then let your router
// adapter render <title>, description, canonical and robots. Add noindex for
// private pages; the helper emits noindex, nofollow.`}
        types={`documentHead(input: {
  title: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
}): {
  title: string;
  description?: string;
  canonical?: string;
  robots: string;
};`}
      />
    </ComponentPage>
  );
}
