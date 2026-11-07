'use client';

import { AnnouncementBar } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function AnnouncementBarPage() {
  return (
    <ComponentPage
      id="announcement-bar"
      title="AnnouncementBar"
      description="Dismissible announcement bar with optional action, tone and sticky positioning."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'message', type: 'ReactNode', defaultValue: 'required', description: 'Message shown in the bar.' },
        { name: 'href', type: 'string', description: 'Optional destination for the action.' },
        { name: 'actionLabel', type: 'string', description: 'Action text, shown when href is provided.' },
        { name: 'dismissible', type: 'boolean', defaultValue: 'true', description: 'Show a close control.' },
        { name: 'onDismiss', type: '() => void', description: 'Called after dismissal.' },
        { name: 'tone', type: "'muted' | 'brand' | 'inverse'", defaultValue: "'muted'", description: 'Surface treatment.' },
        { name: 'sticky', type: 'boolean', defaultValue: 'false', description: 'Pin the bar to the top.' },
        { name: 'linkComponent', type: 'React.ElementType', description: 'Custom link element for routers.' },
      ]}
      accessibility={[
        'Renders a named region (Announcement) with a keyboard-operable dismiss button.',
        'The caller owns persistence and dismissal policy.',
      ]}
    >
      <DemoCard
        title="Announcement bar"
        preview={
          <div className="w-full overflow-hidden rounded-lg border border-border">
            <AnnouncementBar
              message="The 2026 Middle Market Review is live"
              href="/forum"
              actionLabel="Read it"
              tone="brand"
            />
            <div className="p-6 text-sm text-muted-foreground">Page content below the announcement.</div>
          </div>
        }
        code={`<AnnouncementBar
  message="The 2026 Middle Market Review is live"
  href="/forum"
  actionLabel="Read it"
  tone="brand"
/>`}
        usage={`// One bar per page, above the header.
// tone: muted | brand | inverse; sticky pins it to the viewport.`}
        types={`type AnnouncementBarProps = {
  message: React.ReactNode;
  href?: string;
  actionLabel?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  tone?: 'muted' | 'brand' | 'inverse';
  sticky?: boolean;
  linkComponent?: React.ElementType;
};`}
      />
    </ComponentPage>
  );
}
