import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Drawer } from './Drawer';

function BaseDrawer({ onOpenChange = vi.fn() }: { onOpenChange?: (open: boolean) => void }) {
  return (
    <Drawer open onOpenChange={onOpenChange} title="Filter results" description="Narrow by status">
      <button type="button">Apply</button>
    </Drawer>
  );
}

describe('Drawer', () => {
  it('renders a labelled modal dialog when open and nothing when closed', () => {
    const { rerender } = render(<BaseDrawer />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByRole('heading', { name: 'Filter results' })).toBeInTheDocument();
    rerender(<Drawer open={false} onOpenChange={vi.fn()} title="Filter results">{null}</Drawer>);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('applies side and size classes', () => {
    const { rerender } = render(<Drawer open onOpenChange={vi.fn()} title="T" side="left" size="lg">{null}</Drawer>);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('left-0', 'w-[32rem]');
    rerender(<Drawer open onOpenChange={vi.fn()} title="T" side="bottom" size="sm">{null}</Drawer>);
    expect(screen.getByRole('dialog')).toHaveClass('bottom-0', 'h-48');
  });

  it('hides the close button with showClose={false} but Escape still closes', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Drawer open onOpenChange={onOpenChange} title="No close" showClose={false}>
        <button type="button">Body</button>
      </Drawer>
    );
    expect(screen.queryByRole('button', { name: 'Close drawer' })).not.toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('closes on backdrop mousedown (configurable)', () => {
    const onOpenChange = vi.fn();
    render(<BaseDrawer onOpenChange={onOpenChange} />);
    // The drawer portals to body — query the backdrop there.
    const backdrop = document.querySelector('div.fixed.inset-0') as HTMLElement;
    expect(backdrop).not.toBeNull();
    backdrop.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('moves focus into the drawer on open', () => {
    render(<BaseDrawer />);
    const dialog = screen.getByRole('dialog');
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<BaseDrawer />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
