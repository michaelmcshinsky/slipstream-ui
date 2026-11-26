'use client';

import { useState } from 'react';
import { DemoCard } from '@/components/demo-card';
import { Pagination } from '@slipstream-ui/core';

const pageHrefsExample = Object.fromEntries(
  Array.from({ length: 6 }, (_, i) => [i + 1, `/docs?page=${i + 1}`])
);

export default function Demo() {
  const [page, setPage] = useState(3);

  return (
    <>
      <DemoCard
        title="Interactive"
        preview={
          <div className="w-full space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">showBoundaries: « jumps to page 1, » to page 10</span>
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

      <DemoCard
        title="Server-rendered links"
        preview={
          <Pagination
            page={3}
            pageCount={6}
            pageHrefs={pageHrefsExample}
            linkComponent={({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
              <a href={href} {...rest}>{children}</a>
            )}
          />
        }
        code={`const pageHrefs = Object.fromEntries(
  Array.from({ length: 6 }, (_, i) => [i + 1, \`/docs?page=\${i + 1}\`])
);

<Pagination
  page={3}
  pageCount={6}
  pageHrefs={pageHrefs}
  linkComponent={RouterLink}   // receives href by default; 'to' via linkHrefProp
/>`}
        usage={`// pageHrefs turns each page button into a real link for SSR/SEO.
// Pair with linkComponent + linkHrefProp="to" for react-router.`}
      />
    </>
  );
}
