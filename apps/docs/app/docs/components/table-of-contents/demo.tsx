'use client';

import { useState } from 'react';
import { TableOfContents, useScrollSpy, type TocHeading } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

const HEADINGS: TocHeading[] = [
  { id: 'toc-demo-install', text: 'Installation', level: 2 },
  { id: 'toc-demo-pnpm', text: 'pnpm', level: 3 },
  { id: 'toc-demo-config', text: 'Configuration', level: 2 },
  { id: 'toc-demo-tokens', text: 'Tokens', level: 3 },
  { id: 'toc-demo-next', text: 'Next steps', level: 2 },
];

const SECTIONS = [
  {
    id: 'toc-demo-install',
    title: 'Installation',
    body: 'Add the package or copy the component source. Every heading in this sample has a matching id, so the links in the table of contents scroll to it and update the URL hash.',
  },
  {
    id: 'toc-demo-pnpm',
    title: 'pnpm',
    body: 'pnpm add @slipstream-ui/core resolves the workspace package and its peer dependencies. The link above is a level-three item, so it is indented in the list.',
  },
  {
    id: 'toc-demo-config',
    title: 'Configuration',
    body: 'Wrap your app in the theme provider, or apply the CSS variable block to :root. The TOC highlights the section you are reading through IntersectionObserver, not click state alone.',
  },
  {
    id: 'toc-demo-tokens',
    title: 'Tokens',
    body: 'Semantic tokens keep light and dark mode consistent: background, foreground, muted, border, and the status inks. Override them with createTheme rather than editing component classes.',
  },
  {
    id: 'toc-demo-next',
    title: 'Next steps',
    body: 'Add scroll-mt-24 to headings when a sticky site header overlaps the target. The TableOfContents component renders real anchors, so deep links, middle-click, and open-in-new-tab all keep working.',
  },
];

export default function TableOfContentsPage() {
  const [lastNavigated, setLastNavigated] = useState<string>();
  const activeId = useScrollSpy(HEADINGS.map((heading) => heading.id));

  return (
    <ComponentPage
      id="table-of-contents"
      title="TableOfContents"
      description="Sticky 'On this page' navigation with real anchor links, nested levels, aria-current, and a useScrollSpy hook for the active heading."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'headings', type: 'TocHeading[]', defaultValue: 'required', description: 'Headings: { id, text, level: 2 | 3 | 4 }.' },
        { name: 'activeId', type: 'string', description: 'Controlled active heading (pair with useScrollSpy).' },
        { name: 'label', type: 'string', defaultValue: "'On this page'", description: 'Accessible name of the nav landmark.' },
        { name: 'ariaLabel', type: 'string', description: 'Landmark name when it differs from the visible label.' },
        { name: 'labelClassName', type: 'string', description: 'Extra classes for the visible label.' },
        { name: 'sticky', type: 'boolean', defaultValue: 'true', description: 'Stick while the article scrolls.' },
        { name: 'onNavigate', type: '(id: string) => void', description: 'Called when a link is activated; the browser still handles the jump.' },
        { name: 'useScrollSpy(ids)', type: 'hook', description: 'Active heading id from scroll position and the URL hash.' },
      ]}
      accessibility={[
        'nav landmark with a label; the active link carries aria-current="location".',
        'Links are native anchors, so Enter, middle-click, and deep links work.',
        'Nested levels are indented; DOM order matches document order.',
        'Add scroll-mt-* to target headings when a sticky header overlaps them.',
      ]}
    >
      <DemoCard
        title="Article TOC (link to a section)"
        preview={
          <div className="grid w-full gap-8 sm:grid-cols-[14rem_1fr]">
            <TableOfContents
              headings={HEADINGS}
              activeId={activeId ?? HEADINGS[0].id}
              onNavigate={setLastNavigated}
              sticky={false}
            />
            <div className="space-y-8 text-sm">
              {SECTIONS.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-24">
                  <h3 className="text-base font-semibold">{section.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{section.body}</p>
                </section>
              ))}
              {lastNavigated && (
                <p className="text-xs text-muted-foreground">
                  onNavigate fired for <code className="font-mono">#{lastNavigated}</code>
                </p>
              )}
            </div>
          </div>
        }
        code={`const ids = headings.map((h) => h.id);
const activeId = useScrollSpy(ids);

<TableOfContents
  headings={headings}
  activeId={activeId}
  onNavigate={setActiveId}
/>

// Each target heading renders with the same id:
<h2 id="installation" className="scroll-mt-24">Installation</h2>`}
        usage={`// The component renders <a href="#id">, so clicking scrolls and updates the
// hash without JavaScript. onNavigate runs in addition to the native jump.
// useScrollSpy follows scroll position (and the hash) to set activeId.
// Give target headings scroll-mt-* when a sticky header overlaps them.`}
        types={`type TableOfContentsProps = {
  headings: { id: string; text: string; level: 2 | 3 | 4 }[];
  activeId?: string;
  label?: string;
  ariaLabel?: string;
  labelClassName?: string;
  sticky?: boolean;
  onNavigate?: (id: string) => void;
};

function useScrollSpy(
  ids: string[],
  options?: { rootMargin?: string }
): string | undefined;`}
      />
    </ComponentPage>
  );
}
