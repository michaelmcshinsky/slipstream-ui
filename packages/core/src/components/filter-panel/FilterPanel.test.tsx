import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { FilterPanel } from './FilterPanel';

describe('FilterPanel', () => {
  it('renders sections and toggles their content', () => {
    render(
      <FilterPanel
        title="Deal filters"
        sections={[
          { title: 'Industry', content: <p>Industry controls</p>, defaultOpen: true },
          { title: 'Revenue', content: <p>Revenue controls</p> },
        ]}
      />
    );
    expect(screen.getByRole('heading', { name: 'Deal filters' })).toBeInTheDocument();
    expect(screen.getByText('Industry controls')).toBeInTheDocument();
    expect(screen.queryByText('Revenue controls')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Revenue/ }));
    expect(screen.getByText('Revenue controls')).toBeInTheDocument();
  });

  it('fires reset and apply actions', () => {
    const onReset = vi.fn();
    const onApply = vi.fn();
    render(
      <FilterPanel
        sections={[{ title: 'Type', content: <p>Type controls</p> }]}
        onReset={onReset}
        onApply={onApply}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(onReset).toHaveBeenCalled();
    expect(onApply).toHaveBeenCalled();
  });

  it('toggles same-titled sections independently', () => {
    render(
      <FilterPanel
        sections={[
          { title: 'Tags', content: <p>First tags</p> },
          { title: 'Tags', content: <p>Second tags</p> },
        ]}
      />
    );
    const buttons = screen.getAllByRole('button', { name: /Tags/ });
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveAttribute('aria-controls', 'filter-section-0');
    expect(buttons[1]).toHaveAttribute('aria-controls', 'filter-section-1');

    fireEvent.click(buttons[0]);
    expect(screen.getByText('First tags')).toBeInTheDocument();
    expect(screen.queryByText('Second tags')).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <FilterPanel sections={[{ title: 'Industry', content: <label><input type="checkbox" /> Technology</label> }]} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
