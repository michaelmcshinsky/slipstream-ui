import { render, screen } from '@testing-library/react';
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

describe('Skeleton sizing props', () => {
  it('applies height, width, and rounded presets', () => {
    const { container } = render(<Skeleton height="h-4" width="w-48" rounded="full" />);
    expect(container.firstChild).toHaveClass('h-4', 'w-48', 'rounded-full');
  });

  it('defaults to rounded-md when no preset is given', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass('rounded-md');
  });

  it('keeps className as the escape hatch alongside props', () => {
    const { container } = render(<Skeleton height="h-6" className="mt-2" />);
    expect(container.firstChild).toHaveClass('h-6', 'mt-2');
  });

  it('always hides from assistive tech', () => {
    const { container } = render(<Skeleton height="h-4" />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('localized loading label', () => {
  it('announces an optional loading label instead of hiding the block', () => {
    render(<Skeleton label="Chargement" />);
    const status = screen.getByRole('status');
    expect(status).not.toHaveAttribute('aria-hidden');
    expect(status).toHaveTextContent('Chargement');
  });
});
