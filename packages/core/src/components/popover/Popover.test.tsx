import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import * as React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from './Popover';

function BasicPopover({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  return (
    <Popover onOpenChange={onOpenChange}>
      <PopoverTrigger>Open</PopoverTrigger>
      <PopoverContent>
        <p>Popover content</p>
        <button type="button">Inner button</button>
      </PopoverContent>
    </Popover>
  );
}

function mockBounds(anchor: Partial<DOMRect>, panel: Partial<DOMRect> = {}) {
  const toRect = (value: Partial<DOMRect>, fallback: DOMRect) => ({ ...fallback, ...value }) as DOMRect;
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: HTMLElement
  ) {
    const empty = {
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
    if (this.getAttribute('role') === 'dialog') return toRect(panel, empty);
    if (this.dataset.testid === 'anchor' || this.classList.contains('relative')) {
      return toRect(anchor, empty);
    }
    return empty;
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Popover', () => {
  it('renders trigger with dialog semantics', () => {
    render(<BasicPopover />);
    const trigger = screen.getByRole('button', { name: 'Open' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens on click and shows content', async () => {
    const user = userEvent.setup();
    render(<BasicPopover />);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Popover content')).toBeVisible();
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    render(<BasicPopover />);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('closes on outside click', async () => {
    const user = userEvent.setup();
    render(<BasicPopover />);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.click(document.body);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('calls onOpenChange', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<BasicPopover onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    await user.keyboard('{Escape}');
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });

  it('links trigger to content via aria-controls', async () => {
    const user = userEvent.setup();
    render(<BasicPopover />);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = screen.getByRole('dialog');
    expect(screen.getByRole('button', { name: 'Open' })).toHaveAttribute('aria-controls', dialog.id);
  });

  it('has no accessibility violations when open', async () => {
    const user = userEvent.setup();
    const { container } = render(<BasicPopover />);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Popover placement', () => {
  it('opens below the anchor by default', async () => {
    mockBounds({ top: 100, left: 40, width: 160, height: 32 }, { width: 288, height: 180 });
    render(<BasicPopover />);
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('data-side', 'bottom');
    expect(dialog.style.top).toBe('140px');
    expect(dialog.style.left).toBe('40px');
  });

  it('opens above when the preferred side has no room', async () => {
    mockBounds({ top: 700, left: 40, width: 160, height: 32 }, { width: 288, height: 180 });
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent side="bottom">Panel</PopoverContent>
      </Popover>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('data-side', 'top');
    expect(dialog.style.top).toBe('512px');
  });

  it('honours the side prop', async () => {
    mockBounds({ top: 200, left: 300, width: 120, height: 36 }, { width: 200, height: 120 });
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent side="right">Panel</PopoverContent>
      </Popover>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toHaveAttribute('data-side', 'right');
  });

  it('matches the anchor width on request', async () => {
    mockBounds({ top: 100, left: 40, width: 260, height: 32 }, { width: 288, height: 180 });
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent matchTriggerWidth>Panel</PopoverContent>
      </Popover>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog').style.width).toBe('260px');
  });

  it('anchors to PopoverAnchor when present', async () => {
    mockBounds({ top: 100, left: 0, width: 0, height: 0 }, { width: 200, height: 100 });
    render(
      <Popover>
        <PopoverAnchor data-testid="anchor">Field</PopoverAnchor>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Panel</PopoverContent>
      </Popover>
    );
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
      if (this.getAttribute('role') === 'dialog') return { ...base, width: 200, height: 100 };
      if (this.dataset.testid === 'anchor') {
        return { ...base, top: 300, left: 24, width: 180, height: 40 };
      }
      return base;
    });
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog').style.top).toBe('348px');
    expect(screen.getByRole('dialog').style.left).toBe('24px');
  });

  it('stays open and repositions on scroll', async () => {
    let top = 100;
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
      if (this.getAttribute('role') === 'dialog') return { ...base, width: 288, height: 180 };
      return { ...base, top, left: 40, width: 160, height: 32 };
    });
    render(<BasicPopover />);
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog').style.top).toBe('140px');

    top = 60;
    fireEvent.scroll(window);
    await waitFor(() => expect(screen.getByRole('dialog').style.top).toBe('100px'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});

describe('Popover focus and labelling', () => {
  it('restores focus to the trigger on Escape', async () => {
    const user = userEvent.setup();
    render(<BasicPopover />);
    const trigger = screen.getByRole('button', { name: 'Open' });
    await user.click(trigger);
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('labels the dialog from the trigger', async () => {
    const user = userEvent.setup();
    render(<BasicPopover />);
    const trigger = screen.getByRole('button', { name: 'Open' });
    await user.click(trigger);

    expect(trigger.id).not.toBe('');
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby', trigger.id);
  });

  it('keeps the label valid when the trigger has an explicit id', async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger id="filter-trigger">Open</PopoverTrigger>
        <PopoverContent>Panel</PopoverContent>
      </Popover>
    );
    const trigger = screen.getByRole('button', { name: 'Open' });
    expect(trigger).toHaveAttribute('id', 'filter-trigger');

    await user.click(trigger);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'filter-trigger');
  });

  it('does not emit a dangling aria-labelledby without a trigger', async () => {
    render(
      <Popover open>
        <PopoverContent aria-label="Anchored panel">Panel</PopoverContent>
      </Popover>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).not.toHaveAttribute('aria-labelledby');
    expect(dialog).toHaveAttribute('aria-label', 'Anchored panel');
  });

  it('closes an anchor-only panel on Escape without throwing', async () => {
    const user = userEvent.setup();
    function AnchorOnly() {
      const [open, setOpen] = React.useState(true);
      return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverAnchor data-testid="anchor">Field</PopoverAnchor>
          <PopoverContent aria-label="Anchored panel">Panel</PopoverContent>
        </Popover>
      );
    }
    render(<AnchorOnly />);
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });
});

describe('Popover controlled and interaction edges', () => {
  it('follows a controlled open prop', async () => {
    const { rerender } = render(
      <Popover open>
        <PopoverContent>Panel</PopoverContent>
      </Popover>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    rerender(
      <Popover open={false}>
        <PopoverContent>Panel</PopoverContent>
      </Popover>
    );
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('toggles aria-expanded on the trigger', async () => {
    const user = userEvent.setup();
    render(<BasicPopover />);
    const trigger = screen.getByRole('button', { name: 'Open' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('does not open from a disabled trigger', async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger disabled>Open</PopoverTrigger>
        <PopoverContent>Panel</PopoverContent>
      </Popover>
    );
    const trigger = screen.getByRole('button', { name: 'Open' });
    expect(trigger).toBeDisabled();
    await user.click(trigger);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('stays open when the pointer goes down inside the panel', async () => {
    render(<BasicPopover />);
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = screen.getByRole('dialog');

    fireEvent.pointerDown(dialog);
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Inner button' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('repositions on window resize', async () => {
    let top = 100;
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
      if (this.getAttribute('role') === 'dialog') return { ...base, width: 288, height: 180 };
      return { ...base, top, left: 40, width: 160, height: 32 };
    });

    render(<BasicPopover />);
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog').style.top).toBe('140px');

    top = 20;
    fireEvent(window, new Event('resize'));
    await waitFor(() => expect(screen.getByRole('dialog').style.top).toBe('60px'));
  });

  it('applies align and collisionPadding to the panel position', () => {
    mockBounds({ top: 100, left: 900, width: 160, height: 32 }, { width: 288, height: 180 });
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent align="end" collisionPadding={8}>
          Panel
        </PopoverContent>
      </Popover>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));

    // align=end would start at 772; the viewport clamp keeps it at 1024-288-8.
    expect(screen.getByRole('dialog').style.left).toBe('728px');
  });
});
