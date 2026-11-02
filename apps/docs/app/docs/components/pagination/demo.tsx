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
        { name: 'page', type: 'number', description: 'Current page number (1-based).' },
        { name: 'pageCount', type: 'number', description: 'Total number of pages.' },
        { name: 'onPageChange', type: '(page: number) => void', description: 'Called with the new page number.' },
        { name: 'siblings', type: 'number', defaultValue: '1', description: 'How many page buttons to show around the current page.' },
        { name: 'showBoundaries', type: 'boolean', defaultValue: 'false', description: 'Adds « and » buttons that jump to the first/last page.' },
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
              Default rendering (no boundary buttons)
            </div>
            <Pagination page={page} pageCount={10} onPageChange={setPage} />
          </div>
        }
        code={"import { Pagination } from '@slipstream-ui/core';\n\nexport default function Example() {\n  const [page, setPage] = useState(1);\n  return (\n    <>\n      {/* With first/last jump buttons */}\n      <Pagination page={page} pageCount={10} onPageChange={setPage} showBoundaries />\n      {/* Default: prev/next only */}\n      <Pagination page={page} pageCount={10} onPageChange={setPage} />\n    </>\n  );\n}"}
        usage={"import { Pagination } from '@slipstream-ui/core';\n\n<Pagination page={3} pageCount={10} onPageChange={setPage} showBoundaries />"}
        types={"interface PaginationProps {\n  page: number;\n  pageCount: number;\n  onPageChange?: (page: number) => void;\n  siblings?: number;\n  showBoundaries?: boolean;\n}"}
      />
    </ComponentPage>
  );
}
