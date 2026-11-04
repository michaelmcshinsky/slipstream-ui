'use client';

import { useState } from 'react';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { Pagination } from '@slipstream-ui/core';

export default function PaginationPage() {
  const [page, setPage] = useState(3);

  return (
    <ComponentPage
      id="pagination"
      title="Pagination"
      description="Numeric pagination with prev/next, ellipsis, and aria-current on the active page."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'page', type: 'number', defaultValue: '1', description: 'Current page (1-based). Alias: currentPage.' },
        { name: 'pageCount', type: 'number', description: 'Total pages. Alias: totalPages, or derived from total/pageSize.' },
        { name: 'currentPage / totalPages', type: 'number', description: 'Migration-friendly aliases for page / pageCount.' },
        { name: 'pageSize + total', type: 'number', description: 'Derives pageCount and renders "Showing 26–50 of 312 students".' },
        { name: 'itemLabel', type: 'string', defaultValue: "'items'", description: 'Noun used in the summary.' },
        { name: 'showSummary', type: 'boolean', description: 'Force the summary on/off (default: on when total and pageSize are set).' },
        { name: 'onPageChange', type: '(page: number) => void', description: 'Called with the new page number.' },
        { name: 'siblings', type: 'number', defaultValue: '1', description: 'How many page buttons to show around the current page.' },
        { name: 'showBoundaries', type: 'boolean', defaultValue: 'false', description: 'Adds « and » buttons that jump to the first/last page.' },
        { name: 'showFirst / showLast', type: 'boolean', defaultValue: 'showBoundaries', description: 'Show or hide each boundary button independently (e.g. hide « once you are on page 1 instead of disabling it).' },
        { name: 'icons', type: '{ first?, previous?, next?, last? }', description: 'Replace the default ‹ › « » glyphs with your own markup.' },
      ]}
      accessibility={[
        'nav[aria-label=Pagination] landmark.',
        'Active button has aria-current=page; disabled buttons at boundaries.',
        'Boundary buttons expose First page / Last page labels.',
      ]}
    >
      <DemoCard
        title="Interactive"
        preview={
          <div className="w-full space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">showBoundaries — « jumps to page 1, » to page 10</span>
              <span className="font-mono text-xs text-muted-foreground">page {page} / 10</span>
            </div>
            <Pagination page={page} pageCount={10} onPageChange={setPage} showBoundaries />
            <div className="border-t border-border pt-4 text-xs text-muted-foreground">
              Custom glyphs + first-only boundary (showFirst, icons)
            </div>
            <Pagination
              page={page}
              pageCount={10}
              onPageChange={setPage}
              showFirst
              icons={{ previous: '←', next: '→', first: '⏮' }}
            />
            <div className="border-t border-border pt-4 text-xs text-muted-foreground">
              Default rendering (no boundary buttons)
            </div>
            <Pagination page={page} pageCount={10} onPageChange={setPage} />
          </div>
        }
        code={"import { Pagination } from '@slipstream-ui/core';\n\nexport default function Example() {\n  const [page, setPage] = useState(1);\n  return (\n    <>\n      {/* With first/last jump buttons */}\n      <Pagination page={page} pageCount={10} onPageChange={setPage} showBoundaries />\n\n      {/* Independent boundaries + custom glyphs */}\n      <Pagination\n        page={page}\n        pageCount={10}\n        onPageChange={setPage}\n        showFirst\n        icons={{ previous: '←', next: '→', first: '⏮' }}\n      />\n\n      {/* Default: prev/next only */}\n      <Pagination page={page} pageCount={10} onPageChange={setPage} />\n    </>\n  );\n}"}
        usage={"import { Pagination } from '@slipstream-ui/core';\n\n<Pagination page={3} pageCount={10} onPageChange={setPage} showBoundaries />\n\n// Hide « once the user is already on the first page, swap arrows\n<Pagination\n  page={page}\n  pageCount={10}\n  onPageChange={setPage}\n  showFirst={page > 1}\n  showLast={page < 10}\n  icons={{ previous: '←', next: '→' }}\n/>"}
        types={"type PaginationProps = {\n  page: number;\n  pageCount: number;\n  onPageChange?: (page: number) => void;\n  siblings?: number;\n  showBoundaries?: boolean;\n  showFirst?: boolean;\n  showLast?: boolean;\n  icons?: { first?: ReactNode; previous?: ReactNode; next?: ReactNode; last?: ReactNode };\n}"}
      />
      <DemoCard
        title="Summary with derived pages"
        preview={
          <div className="w-full max-w-2xl">
            <Pagination page={2} pageSize={25} total={312} itemLabel="students" onPageChange={() => undefined} />
          </div>
        }
        code={`<Pagination
  page={page}
  pageSize={25}
  total={312}
  itemLabel="students"
  onPageChange={setPage}
/>`}
        usage={`// total + pageSize derive the page count and add the item summary.
// currentPage/totalPages are accepted as aliases for page/pageCount.`}
      />
    </ComponentPage>
  );
}
