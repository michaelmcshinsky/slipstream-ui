import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@slipstream-ui/core';

export default function TablePage() {
  return (
    <ComponentPage
      id="table"
      title="Table"
      description="Semantic data table with headers, body, footer, and accessible caption."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'children', type: 'ReactNode', description: 'TableHeader, TableBody, TableFooter, and TableCaption children.' },
      ]}
      accessibility={[
        'Native table semantics with scope attributes on headers.',
        'TableCaption describes the table contents for screen readers.',
      ]}
    >
      <DemoCard
        title="Usage"
        preview={
          <div className="space-y-4">
            <Table className="max-w-md">
          <TableCaption>Monthly revenue</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Month</TableHead>
              <TableHead scope="col">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow><TableCell>January</TableCell><TableCell>$1,200</TableCell></TableRow>
            <TableRow><TableCell>February</TableCell><TableCell>$1,450</TableCell></TableRow>
          </TableBody>
        </Table>
          </div>
        }
        code={"import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@slipstream-ui/core';\n\nexport default function Example() {\n  return (\n    <>\n      <Table className=\"max-w-md\">\n          <TableCaption>Monthly revenue</TableCaption>\n          <TableHeader>\n            <TableRow>\n              <TableHead scope=\"col\">Month</TableHead>\n              <TableHead scope=\"col\">Amount</TableHead>\n            </TableRow>\n          </TableHeader>\n          <TableBody>\n            <TableRow><TableCell>January</TableCell><TableCell>$1,200</TableCell></TableRow>\n            <TableRow><TableCell>February</TableCell><TableCell>$1,450</TableCell></TableRow>\n          </TableBody>\n        </Table>\n    </>\n  );\n}"}
        usage={"import { Table } from '@slipstream-ui/core';\n\n// Basic usage\n<Table />"}
        types={"interface TableProps {\n  children: ReactNode;\n}"}
      />
    </ComponentPage>
  );
}
