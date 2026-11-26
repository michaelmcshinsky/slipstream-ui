'use client';

import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCard } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

const ROWS = [
  { name: 'Vinyasa Flow', instructor: 'Ada', seats: 12 },
  { name: 'Beginner Ballet', instructor: 'Grace', seats: 8 },
  { name: 'Pointe Technique', instructor: 'Martha', seats: 6 },
];

export default function Demo() {
  return (
    <>
      <DemoCard
        title="List page table"
        preview={
          <div className="w-full">
            <TableCard
              title="Upcoming classes"
              description="3 scheduled this week"
              actions={<Button size="sm">New class</Button>}
              toolbar={<span className="text-sm text-muted-foreground">Filtered by: this week</span>}
              footer={<span className="text-sm text-muted-foreground">Showing 1–3 of 3</span>}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead className="text-right">Seats</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ROWS.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell>{row.instructor}</TableCell>
                      <TableCell className="text-right tabular-nums">{row.seats}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableCard>
          </div>
        }
        code={`<TableCard
  title="Upcoming classes"
  description="3 scheduled this week"
  actions={<Button size="sm">New class</Button>}
  toolbar={<FilterBar … />}
  footer={<Pagination … />}
>
  <Table>…</Table>
</TableCard>`}
        usage={`// The shell only: pass Table/DataTable as children, FilterBar as toolbar and
// Pagination as footer. flush=false restores inner padding for custom bodies.`}
        types={`type TableCardProps = {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  flush?: boolean;
};`}
      />
    </>
  );
}
