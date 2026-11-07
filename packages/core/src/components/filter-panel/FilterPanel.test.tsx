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

  it('has no accessibility violations', async () => {
    const { container } = render(
      <FilterPanel sections={[{ title: 'Industry', content: <label><input type="checkbox" /> Technology</label> }]} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
