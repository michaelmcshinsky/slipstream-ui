'use client';

import { AnnouncementBar } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  return (
    <>
      <DemoCard
        title="Announcement bar"
        preview={
          <div className="w-full overflow-hidden rounded-lg border border-border">
            <AnnouncementBar
              message="The 2026 Middle Market Review is live"
              href="/articles"
              actionLabel="Read it"
              tone="brand"
            />
            <div className="p-6 text-sm text-muted-foreground">Page content below the announcement.</div>
          </div>
        }
        code={`<AnnouncementBar
  message="The 2026 Middle Market Review is live"
  href="/articles"
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
      <DemoCard
        title="Sticky and persistent variants"
        preview={
          <div className="w-full space-y-4">
            <AnnouncementBar
              message="Sticky launch banner"
              href="/changelog"
              actionLabel="See what is new"
              tone="inverse"
              sticky={false}
            />
            <AnnouncementBar
              message="Maintenance Sunday 02:00 UTC"
              tone="muted"
              dismissible={false}
            />
          </div>
        }
        code={`{/* sticky pins the bar to the viewport top while scrolling */}
<AnnouncementBar message="…" sticky tone="brand" />

{/* dismissible={false} renders no close control — use for critical notices;
    persistence is caller-owned either way (see onDismiss). */}
<AnnouncementBar message="Maintenance Sunday 02:00 UTC" dismissible={false} />`}
        usage={`// sticky uses position: sticky inside the normal flow — mount it
// above your header. dismissible={false} is for notices users must not
// miss; pair with onDismiss-free rendering.`}
      />
    </>
  );
}
