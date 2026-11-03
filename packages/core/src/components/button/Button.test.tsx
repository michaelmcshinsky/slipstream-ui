import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders with default variant classes', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
  });

  it.each(['destructive', 'outline', 'secondary', 'ghost', 'link'] as const)(
    'applies the %s variant class',
    (variant) => {
      render(<Button variant={variant}>{variant}</Button>);
      expect(screen.getByRole('button')).not.toHaveClass('bg-primary');
    }
  );

  it('applies size classes', () => {
    render(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-11');
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Save</Button>);
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('is not clickable when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Save
      </Button>
    );
    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('forwards refs to the button element', () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Ref</Button>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });

  it('renders as a child element when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/docs">Docs</a>
      </Button>
    );
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveAttribute('href', '/docs');
    expect(link).toHaveClass('bg-primary');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Button>Accessible</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Button semantic theme variants', () => {
  it('renders success, warning, and info with paired foreground tokens', () => {
    const { container } = render(
      <>
        <Button variant="success">Approve</Button>
        <Button variant="warning">Caution</Button>
        <Button variant="info">Details</Button>
      </>
    );
    expect(screen.getByRole('button', { name: 'Approve' })).toHaveClass('bg-success', 'text-success-foreground');
    expect(screen.getByRole('button', { name: 'Caution' })).toHaveClass('bg-warning', 'text-warning-foreground');
    expect(screen.getByRole('button', { name: 'Details' })).toHaveClass('bg-info', 'text-info-foreground');
    expect(container).toBeTruthy();
  });

  it('keeps disabled + semantic variants usable together', () => {
    render(
      <Button variant="success" disabled>
        Disabled success
      </Button>
    );
    const button = screen.getByRole('button', { name: 'Disabled success' });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('bg-success', 'disabled:opacity-50');
  });

  it('semantic variants stay keyboard-focusable with a visible ring', () => {
    render(<Button variant="warning">Focus me</Button>);
    expect(screen.getByRole('button', { name: 'Focus me' })).toHaveClass(
      'focus-visible:ring-2'
    );
  });
});
