'use client';

import { useState } from 'react';
import { TableOfContents, type TocHeading } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

const HEADINGS: TocHeading[] = [
  { id: 'install', text: 'Installation', level: 2 },
  { id: 'pnpm', text: 'pnpm', level: 3 },
  { id: 'config', text: 'Configuration', level: 2 },
  { id: 'tokens', text: 'Tokens', level: 3 },
  { id: 'next', text: 'Next steps', level: 2 },
];

export default function TableOfContentsPage() {
  const [activeId, setActiveId] = useState('config');
  return (
    <ComponentPage
      id="table-of-contents"
      title="TableOfContents"
      description="Sticky 'On this page' navigation with nested levels and aria-current, plus a useScrollSpy hook for the active heading."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'headings', type: 'TocHeading[]', defaultValue: 'required', description: 'Headings: { id, text, level: 2 | 3 | 4 }.' },
        { name: 'activeId', type: 'string', description: 'Controlled active heading (pair with useScrollSpy).' },
        { name: 'label', type: 'string', defaultValue: "'On this page'", description: 'Accessible name of the nav landmark.' },
        { name: 'sticky', type: 'boolean', defaultValue: 'true', description: 'Stick while the article scrolls.' },
        { name: 'useScrollSpy(ids)', type: 'hook', description: 'Active heading id from scroll position (IntersectionObserver).' },
      ]}
      accessibility={['nav landmark with a label; the active link carries aria-current="location".', 'Nested levels are indented; DOM order matches document order.']}
    >
      <DemoCard
        title="Article TOC (interactive)"
        preview={
          <div className="grid w-full gap-6 sm:grid-cols-[14rem_1fr]">
            <TableOfContents headings={HEADINGS} activeId={activeId} />
            <div className="space-y-2 text-sm text-muted-foreground">
              {HEADINGS.map((heading) => (
                <button key={heading.id} type="button" onClick={() => setActiveId(heading.id)} className="block rounded-md border border-border px-3 py-2 text-left hover:bg-accent">
                  Highlight: <code className="text-foreground">{heading.text}</code>
                </button>
              ))}
            </div>
          </div>
        }
        code={`const activeId = useScrollSpy(headings.map((h) => h.id));

<TableOfContents headings={headings} activeId={activeId} />`}
        usage={`// useScrollSpy observes heading ids; generate ids in your markdown pipeline.`}
        types={`type TableOfContentsProps = {
  headings: { id: string; text: string; level: 2 | 3 | 4 }[];
  activeId?: string;
  label?: string;
  sticky?: boolean;
};`}
      />
    </ComponentPage>
  );
}
