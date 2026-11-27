import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { ListToolbar } from './ListToolbar';

describe('ListToolbar', () => {
  it('renders count, position and note', () => {
    render(
      <ListToolbar
        count={42}
        countLabel="events"
        position="Page 2 of 5"
        note="Sorted by date, soonest first"
      />
    );
    expect(screen.getByText('42 events')).toBeInTheDocument();
    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();
    expect(screen.getByText('Sorted by date, soonest first')).toBeInTheDocument();
  });

  it('defaults the count label to "results"', () => {
    render(<ListToolbar count={7} />);
    expect(screen.getByText('7 results')).toBeInTheDocument();
  });

  it('renders children controls and applies align', () => {
    const { container } = render(
      <ListToolbar count={3} align="end">
        <button type="button">Grid</button>
      </ListToolbar>
    );
    expect(screen.getByRole('button', { name: 'Grid' })).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('justify-end');
  });

  it('renders children alone when no summary props are given', () => {
    render(<ListToolbar><span>controls</span></ListToolbar>);
    expect(screen.getByText('controls')).toBeInTheDocument();
    expect(screen.queryByText(/results/)).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <ListToolbar count={12} position="Showing 1–12" note="Sorted by name">
        <button type="button">List</button>
      </ListToolbar>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
