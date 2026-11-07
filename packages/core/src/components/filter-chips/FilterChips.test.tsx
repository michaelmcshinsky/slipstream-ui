import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { FilterChips } from './FilterChips';

describe('FilterChips', () => {
  it('renders each active filter with a remove action', () => {
    const onRemove = vi.fn();
    render(
      <FilterChips
        filters={[
          { key: 'industry', label: 'Industry', value: 'Technology', onRemove },
          { key: 'region', label: 'Region', value: 'Mountain' },
        ]}
      />
    );
    expect(screen.getByText('Technology')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Remove Industry: Technology' }));
    expect(onRemove).toHaveBeenCalled();
  });

  it('renders a clear-all action', () => {
    const onClearAll = vi.fn();
    render(
      <FilterChips
        filters={[{ key: 'type', label: 'Type', value: 'PE' }]}
        onClearAll={onClearAll}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Clear all' }));
    expect(onClearAll).toHaveBeenCalled();
  });

  it('shows the empty label or nothing when there are no filters', () => {
    const { rerender } = render(<FilterChips filters={[]} emptyLabel="No filters applied" />);
    expect(screen.getByText('No filters applied')).toBeInTheDocument();
    rerender(<FilterChips filters={[]} />);
    expect(screen.queryByText('No filters applied')).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <FilterChips filters={[{ key: 'type', label: 'Type', value: 'PE', onRemove: () => {} }]} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
