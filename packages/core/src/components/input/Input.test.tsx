import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('renders a text input with base styling', () => {
    render(<Input aria-label="Email" />);
    const input = screen.getByLabelText('Email');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('focus-visible:ring-2');
  });

  it('accepts typed input', async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Name" />);
    await user.type(screen.getByLabelText('Name'), 'Ada');
    expect(screen.getByLabelText('Name')).toHaveValue('Ada');
  });

  it('forwards refs to the input element', () => {
    const ref = vi.fn();
    render(<Input ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
  });

  it('respects the disabled attribute', () => {
    render(<Input disabled aria-label="Locked" />);
    expect(screen.getByLabelText('Locked')).toBeDisabled();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Input aria-label="Email" placeholder="you@example.com" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
