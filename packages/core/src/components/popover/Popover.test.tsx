import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';

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
