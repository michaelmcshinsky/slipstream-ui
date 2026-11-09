import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { LoadMore } from './LoadMore';

describe('LoadMore', () => {
  it('requests the next page', () => {
    const onLoadMore = vi.fn();
    render(<LoadMore hasMore onLoadMore={onLoadMore} />);
    fireEvent.click(screen.getByRole('button', { name: 'Load more' }));
    expect(onLoadMore).toHaveBeenCalled();
  });

  it('shows a loading state', () => {
    render(<LoadMore hasMore loading onLoadMore={() => {}} />);
    expect(screen.getByRole('button', { name: /Loading/ })).toBeDisabled();
  });

  it('announces the end of the list', () => {
    render(<LoadMore hasMore={false} onLoadMore={() => {}} />);
    expect(screen.getByRole('status')).toHaveTextContent("You're all caught up.");
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<LoadMore hasMore onLoadMore={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
