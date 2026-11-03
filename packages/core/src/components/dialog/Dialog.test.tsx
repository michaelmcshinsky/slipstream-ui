import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Dialog, DialogBody, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './Dialog';

function Harness(props: { onOpenChange?: (open: boolean) => void; closeOnBackdrop?: boolean }) {
  const [open, setOpen] = useState(true);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>open</button>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          props.onOpenChange?.(next);
        }}
        title="Delete project?"
        description="This cannot be undone."
        closeOnBackdrop={props.closeOnBackdrop}
      >
        <button type="button">Confirm</button>
      </Dialog>
    </>
  );
}

describe('Dialog', () => {
  it('renders as a labelled modal with description and children', () => {
    render(<Harness />);
    const dialog = screen.getByRole('dialog', { name: 'Delete project?' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('This cannot be undone.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
  });

  it('closes on Escape and reports through onOpenChange', async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    render(<Harness onOpenChange={onOpenChange} />);
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes when the backdrop is clicked (configurable)', async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    const { container } = render(<Harness onOpenChange={onOpenChange} />);
    void container;
    const backdrop = document.querySelector('.fixed.inset-0')!;
    await user.click(backdrop);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('keeps the dialog open when closeOnBackdrop is false', async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    render(<Harness onOpenChange={onOpenChange} closeOnBackdrop={false} />);
    const backdrop = document.querySelector('.fixed.inset-0')!;
    await user.click(backdrop);
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('moves focus into the dialog and restores it to the opener on close', async () => {
    const user = userEvent.setup();
    function Opener() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>open</button>
          <Dialog open={open} onOpenChange={setOpen} title="Focused">content</Dialog>
        </>
      );
    }
    render(<Opener />);
    const trigger = screen.getByRole('button', { name: 'open' });
    await user.click(trigger);
    const dialog = screen.getByRole('dialog');
    expect(dialog.contains(document.activeElement)).toBe(true);
    await user.keyboard('{Escape}');
    expect(document.activeElement).toBe(trigger);
  });

  it('traps Tab within the dialog', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const close = screen.getByRole('button', { name: 'Close dialog' });
    const confirm = screen.getByRole('button', { name: 'Confirm' });
    confirm.focus();
    await user.tab(); // wraps from last focusable (confirm? close order in DOM) stays inside
    expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true);
    close.focus();
    await user.tab({ shift: true });
    expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true);
  });

  it('has no accessibility violations while open', async () => {
    const { container } = render(<Harness />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders nothing when closed', () => {
    render(
      <Dialog open={false} onOpenChange={() => undefined} title="Hidden" />,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

describe('Dialog showClose', () => {
  it('hides the header close button when showClose is false', async () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog open onOpenChange={onOpenChange} title="No close" showClose={false}>
        <p>Body</p>
      </Dialog>
    );
    expect(screen.queryByRole('button', { name: 'Close dialog' })).not.toBeInTheDocument();
    // Escape still closes.
    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('renders the close button by default', () => {
    render(
      <Dialog open onOpenChange={vi.fn()} title="Default">
        <p>Body</p>
      </Dialog>
    );
    expect(screen.getByRole('button', { name: 'Close dialog' })).toBeInTheDocument();
  });
});

describe('Dialog animate (optional fade)', () => {
  it('applies enter motion classes and reduced-motion opt-out when animate is on', () => {
    render(
      <Dialog open animate onOpenChange={vi.fn()} title="Fading">
        body
      </Dialog>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('animate-in');
    expect(dialog.className).toContain('fade-in-0');
    expect(dialog.className).toContain('motion-reduce:animate-none');
    // The backdrop fades with the panel.
    const backdrop = document.querySelector('.fixed.inset-0')!;
    expect(backdrop.className).toContain('fade-in-0');
  });

  it('keeps the dialog mounted for the exit window, then unmounts', async () => {
    const { rerender } = render(
      <Dialog open animate onOpenChange={vi.fn()} title="Fading">
        body
      </Dialog>
    );
    rerender(
      <Dialog open={false} animate onOpenChange={vi.fn()} title="Fading">
        body
      </Dialog>
    );
    // Exit classes need a mounted target.
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('animate-out');
    expect(dialog.className).toContain('fade-out-0');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(), {
      timeout: 1500,
    });
  });

  it('unmounts immediately when animate is off (default)', () => {
    const { rerender } = render(
      <Dialog open onOpenChange={vi.fn()} title="Instant">
        body
      </Dialog>
    );
    rerender(
      <Dialog open={false} onOpenChange={vi.fn()} title="Instant">
        body
      </Dialog>
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});


describe('Dialog sizes, slots and compound parts', () => {
  it('applies size presets', () => {
    const { rerender } = render(
      <Dialog open onOpenChange={vi.fn()} title="Sized" size="2xl">
        body
      </Dialog>
    );
    expect(screen.getByRole('dialog')).toHaveClass('max-w-2xl');
    rerender(
      <Dialog open onOpenChange={vi.fn()} title="Sized" size="sm">
        body
      </Dialog>
    );
    expect(screen.getByRole('dialog')).toHaveClass('max-w-sm');
  });

  it('wires a composed header through DialogTitle/DialogDescription', () => {
    render(
      <Dialog
        open
        onOpenChange={vi.fn()}
        header={
          <DialogHeader>
            <DialogTitle>Publish release</DialogTitle>
          </DialogHeader>
        }
      >
        <DialogDescription>Tag and publish the workspace.</DialogDescription>
        <DialogBody>Body content</DialogBody>
      </Dialog>
    );
    const dialog = screen.getByRole('dialog', { name: 'Publish release' });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('renders the footer slot inside the panel', () => {
    render(
      <Dialog
        open
        onOpenChange={vi.fn()}
        title="Confirm"
        footer={<DialogFooter><button type="button">Save</button></DialogFooter>}
      >
        body
      </Dialog>
    );
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('caps and scrolls the body when scrollable', () => {
    render(
      <Dialog open onOpenChange={vi.fn()} title="Long" scrollable>
        <p>scrollable body</p>
      </Dialog>
    );
    const body = screen.getByText('scrollable body').parentElement!;
    expect(body.className).toContain('max-h-[60vh]');
    expect(body.className).toContain('overflow-y-auto');
  });
});
