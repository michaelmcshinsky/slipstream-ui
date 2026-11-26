import { DemoCard } from '@/components/demo-card';
import { Table, TableBody, TableCell, TableCaption, TableFooter, TableHead, TableHeader, TableRow } from '@slipstream-ui/core';

export default function Demo() {
  return (
    <>
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
    </>
  );
}
