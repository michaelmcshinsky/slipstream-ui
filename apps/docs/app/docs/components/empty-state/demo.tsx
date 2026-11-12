'use client';

import { Button, EmptyState } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function EmptyStatePage() {
  return (
    <ComponentPage
      id="empty-state"
      title="EmptyState"
      description="Placeholder for empty collections, zero-result searches and unconfigured features — title, description and action slots."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'title', type: 'string', defaultValue: 'required', description: 'Primary message.' },
        { name: 'description', type: 'string', description: 'Supporting line explaining the next step.' },
        { name: 'icon', type: 'ReactNode', description: 'Decorative icon above the title.' },
        { name: 'action', type: 'ReactNode | EmptyStateAction', description: 'Primary action as a rendered node, or { label, onClick?, href?, variant? } to have the button/link rendered for you.' },
        { name: 'secondaryAction', type: 'ReactNode', description: 'Secondary action beside the primary one.' },
        { name: 'size', type: "'sm' | 'md'", defaultValue: "'md'", description: 'Compact padding for panels and table bodies.' },
      ]}
      accessibility={['Actions are real controls, so they stay focusable and announced.', 'Use Alert for failures — empty is a normal state, not an error.']}
    >
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
        types={`type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  size?: 'sm' | 'md';
};`}
      />
    </ComponentPage>
  );
}
