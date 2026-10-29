import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Separator } from './Separator';

describe('Separator', () => {
  it('renders as decorative by default', () => {
    const { container } = render(<Separator />);
    expect(container.firstChild).toHaveAttribute('role', 'none');
  });

  it('becomes a semantic separator when labelled', () => {
    render(<Separator label="Section break" />);
    expect(screen.getByRole('separator')).toHaveAccessibleName('Section break');
  });

  it('applies the horizontal orientation class by default', () => {
    const { container } = render(<Separator />);
    expect(container.firstChild).toHaveClass('h-px');
  });

  it('applies the vertical orientation class', () => {
    const { container } = render(<Separator orientation="vertical" />);
    expect(container.firstChild).toHaveClass('w-px');
    expect(container.firstChild).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('forwards className', () => {
    const { container } = render(<Separator className="my-4" />);
    expect(container.firstChild).toHaveClass('my-4');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Separator label="Break" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
