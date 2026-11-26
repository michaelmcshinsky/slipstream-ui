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
};`}
      />
    </>
  );
}
