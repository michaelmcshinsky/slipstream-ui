'use client';

import { useState } from 'react';
import { DemoCard } from '@/components/demo-card';
import { Badge, List, ListItem } from '@slipstream-ui/core';

const THREADS = [
  { id: 't1', title: 'Release notes draft', meta: '2m' },
  { id: 't2', title: 'RAG citation UX', meta: '1h' },
  { id: 't3', title: 'Refactor: prompt input', meta: '3h' },
  { id: 't4', title: 'Archived: onboarding flow', meta: '2d' },
];

export default function Demo() {
  const [activeId, setActiveId] = useState('t1');

  return (
    <>
      <DemoCard
        title="Pressable rows (interactive)"
        preview={
          <div className="w-full max-w-md">
            <List bordered divided>
              {THREADS.map((thread) => (
                <ListItem
                  key={thread.id}
                  selected={thread.id === activeId}
                  onClick={() => setActiveId(thread.id)}
                  trailing={<span className="font-mono">{thread.meta}</span>}
                >
                  {thread.title}
                </ListItem>
              ))}
            </List>
            <p className="mt-2 text-xs text-muted-foreground" role="status">
              Active thread: {THREADS.find((t) => t.id === activeId)?.title}
            </p>
          </div>
        }
        code={`import { List, ListItem } from '@slipstream-ui/core';

{/* onClick renders the row content inside a <button>.
    List semantics and keyboard behavior come free */}
<List bordered divided>
  {threads.map((t) => (
    <ListItem
      key={t.id}
      selected={t.id === activeId}
      onClick={() => setActiveId(t.id)}
      trailing={<span className="font-mono">{t.meta}</span>}
    >
      {t.title}
    </ListItem>
  ))}
</List>`}
      />

      <DemoCard
        title="Slots and descriptions"
        preview={
          <div className="w-full max-w-md">
            <List bordered divided>
              <ListItem
                leading={<Badge>NEW</Badge>}
                description="Pushes main to production on merge"
                trailing={<span className="text-xs text-muted-foreground">Admin</span>}
              >
                Deploy pipeline
              </ListItem>
              <ListItem
                leading={<Badge variant="outline">API</Badge>}
                description="3 endpoints registered"
                selected
              >
                Webhooks
              </ListItem>
              <ListItem trailing={<span aria-hidden="true">→</span>} disabled>
                Disabled row
              </ListItem>
            </List>
          </div>
        }
        code={`import { Badge, List, ListItem } from '@slipstream-ui/core';

<List bordered divided>
  <ListItem
    leading={<Badge>NEW</Badge>}
    trailing={<span className="text-xs text-muted-foreground">Admin</span>}
  >
    Deploy pipeline
    <span className="block text-xs text-muted-foreground">
      Pushes main to production on merge
    </span>
  </ListItem>
  <ListItem leading={<Badge variant="outline">API</Badge>} selected>…</ListItem>
  <ListItem disabled>…</ListItem>
</List>`}
        usage={`import { List, ListItem } from '@slipstream-ui/core';

// Static group (no onClick)
<List bordered>
  <ListItem leading={<Dot />} trailing={<Badge>3</Badge>}>Inbox</ListItem>
  <ListItem leading={<Dot />}>Archive</ListItem>
</List>`}
        types={`type ListProps = {
  divided?: boolean;
  bordered?: boolean;
  size?: 'default' | 'compact';
};

type ListItemProps = {
  leading?: ReactNode;
  trailing?: ReactNode;
  selected?: boolean;
  description?: React.ReactNode; // accepts rich meta (badges, dots)
  onClick?: () => void;
};`}
      />
    </>
  );
}
