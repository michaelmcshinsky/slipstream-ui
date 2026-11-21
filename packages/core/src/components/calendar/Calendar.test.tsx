import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Calendar } from './Calendar';

const TODAY = '2026-11-13';

function setup(overrides: Partial<React.ComponentProps<typeof Calendar>> = {}) {
  const onValueChange = vi.fn();
  render(<Calendar today={TODAY} value="2026-11-13" onValueChange={onValueChange} {...overrides} />);
  return { onValueChange };
}

function day(name: RegExp | string) {
  return screen.getByRole('button', { name });
}

describe('Calendar', () => {
  it('renders a labelled month grid', () => {
    setup();
    expect(screen.getByRole('grid', { name: 'November 2026' })).toBeInTheDocument();
    expect(screen.getByText('November 2026')).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')).toHaveLength(7);
  });

  it('marks the selected day and today', () => {
    setup();
    const selected = day(/Nov 13, 2026/);
    expect(selected).toHaveAttribute('aria-current', 'date');
    const cell = selected.closest('[role="gridcell"]');
    expect(cell).toHaveAttribute('aria-selected', 'true');
  });

  it('selects a day by click', async () => {
    const user = userEvent.setup();
    const { onValueChange } = setup();
    await user.click(day(/Nov 20, 2026/));
    expect(onValueChange).toHaveBeenCalledWith('2026-11-20');
  });

  it('works uncontrolled', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Calendar defaultValue="2026-11-13" today={TODAY} onValueChange={onValueChange} />);
    await user.click(day(/Nov 5, 2026/));
    expect(onValueChange).toHaveBeenCalledWith('2026-11-05');
    expect(day(/Nov 5, 2026/).closest('[role="gridcell"]')).toHaveAttribute(
      'aria-selected',
      'true'
    );
  });

  it('moves focus with every arrow key and selects with Enter', async () => {
    const user = userEvent.setup();
    const { onValueChange } = setup({ autoFocus: true });

    await waitFor(() => expect(day(/Nov 13, 2026/)).toHaveFocus());

    await user.keyboard('{ArrowRight}');
    expect(day(/Nov 14, 2026/)).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(day(/Nov 21, 2026/)).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(day(/Nov 20, 2026/)).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(day(/Nov 13, 2026/)).toHaveFocus();
    await user.keyboard('{Home}');
    expect(day(/Nov 8, 2026/)).toHaveFocus();
    await user.keyboard('{End}');
    expect(day(/Nov 14, 2026/)).toHaveFocus();
    await user.keyboard('{PageDown}');
    expect(day(/Dec 14, 2026/)).toHaveFocus();
    await user.keyboard('{PageUp}');
    expect(day(/Nov 14, 2026/)).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('2026-11-14');
  }, 15000);

  it('pages months with the header buttons and clamps the day', async () => {
    const user = userEvent.setup();
    setup({ value: '2026-01-31' });
    await user.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByRole('grid', { name: 'February 2026' })).toBeInTheDocument();
    expect(day(/Feb 28, 2026/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Previous month' }));
    expect(screen.getByRole('grid', { name: 'January 2026' })).toBeInTheDocument();
  });

  it('disables days outside min and max', async () => {
    const user = userEvent.setup();
    const { onValueChange } = setup({ min: '2026-11-10', max: '2026-11-20' });

    const blocked = day(/Nov 5, 2026/);
    expect(blocked).toHaveAttribute('aria-disabled', 'true');
    await user.click(blocked);
    expect(onValueChange).not.toHaveBeenCalled();

    await user.click(day(/Nov 15, 2026/));
    expect(onValueChange).toHaveBeenCalledWith('2026-11-15');
  });

  it('honours isDateDisabled', async () => {
    const user = userEvent.setup();
    const { onValueChange } = setup({ isDateDisabled: (key) => key === '2026-11-13' });
    const blocked = day(/Nov 13, 2026/);
    expect(blocked).toHaveAttribute('aria-disabled', 'true');
    await user.click(blocked);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('does nothing while disabled', async () => {
    const user = userEvent.setup();
    const { onValueChange } = setup({ disabled: true });
    await user.click(day(/Nov 15, 2026/));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Next month' })).toBeDisabled();
  });

  it('starts the week on Monday when asked', () => {
    setup({ weekStartsOn: 1 });
    const headers = screen.getAllByRole('columnheader').map((node) => node.textContent);
    expect(headers[0]).toBe('Mon');
  });

  it('hides outside days on request', () => {
    const { unmount } = render(
      <Calendar today={TODAY} value="2026-12-15" showOutsideDays={false} onValueChange={() => {}} />
    );
    // December 2026 starts on a Tuesday, so the first cells are November days.
    expect(screen.queryByRole('button', { name: /Nov 30, 2026/ })).not.toBeInTheDocument();
    unmount();

    render(<Calendar today={TODAY} value="2026-12-15" onValueChange={() => {}} />);
    expect(screen.getByRole('button', { name: /Nov 30, 2026/ })).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Calendar today={TODAY} value="2026-11-13" onValueChange={() => {}} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Calendar edge cases', () => {
  it('accepts an aria-label for the grid', () => {
    render(
      <Calendar
        today={TODAY}
        value="2026-11-13"
        aria-label="Choose a start date"
        onValueChange={() => {}}
      />
    );
    expect(screen.getByRole('grid', { name: 'Choose a start date' })).toBeInTheDocument();
  });

  it('follows a controlled value into its month', async () => {
    const { rerender } = render(
      <Calendar today={TODAY} value="2026-11-13" onValueChange={() => {}} />
    );
    expect(screen.getByRole('grid', { name: 'November 2026' })).toBeInTheDocument();

    rerender(<Calendar today={TODAY} value="2027-02-10" onValueChange={() => {}} />);
    await waitFor(() =>
      expect(screen.getByRole('grid', { name: 'February 2027' })).toBeInTheDocument()
    );
    expect(day(/Feb 10, 2027/)).toHaveAttribute('tabindex', '0');
  });

  it('selects an outside day and follows it into the previous month', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Calendar defaultValue="2026-12-15" today={TODAY} onValueChange={onValueChange} />);

    await user.click(day(/Nov 30, 2026/));
    expect(onValueChange).toHaveBeenCalledWith('2026-11-30');
    await waitFor(() =>
      expect(screen.getByRole('grid', { name: 'November 2026' })).toBeInTheDocument()
    );
  });

  it('keeps exactly one tab stop and moves it with the keyboard', async () => {
    const user = userEvent.setup();
    render(<Calendar today={TODAY} value="2026-11-13" autoFocus onValueChange={() => {}} />);
    await waitFor(() => expect(day(/Nov 13, 2026/)).toHaveFocus());

    const tabbable = () =>
      within(screen.getByRole('grid'))
        .getAllByRole('button')
        .filter((button) => button.tabIndex === 0);
    expect(tabbable()).toHaveLength(1);
    expect(tabbable()[0]).toHaveAttribute('data-date', '2026-11-13');

    await user.keyboard('{ArrowRight}');
    expect(tabbable()).toHaveLength(1);
    expect(tabbable()[0]).toHaveAttribute('data-date', '2026-11-14');
  });

  it('moves focus from the keyboard without autoFocus', async () => {
    const user = userEvent.setup();
    render(<Calendar today={TODAY} value="2026-11-13" onValueChange={() => {}} />);

    // A keyboard user tabs into the grid rather than relying on autoFocus.
    day(/Nov 13, 2026/).focus();
    await user.keyboard('{ArrowRight}');
    expect(day(/Nov 14, 2026/)).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(day(/Nov 21, 2026/)).toHaveFocus();
  });

  it('selects with Space', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Calendar today={TODAY} value="2026-11-13" autoFocus onValueChange={onValueChange} />
    );
    await waitFor(() => expect(day(/Nov 13, 2026/)).toHaveFocus());

    await user.keyboard(' ');
    expect(onValueChange).toHaveBeenCalledWith('2026-11-13');
  });

  it('treats min and max as inclusive', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Calendar
        today={TODAY}
        value="2026-11-13"
        min="2026-11-13"
        max="2026-11-15"
        onValueChange={onValueChange}
      />
    );

    expect(day(/Nov 13, 2026/)).not.toHaveAttribute('aria-disabled');
    expect(day(/Nov 15, 2026/)).not.toHaveAttribute('aria-disabled');
    expect(day(/Nov 12, 2026/)).toHaveAttribute('aria-disabled', 'true');
    expect(day(/Nov 16, 2026/)).toHaveAttribute('aria-disabled', 'true');

    await user.click(day(/Nov 15, 2026/));
    expect(onValueChange).toHaveBeenCalledWith('2026-11-15');
  });

  it('clamps the day when paging months from the 31st', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Calendar today="2026-01-31" value="2026-01-31" autoFocus onValueChange={onValueChange} />
    );
    await waitFor(() => expect(day(/Jan 31, 2026/)).toHaveFocus());

    await user.keyboard('{PageDown}');
    await waitFor(() => expect(day(/Feb 28, 2026/)).toHaveFocus());
    await user.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('2026-02-28');
  });

  it('renders a usable grid for an unparseable value', () => {
    render(<Calendar today={TODAY} value="not-a-date" onValueChange={() => {}} />);
    expect(screen.getByRole('grid', { name: 'January 1970' })).toBeInTheDocument();
  });

  it('marks every day unavailable when disabled', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Calendar today={TODAY} value="2026-11-13" disabled onValueChange={onValueChange} />
    );
    expect(day(/Nov 15, 2026/)).toHaveAttribute('aria-disabled', 'true');
    await user.click(day(/Nov 15, 2026/));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
