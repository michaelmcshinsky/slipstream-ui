import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('renders a nav landmark', () => {
    render(<Pagination page={1} pageCount={5} />);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
  });

  it('renders page buttons with aria-current on the active page', () => {
    render(<Pagination page={3} pageCount={5} />);
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Page 1' })).not.toHaveAttribute('aria-current');
  });

  it('calls onPageChange when clicking a page button', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={1} pageCount={5} onPageChange={onPageChange} />);
    await user.click(screen.getByRole('button', { name: 'Page 2' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('disables the previous button on the first page', () => {
    render(<Pagination page={1} pageCount={5} />);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
  });

  it('disables the next button on the last page', () => {
    render(<Pagination page={5} pageCount={5} />);
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('calls onPageChange with previous/next', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={3} pageCount={5} onPageChange={onPageChange} />);
    await user.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('shows ellipsis when page range is truncated', () => {
    render(<Pagination page={5} pageCount={20} />);
    const ellipses = screen.getAllByText('…');
    expect(ellipses.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 20' })).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Pagination page={3} pageCount={10} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Pagination boundaries and icons', () => {
  it('shows no boundary buttons by default', () => {
    render(<Pagination page={1} pageCount={5} />);
    expect(screen.queryByRole('button', { name: 'First page' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Last page' })).not.toBeInTheDocument();
  });

  it('showFirst/ showLast fall back to showBoundaries', () => {
    const { rerender } = render(<Pagination page={2} pageCount={5} showBoundaries />);
    expect(screen.getByRole('button', { name: 'First page' })).toBeInTheDocument();
    rerender(<Pagination page={2} pageCount={5} showBoundaries showFirst={false} />);
    expect(screen.queryByRole('button', { name: 'First page' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Last page' })).toBeInTheDocument();
  });

  it('replaces glyphs through the icons prop while keeping accessible names', () => {
    render(
      <Pagination
        page={2}
        pageCount={5}
        showBoundaries
        icons={{ previous: '←', next: '→', first: '⏮', last: '⏭' }}
      />
    );
    expect(screen.getByRole('button', { name: 'Previous page' })).toHaveTextContent('←');
    expect(screen.getByRole('button', { name: 'Next page' })).toHaveTextContent('→');
    expect(screen.getByRole('button', { name: 'First page' })).toHaveTextContent('⏮');
    expect(screen.getByRole('button', { name: 'Last page' })).toHaveTextContent('⏭');
  });
});


describe('Pagination contracts and summary', () => {
  it('accepts currentPage/totalPages aliases', () => {
    render(<Pagination currentPage={3} totalPages={5} />);
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Page 5' })).toBeInTheDocument();
  });

  it('derives the page count and renders a summary from total/pageSize', () => {
    render(<Pagination page={2} pageSize={25} total={312} itemLabel="students" />);
    expect(screen.getByText('Showing 26–50 of 312 students')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 13' })).toBeInTheDocument();
  });

  it('can hide the summary explicitly', () => {
    render(<Pagination page={1} pageSize={10} total={40} showSummary={false} />);
    expect(screen.queryByText(/Showing/)).not.toBeInTheDocument();
  });

  it('falls back to a page summary when totals are absent', () => {
    render(<Pagination page={2} currentPage={2} pageSize={10} total={40} itemLabel="rows" />);
    expect(screen.getByText('Showing 11–20 of 40 rows')).toBeInTheDocument();
  });
});

describe('localized labels', () => {
  it('uses the landmark and control overrides', () => {
    render(<Pagination page={1} pageCount={3} labels={{ pagination: 'Pagination FR', next: 'Suivant' }} />);
    expect(screen.getByRole('navigation', { name: 'Pagination FR' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Suivant' })).toBeInTheDocument();
  });
});

describe('link mode', () => {
  it('renders page links when pageHrefs is provided', () => {
    render(
      <Pagination
        page={2}
        pageCount={4}
        pageHrefs={{ 1: '?page=1', 2: '?page=2', 3: '?page=3', 4: '?page=4' }}
      />
    );
    expect(screen.getByLabelText('Page 2')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Page 3' })).toHaveAttribute('href', '?page=3');
    expect(screen.getByRole('link', { name: 'Next page' })).toHaveAttribute('href', '?page=3');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders disabled boundary controls as non-links at the ends', () => {
    render(
      <Pagination
        page={1}
        pageCount={2}
        pageHrefs={{ 1: '?p=1', 2: '?p=2' }}
        showBoundaries
      />
    );
    expect(screen.getByLabelText('Previous page')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByLabelText('First page')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('link', { name: 'Next page' })).toHaveAttribute('href', '?p=2');
  });
});
