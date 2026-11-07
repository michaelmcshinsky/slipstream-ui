import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { FilterBar } from './FilterBar';

describe('FilterBar', () => {
  it('reports search input changes', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    render(<FilterBar searchValue="" onSearchChange={onSearchChange} searchPlaceholder="Search classes" />);
    await user.type(screen.getByRole('searchbox', { name: 'Search classes' }), 'ab');
    expect(onSearchChange).toHaveBeenCalled();
  });

  it('shows a reset button with the active count and fires it', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    render(<FilterBar onReset={onReset} activeCount={2}><span>filters</span></FilterBar>);
    await user.click(screen.getByRole('button', { name: 'Reset (2)' }));
    expect(onReset).toHaveBeenCalledOnce();
  });

  it('opens a filter panel and shows the result count', async () => {
    const user = userEvent.setup();
    const onOpenFilters = vi.fn();
    render(
      <FilterBar
        onOpenFilters={onOpenFilters}
        activeCount={2}
        resultsCount={312}
        resultsLabel="deals"
      />
    );
    await user.click(screen.getByRole('button', { name: 'Filters (2)' }));
    expect(onOpenFilters).toHaveBeenCalledOnce();
    expect(screen.getByText('312 deals')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <FilterBar searchValue="" onSearchChange={() => undefined} onReset={() => undefined}>
        <select aria-label="Status"><option>All</option></select>
      </FilterBar>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
