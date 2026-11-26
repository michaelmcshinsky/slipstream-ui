import { ComponentPage, type ComponentPageProps } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { Table, TableBody, TableCell, TableCaption, TableFooter, TableHead, TableHeader, TableRow } from '@slipstream-ui/core';

export default function TablePage({ manifest }: { manifest?: ComponentPageProps['manifest'] }) {
  return (
    <ComponentPage
        manifest={manifest}
      id="table"
      title="Table"
      description="Semantic data table with header, body and footer sections, row hover/selection states, and an accessible caption. Compose with the Table* subcomponents."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'children', type: 'ReactNode', description: 'TableHeader, TableBody, TableFooter, TableRow and TableCaption children.' },
        { name: 'className', type: 'string', description: 'Escape hatch on the <table> element; all native table attributes are forwarded.' },
        { name: 'TableHeader', type: 'section props', description: 'Groups header row(s); renders <thead> with a bottom border on each row.' },
        { name: 'TableBody', type: 'section props', description: 'Groups body row(s); renders <tbody> and removes the last row border.' },
        { name: 'TableFooter', type: 'section props', description: 'Summary row(s); renders <tfoot> with a muted background and top border.' },
        { name: 'TableRow', type: 'row props', description: 'A row with border-b, hover:bg-muted/50 and data-[state=selected] highlighting; className passthrough.' },
        { name: 'TableHead', type: 'cell props', description: 'Header cell; defaults scope="col" (pass scope="row" for row headers) with uppercase muted styling.' },
        { name: 'TableCell', type: 'cell props', description: 'Data cell (px-3 py-2); use className for alignment such as text-right.' },
        { name: 'TableCaption', type: 'caption props', description: 'Accessible <caption> describing the table contents; rendered below the table in muted text.' },
      ]}
      accessibility={[
        'Native table semantics with scope attributes on headers (TableHead defaults scope="col").',
        'TableCaption describes the table contents for screen readers.',
        'TableRow supports data-state="selected" for row-selection styling.',
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
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>January</TableCell>
                  <TableCell className="text-right">$1,200</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>February</TableCell>
                  <TableCell className="text-right">$1,450</TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right">$2,650</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        }
        code={`import {
  Table, TableBody, TableCaption, TableCell, TableFooter,
  TableHead, TableHeader, TableRow,
} from '@slipstream-ui/core';

<Table className="max-w-md">
  <TableCaption>Monthly revenue</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Month</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>January</TableCell>
      <TableCell className="text-right">$1,200</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>February</TableCell>
      <TableCell className="text-right">$1,450</TableCell>
    </TableRow>
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell>Total</TableCell>
      <TableCell className="text-right">$2,650</TableCell>
    </TableRow>
  </TableFooter>
</Table>`}
        usage={`// TableHead defaults scope="col"; use scope="row" for row headers.
// Table wraps itself in a scroll container, so wide tables stay usable.
// Every part accepts className for one-off styling.`}
        types={`type TableProps = React.HTMLAttributes<HTMLTableElement>;

// Subcomponents — each forwards its native element's attributes
// plus a className escape hatch:
//   TableHeader  -> <thead>   TableBody    -> <tbody>
//   TableFooter  -> <tfoot>   TableRow     -> <tr>
//   TableHead    -> <th>      (scope="col" default)
//   TableCell    -> <td>      TableCaption -> <caption>`}
      />
    </ComponentPage>
  );
}
