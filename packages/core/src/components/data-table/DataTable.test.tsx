import { fireEvent, render, screen, within } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { DataTable, type DataTableColumn } from './DataTable';

interface Row {
  id: string;
  name: string;
  messages: number;
}

const ROWS: Row[] = [
  { id: '1', name: 'Zeta', messages: 3 },
  { id: '2', name: 'Alpha', messages: 12 },
  { id: '3', name: 'Mid', messages: 7 },
];

const columns: DataTableColumn<Row>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'messages', header: 'Messages', align: 'right', sortable: true },
];

describe('DataTable', () => {
  it('renders rows from the columns config', () => {
    render(<DataTable columns={columns} data={ROWS} rowId={(row) => row.id} caption="People" />);
    expect(screen.getByRole('table', { name: 'People' })).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(4); // header + 3
    expect(screen.getByText('Zeta')).toBeInTheDocument();
  });

  it('sorts when a sortable header is clicked (asc then desc)', () => {
    const onSortChange = vi.fn();
    render(
      <DataTable columns={columns} data={ROWS} rowId={(row) => row.id} onSortChange={onSortChange} />
    );
    const header = screen.getByRole('columnheader', { name: /Name/ });
    fireEvent.click(within(header).getByRole('button'));
    expect(onSortChange).toHaveBeenCalledWith('name', 'asc');
    expect(header).toHaveAttribute('aria-sort', 'ascending');
    const names = screen.getAllByRole('row').slice(1).map((row) => row.textContent);
    expect(names[0]).toContain('Alpha');

    fireEvent.click(within(screen.getByRole('columnheader', { name: /Name/ })).getByRole('button'));
    expect(onSortChange).toHaveBeenLastCalledWith('name', 'desc');
  });

  it('paginates when pageSize is set and reports the range', () => {
    render(<DataTable columns={columns} data={ROWS} rowId={(row) => row.id} pageSize={2} />);
    expect(screen.getByText(/1–2 of 3/)).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(3); // header + 2
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByText(/3–3 of 3/)).toBeInTheDocument();
  });

  it('renders a custom cell renderer', () => {
    render(
      <DataTable
        columns={[
          { key: 'name', header: 'Name' },
          { key: 'messages', header: 'Messages', cell: (row: Row) => `${row.messages} msgs` },
        ]}
        data={ROWS}
        rowId={(row) => row.id}
      />
    );
    expect(screen.getByText('3 msgs')).toBeInTheDocument();
  });

  it('shows the empty state', () => {
    render(
      <DataTable columns={columns} data={[]} rowId={(row) => row.id} emptyMessage="No people yet" />
    );
    expect(screen.getByText('No people yet')).toBeInTheDocument();
  });

  it('activates rows with Enter when onRowClick is set', () => {
    const onRowClick = vi.fn();
    render(
      <DataTable columns={columns} data={ROWS} rowId={(row) => row.id} onRowClick={onRowClick} />
    );
    const row = screen.getByText('Alpha').closest('tr')!;
    expect(row).toHaveAttribute('tabindex', '0');
    fireEvent.keyDown(row, { key: 'Enter' });
    expect(onRowClick).toHaveBeenCalledWith(ROWS[1]);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <DataTable columns={columns} data={ROWS} rowId={(row) => row.id} caption="People" pageSize={2} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
