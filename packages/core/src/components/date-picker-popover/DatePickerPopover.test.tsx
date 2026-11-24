import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { DatePickerPopover } from './DatePickerPopover';

const TODAY = '2026-11-13';

function setup(props: Partial<React.ComponentProps<typeof DatePickerPopover>> = {}) {
  const onValueChange = vi.fn();
  render(
    <DatePickerPopover
      value="2026-11-13"
      today={TODAY}
      onValueChange={onValueChange}
      {...props}
    />
  );
  return { onValueChange };
}

describe('DatePickerPopover', () => {
  it('shows the formatted selected date', () => {
    setup();
    expect(screen.getByRole('button', { name: /Nov 13, 2026/ })).toBeInTheDocument();
  });

  it('shows a placeholder when empty', () => {
    render(<DatePickerPopover today={TODAY} onValueChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Pick a date' })).toBeInTheDocument();
  });

  it('opens a calendar panel and focuses the selected day', async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole('button', { name: /Nov 13, 2026/ }));

    expect(await screen.findByRole('grid', { name: 'November 2026' })).toBeInTheDocument();
    await waitFor(() =>
      expect(document.activeElement?.getAttribute('data-date')).toBe('2026-11-13')
    );
  });

  it('chooses a day, closes and restores focus to the trigger', async () => {
    const user = userEvent.setup();
    const { onValueChange } = setup();
    await user.click(screen.getByRole('button', { name: /Nov 13, 2026/ }));
    await screen.findByRole('grid');

    await user.click(within(screen.getByRole('grid')).getByRole('button', { name: /Nov 20, 2026/ }));
    expect(onValueChange).toHaveBeenCalledWith('2026-11-20');
    await waitFor(() => expect(screen.queryByRole('grid')).not.toBeInTheDocument());
    expect(screen.getByRole('button', { name: /Nov 13, 2026/ })).toHaveFocus();
  });

  it('selects with the keyboard', async () => {
    const user = userEvent.setup();
    const { onValueChange } = setup();
    await user.click(screen.getByRole('button', { name: /Nov 13, 2026/ }));
    await screen.findByRole('grid');
    await waitFor(() =>
      expect(document.activeElement?.getAttribute('data-date')).toBe('2026-11-13')
    );

    await user.keyboard('{ArrowRight}');
    await user.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('2026-11-14');
    await waitFor(() => expect(screen.queryByRole('grid')).not.toBeInTheDocument());
  });

  it('blocks days outside min and max', async () => {
    const user = userEvent.setup();
    const { onValueChange } = setup({ min: '2026-11-13', max: '2026-11-20' });
    await user.click(screen.getByRole('button', { name: /Nov 13, 2026/ }));
    await screen.findByRole('grid');

    const grid = within(screen.getByRole('grid'));
    const early = grid.getByRole('button', { name: /Nov 10, 2026/ });
    expect(early).toHaveAttribute('aria-disabled', 'true');
    await user.click(early);
    expect(onValueChange).not.toHaveBeenCalled();

    await user.click(grid.getByRole('button', { name: /Nov 18, 2026/ }));
    expect(onValueChange).toHaveBeenCalledWith('2026-11-18');
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole('button', { name: /Nov 13, 2026/ }));
    await screen.findByRole('grid');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('grid')).not.toBeInTheDocument());
  });

  it('submits through a hidden input when named', () => {
    const { container } = render(
      <form>
        <DatePickerPopover name="date" value="2026-11-13" today={TODAY} onValueChange={() => {}} />
      </form>
    );
    const input = container.querySelector('input[name="date"]') as HTMLInputElement;
    expect(input.value).toBe('2026-11-13');
  });

  it('is not interactive when disabled', async () => {
    const user = userEvent.setup();
    setup({ disabled: true });
    const trigger = screen.getByRole('button', { name: /Nov 13, 2026/ });
    expect(trigger).toBeDisabled();
    await user.click(trigger);
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <DatePickerPopover today={TODAY} value="2026-11-13" onValueChange={() => {}} />
    );
    await user.click(screen.getByRole('button', { name: /Nov 13, 2026/ }));
    await screen.findByRole('grid');
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('DatePickerPopover field wiring', () => {
  it('marks the hidden input required and keeps the ISO value', () => {
    const { container } = render(
      <form>
        <DatePickerPopover
          name="start"
          required
          value="2026-11-13"
          today={TODAY}
          onValueChange={() => {}}
        />
      </form>
    );
    const input = container.querySelector('input[name="start"]') as HTMLInputElement;
    expect(input.value).toBe('2026-11-13');
    expect(input.required).toBe(true);
    expect(input.type).toBe('hidden');
  });

  it('renders no hidden input without a name', () => {
    const { container } = render(
      <DatePickerPopover value="2026-11-13" today={TODAY} onValueChange={() => {}} />
    );
    expect(container.querySelector('input[type="hidden"]')).toBeNull();
  });

  it('passes id and aria-label through and labels the dialog', async () => {
    const user = userEvent.setup();
    render(
      <DatePickerPopover
        id="start-date"
        aria-label="Start date"
        value="2026-11-13"
        today={TODAY}
        onValueChange={() => {}}
      />
    );
    const trigger = screen.getByRole('button', { name: 'Start date' });
    expect(trigger).toHaveAttribute('id', 'start-date');

    await user.click(trigger);
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby', 'start-date');
  });

  it('returns focus to the trigger on Escape', async () => {
    const user = userEvent.setup();
    setup();
    const trigger = screen.getByRole('button', { name: /Nov 13, 2026/ });
    await user.click(trigger);
    await screen.findByRole('grid');

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('grid')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('forwards FormField aria wiring to the trigger', () => {
    render(
      <DatePickerPopover
        value="2026-11-13"
        today={TODAY}
        onValueChange={() => {}}
        aria-describedby="start-hint"
        aria-invalid
      />
    );
    const trigger = screen.getByRole('button', { name: /Nov 13, 2026/ });
    expect(trigger).toHaveAttribute('aria-describedby', 'start-hint');
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
  });

  it('honours the requested side', async () => {
    const user = userEvent.setup();
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement
    ) {
      const base = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      } as DOMRect;
      if (this.getAttribute('role') === 'dialog') return { ...base, width: 288, height: 320 };
      return { ...base, top: 500, left: 40, width: 240, height: 40 };
    });
    setup({ side: 'top' });

    await user.click(screen.getByRole('button', { name: /Nov 13, 2026/ }));
    expect(await screen.findByRole('dialog')).toHaveAttribute('data-side', 'top');
    vi.restoreAllMocks();
  });

  it('treats min and max as inclusive', async () => {
    const user = userEvent.setup();
    const { onValueChange } = setup({ min: '2026-11-13', max: '2026-11-14' });
    await user.click(screen.getByRole('button', { name: /Nov 13, 2026/ }));
    const grid = within(await screen.findByRole('grid'));

    expect(grid.getByRole('button', { name: /Nov 13, 2026/ })).not.toHaveAttribute(
      'aria-disabled'
    );
    const last = grid.getByRole('button', { name: /Nov 14, 2026/ });
    expect(last).not.toHaveAttribute('aria-disabled');
    await user.click(last);
    expect(onValueChange).toHaveBeenCalledWith('2026-11-14');
  });
});
