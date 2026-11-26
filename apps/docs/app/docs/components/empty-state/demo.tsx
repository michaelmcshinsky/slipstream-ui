'use client';

import { Button, EmptyState } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  return (
    <>
      <DemoCard
        title="Empty collection"
        preview={
          <div className="w-full max-w-xl">
            <EmptyState
              title="No classes yet"
              description="Create your first class to start scheduling students."
              action={<Button>New class</Button>}
              secondaryAction={<Button variant="ghost">Import CSV</Button>}
            />
          </div>
        }
        code={`<EmptyState
  title="No classes yet"
  description="Create your first class to start scheduling students."
  action={<Button>New class</Button>}
  secondaryAction={<Button variant="ghost">Import CSV</Button>}
/>`}
        usage={`// Compact: size="sm" fits inside panels and DataTable empty slots.`}
        types={`type EmptyStateAction = {
  label: React.ReactNode;
  onClick?: () => void;
  href?: string;              // renders an anchor styled as a button
  variant?: ButtonProps['variant'];
};

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode | EmptyStateAction;
  actions?: React.ReactNode;   // alias for action
  secondaryAction?: React.ReactNode;
  titleAs?: 'p' | 'h2' | 'h3' | 'h4';
  size?: 'sm' | 'md';
  align?: 'center' | 'start';
  tone?: 'plain' | 'panel';
  linkComponent?: React.ElementType;
  linkHrefProp?: 'href' | 'to';
};`}
      />
      <DemoCard
        title="Filtered-list panel"
        preview={
          <div className="w-full max-w-xl">
            <EmptyState
              align="start"
              tone="panel"
              title="No matches"
              description="Try widening the filters or clearing them to see more results."
              action={{ label: 'Clear filters', onClick: () => {} }}
              secondaryAction={<a href="/docs">Browse all</a>}
            />
          </div>
        }
        code={`<EmptyState
  align="start"
  tone="panel"
  title="No matches"
  description="Try widening the filters or clearing them."
  action={{ label: 'Clear filters', onClick: reset }}
  secondaryAction={<Link href="/items">Browse all</Link>}
/>`}
        usage={`// align="start" + tone="panel" is the content-page pattern:
// tinted surface, left-aligned copy, several text links or buttons.
// action hrefs honor linkComponent/linkHrefProp for client routers.`}
      />
    </>
  );
}
