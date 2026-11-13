'use client';

import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { BottomNav } from '@slipstream-ui/core';

function Icon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}

const ITEMS = [
  { href: '#', label: 'Home', active: true, icon: <Icon path="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" /> },
  { href: '#', label: 'Search', icon: <Icon path="M21 21l-4.35-4.35M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" /> },
  { href: '#', label: 'Alerts', badge: 3, icon: <Icon path="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" /> },
];

export default function BottomNavPage() {
  return (
    <ComponentPage
      id="bottom-nav"
      title="BottomNav"
      description="Mobile bottom tab bar for the 3-5 primary destinations of an app shell, with an active tab, count badges and safe-area padding."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'items', type: 'BottomNavItem[]', defaultValue: 'required', description: 'Tabs in order: href, label, optional icon, active, badge and disabled.' },
        { name: 'linkComponent', type: 'React.ElementType', description: 'Router link component (Next Link, react-router Link).' },
        { name: 'linkHrefProp', type: "'href' | 'to'", defaultValue: "'href'", description: 'Prop used to pass the destination to linkComponent.' },
        { name: 'label', type: 'string', defaultValue: "'Primary'", description: 'Accessible label for the nav landmark.' },
        { name: 'fixed', type: 'boolean', defaultValue: 'true', description: 'Pin the bar to the bottom edge with safe-area padding.' },
        { name: 'mobileOnly', type: 'boolean', defaultValue: 'true', description: 'Hide the bar from the md breakpoint up.' },
      ]}
      accessibility={[
        'Renders a nav landmark named by label (default "Primary").',
        'Only the active tab carries aria-current="page".',
        'Every tab is at least 56px tall with a 44px minimum target.',
        'env(safe-area-inset-bottom) keeps the bar clear of the iOS home indicator.',
      ]}
    >
      <DemoCard
        title="App shell tabs"
        preview={
          <div className="w-full max-w-sm overflow-hidden rounded-xl border border-border">
            <BottomNav items={ITEMS} fixed={false} mobileOnly={false} />
          </div>
        }
        code={`import { BottomNav } from '@slipstream-ui/core'

<BottomNav
  items={[
    { href: '/', label: 'Home', icon: <HomeIcon />, active: true },
    { href: '/search', label: 'Search', icon: <SearchIcon /> },
    { href: '/alerts', label: 'Alerts', icon: <BellIcon />, badge: 3 },
  ]}
/>`}
        usage={`The default fixed and mobileOnly keep the bar pinned to the bottom on phones only; desktop navigation stays in SiteHeader or Sidebar. The preview above passes fixed={false} mobileOnly={false} so the bar renders inline.`}
      />

      <DemoCard
        title="Disabled tab"
        preview={
          <div className="w-full max-w-sm overflow-hidden rounded-xl border border-border">
            <BottomNav
              fixed={false}
              mobileOnly={false}
              items={[
                { href: '#', label: 'Home', active: true },
                { href: '#', label: 'Reports', disabled: true },
                { href: '#', label: 'Profile' },
              ]}
            />
          </div>
        }
        code={`<BottomNav
  items={[
    { href: '/', label: 'Home', active: true },
    { href: '/reports', label: 'Reports', disabled: true },
    { href: '/profile', label: 'Profile' },
  ]}
/>`}
      />
    </ComponentPage>
  );
}
