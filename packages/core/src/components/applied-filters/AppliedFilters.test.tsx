import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { AppliedFilters } from './AppliedFilters';

describe('AppliedFilters', () => {
  it('shows the count and removable chips', () => {
    const onRemove = vi.fn();
    render(
      <AppliedFilters
        filters={[
          { key: 'industry', label: 'Industry', value: 'Technology', onRemove },
          { key: 'region', label: 'Region', value: 'Mountain' },
        ]}
        onClearAll={() => {}}
      />
    );
    expect(screen.getByText('2 active')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Remove Industry: Technology' }));
    expect(onRemove).toHaveBeenCalled();
  });

  it('renders edit and clear actions', () => {
    const onEdit = vi.fn();
    const onClearAll = vi.fn();
    render(
      <AppliedFilters
        filters={[{ key: 'type', label: 'Type', value: 'PE' }]}
        onEdit={onEdit}
        onClearAll={onClearAll}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Edit filters' }));
    fireEvent.click(screen.getByRole('button', { name: 'Clear all' }));
    expect(onEdit).toHaveBeenCalled();
    expect(onClearAll).toHaveBeenCalled();
  });

  it('shows the empty label when there are no filters', () => {
    render(<AppliedFilters filters={[]} emptyLabel="No filters applied" />);
    expect(screen.getByText('No filters applied')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <AppliedFilters filters={[{ key: 'type', label: 'Type', value: 'PE', onRemove: () => {} }]} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
