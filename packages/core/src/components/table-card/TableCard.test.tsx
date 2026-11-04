import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { TableCard } from './TableCard';

describe('TableCard', () => {
  it('renders header, toolbar, body and footer', () => {
    render(
      <TableCard
        title="Classes"
        description="12 active"
        actions={<button type="button">New</button>}
        toolbar={<span>filters</span>}
        footer={<span>Showing 1–25 of 40</span>}
      >
        <table aria-label="Classes table">
          <tbody>
            <tr>
              <td>Yoga</td>
            </tr>
          </tbody>
        </table>
      </TableCard>
    );
    expect(screen.getByRole('heading', { name: 'Classes' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New' })).toBeInTheDocument();
    expect(screen.getByText('filters')).toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'Classes table' })).toBeInTheDocument();
    expect(screen.getByText('Showing 1–25 of 40')).toBeInTheDocument();
  });

  it('renders without chrome when no header props are given', () => {
    const { container } = render(
      <TableCard>
        <span>body</span>
      </TableCard>
    );
    expect(container.querySelector('h2')).toBeNull();
    expect(screen.getByText('body')).toBeInTheDocument();
  });

  it('supports padded (non-flush) content', () => {
    const { container } = render(
      <TableCard flush={false}>
        <span>padded</span>
      </TableCard>
    );
    expect(container.querySelector('.p-4')).not.toBeNull();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <TableCard title="Empty">
        <p>Nothing to show</p>
      </TableCard>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
