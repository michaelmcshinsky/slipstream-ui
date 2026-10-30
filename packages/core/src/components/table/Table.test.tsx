import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from './Table';

function BasicTable() {
  return (
    <Table>
      <TableCaption>Monthly revenue</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead scope="col">Month</TableHead>
          <TableHead scope="col">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>January</TableCell>
          <TableCell>$1,200</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>February</TableCell>
          <TableCell>$1,450</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell>$2,650</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

describe('Table', () => {
  it('renders a semantic table with caption', () => {
    render(<BasicTable />);
    expect(screen.getByRole('table', { name: 'Monthly revenue' })).toBeInTheDocument();
  });

  it('renders column headers with scope', () => {
    render(<BasicTable />);
    expect(screen.getByRole('columnheader', { name: 'Month' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Amount' })).toBeInTheDocument();
  });

  it('renders data cells', () => {
    render(<BasicTable />);
    expect(screen.getByText('January')).toBeInTheDocument();
    expect(screen.getByText('$2,650')).toBeInTheDocument();
  });

  it('forwards className on Table', () => {
    render(<BasicTable />);
    expect(screen.getByRole('table')).toHaveClass('w-full');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<BasicTable />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
