import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Dialog } from './Dialog';

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
