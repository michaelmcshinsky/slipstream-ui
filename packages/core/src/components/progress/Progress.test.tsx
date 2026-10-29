import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Progress } from './Progress';

describe('Progress', () => {
  it('renders with progressbar role and value', () => {
    render(<Progress value={40} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '40');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('clamps values above max', () => {
    render(<Progress value={150} max={100} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });

  it('clamps negative values to zero', () => {
    render(<Progress value={-10} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('respects a custom max', () => {
    render(<Progress value={3} max={5} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '5');
  });

  it('exposes an accessible label', () => {
    render(<Progress value={20} label="Upload progress" />);
    expect(screen.getByRole('progressbar')).toHaveAccessibleName('Upload progress');
  });

  it('renders the fill width proportionally', () => {
    const { container } = render(<Progress value={25} />);
    const fill = container.querySelector('[style*="width"]');
    expect(fill).toHaveStyle({ width: '25%' });
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Progress value={20} label="Upload" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
