import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { TimePicker } from './TimePicker';

describe('TimePicker', () => {
  it('renders a time input and reports changes', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TimePicker aria-label="Starts at" onValueChange={onValueChange} />);
    const input = screen.getByLabelText('Starts at');
    expect(input).toHaveAttribute('type', 'time');
    await user.type(input, '09:30');
    expect(onValueChange).toHaveBeenCalled();
  });

  it('clears the value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TimePicker aria-label="Ends" clearable defaultValue="17:00" onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button', { name: 'Clear time' }));
    expect(onValueChange).toHaveBeenCalledWith('');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<TimePicker aria-label="Time" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('localized labels', () => {
  it('uses the clear label override', () => {
    render(<TimePicker aria-label="Heure" clearable defaultValue="17:00" clearLabel="Effacer l'heure" />);
    expect(screen.getByRole('button', { name: "Effacer l'heure" })).toBeInTheDocument();
  });
});
