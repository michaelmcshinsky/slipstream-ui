import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renders an aria-hidden placeholder', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
    expect(container.firstChild).toHaveClass('animate-pulse');
  });

  it('supports size and shape via className', () => {
    const { container } = render(<Skeleton className="h-24 w-24 rounded-full" />);
    expect(container.firstChild).toHaveClass('h-24', 'w-24', 'rounded-full');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <div>
        <Skeleton className="h-4 w-32" />
        <span role="status">Loading content</span>
      </div>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
