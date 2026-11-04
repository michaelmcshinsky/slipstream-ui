import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { PasswordInput } from './PasswordInput';

describe('PasswordInput', () => {
  it('toggles visibility with an accessible pressed button', async () => {
    const user = userEvent.setup();
    render(<PasswordInput aria-label="Password" defaultValue="hunter2" />);
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');
    const toggle = screen.getByRole('button', { name: 'Show password' });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await user.click(toggle);
    expect(input).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: 'Hide password' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('supports custom toggle labels', () => {
    render(<PasswordInput aria-label="Passphrase" showLabel="Reveal" hideLabel="Conceal" />);
    expect(screen.getByRole('button', { name: 'Reveal' })).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<PasswordInput aria-label="Password" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
