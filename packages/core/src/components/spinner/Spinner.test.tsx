import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('renders with status role and a screen-reader label', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveTextContent('Loading...');
    expect(screen.getByText('Loading...')).toHaveClass('sr-only');
  });

  it('supports a custom label', () => {
    render(<Spinner label="Fetching results" />);
    expect(screen.getByRole('status')).toHaveTextContent('Fetching results');
  });

  it.each(['sm', 'default', 'lg'] as const)('applies the %s size class', (size) => {
    const { container } = render(<Spinner size={size} label="" />);
    expect(container.firstChild).toHaveClass('animate-spin');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Spinner />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
