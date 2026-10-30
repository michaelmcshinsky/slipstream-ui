import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { Pagination } from '@slipstream-ui/core';

export default function PaginationPage() {
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
      ]}
      accessibility={[
        'nav[aria-label=Pagination] landmark.',
        'Active button has aria-current=page; disabled buttons at boundaries.',
      ]}
    >
      <DemoCard
        title="Usage"
        preview={
          <div className="space-y-4">
            <Pagination page={3} pageCount={10} />
          </div>
        }
        code={"import { Pagination } from '@slipstream-ui/core';\n\nexport default function Example() {\n  return (\n    <>\n      <Pagination page={3} pageCount={10} />\n    </>\n  );\n}"}
        usage={"import { Pagination } from '@slipstream-ui/core';\n\n// Basic usage\n<Pagination />"}
        types={"interface PaginationProps {\n  page: number;\n  pageCount: number;\n  onPageChange: (page: number) => void;\n  siblings: number;\n}"}
      />
    </ComponentPage>
  );
}
