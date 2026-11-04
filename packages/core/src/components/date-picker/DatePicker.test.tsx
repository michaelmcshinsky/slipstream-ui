import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { DatePicker } from './DatePicker';

describe('DatePicker', () => {
  it('reports ISO value changes', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DatePicker aria-label="Start date" onValueChange={onValueChange} />);
    const input = screen.getByLabelText('Start date');
    await user.type(input, '2026-11-03');
    expect(onValueChange).toHaveBeenCalled();
    expect(input).toHaveAttribute('type', 'date');
  });

  it('clears the value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<DatePicker aria-label="Due" clearable defaultValue="2026-11-03" onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button', { name: 'Clear date' }));
    expect(onValueChange).toHaveBeenCalledWith('');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<DatePicker aria-label="Date" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
