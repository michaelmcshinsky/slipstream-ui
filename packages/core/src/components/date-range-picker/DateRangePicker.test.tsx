import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { DateRangePicker } from './DateRangePicker';

describe('DateRangePicker', () => {
  it('renders start and end fields and emits ISO values', () => {
    const onValueChange = vi.fn();
    render(<DateRangePicker onValueChange={onValueChange} />);
    fireEvent.change(screen.getByLabelText('From'), { target: { value: '2026-01-01' } });
    expect(onValueChange).toHaveBeenCalledWith({ start: '2026-01-01', end: undefined });
    fireEvent.change(screen.getByLabelText('To'), { target: { value: '2026-01-31' } });
    expect(onValueChange).toHaveBeenLastCalledWith({ start: '2026-01-01', end: '2026-01-31' });
  });

  it('keeps the end on or after the start', () => {
    const onValueChange = vi.fn();
    render(<DateRangePicker defaultValue={{ start: '2026-02-01', end: '2026-02-10' }} onValueChange={onValueChange} />);
    fireEvent.change(screen.getByLabelText('From'), { target: { value: '2026-02-20' } });
    expect(onValueChange).toHaveBeenLastCalledWith({ start: '2026-02-20', end: '2026-02-20' });
  });

  it('applies a preset range', () => {
    const onValueChange = vi.fn();
    render(<DateRangePicker presets={[{ label: 'Last 7 days', days: 7 }]} onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Last 7 days' }));
    const range = onValueChange.mock.calls[0][0] as { start: string; end: string };
    expect(range.start).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(range.end).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<DateRangePicker />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
