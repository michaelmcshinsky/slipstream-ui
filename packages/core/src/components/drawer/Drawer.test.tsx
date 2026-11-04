import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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

describe('Drawer animate (optional slide)', () => {
  it('applies side-aware slide-in classes when animate is on', () => {
    render(
      <Drawer open animate onOpenChange={vi.fn()} title="Sliding" side="left">
        body
      </Drawer>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('animate-in');
    expect(dialog.className).toContain('slide-in-from-left');
    expect(dialog.className).toContain('motion-reduce:animate-none');
  });

  it('keeps the drawer mounted for the exit window, then unmounts', async () => {
    const { rerender } = render(
      <Drawer open animate onOpenChange={vi.fn()} title="Sliding" side="bottom">
        body
      </Drawer>
    );
    rerender(
      <Drawer open={false} animate onOpenChange={vi.fn()} title="Sliding" side="bottom">
        body
      </Drawer>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('animate-out');
    expect(dialog.className).toContain('slide-out-to-bottom');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(), {
      timeout: 1500,
    });
  });

  it('restores focus to the opener immediately on close (before exit completes)', async () => {
    const user = userEvent.setup();
    function Opener() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>open</button>
          <Drawer open={open} onOpenChange={setOpen} title="Focus" animate>
            body
          </Drawer>
        </>
      );
    }
    render(<Opener />);
    const trigger = screen.getByRole('button', { name: 'open' });
    await user.click(trigger);
    expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true);
    await user.keyboard('{Escape}');
    expect(document.activeElement).toBe(trigger);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(), {
      timeout: 1500,
    });
  });
});

describe('Drawer sizes and custom extents', () => {
  it('supports xl and 2xl presets on each axis', () => {
    const { rerender } = render(
      <Drawer open onOpenChange={vi.fn()} title="Wide" side="right" size="xl">
        body
      </Drawer>
    );
    expect(screen.getByRole('dialog')).toHaveClass('w-[40rem]');
    rerender(
      <Drawer open onOpenChange={vi.fn()} title="Wide" side="right" size="2xl">
        body
      </Drawer>
    );
    expect(screen.getByRole('dialog')).toHaveClass('w-[48rem]');
    rerender(
      <Drawer open onOpenChange={vi.fn()} title="Tall" side="bottom" size="2xl">
        body
      </Drawer>
    );
    expect(screen.getByRole('dialog')).toHaveClass('h-[48rem]');
  });

  it('accepts a pixel width and overrides the preset', () => {
    render(
      <Drawer open onOpenChange={vi.fn()} title="Custom" side="right" width={560}>
        body
      </Drawer>
    );
    expect(screen.getByRole('dialog')).toHaveStyle({ width: '560px' });
  });

  it('accepts a CSS length height for top/bottom drawers', () => {
    // Use an absolute length: jsdom 30 drops relative units (vh/vw) from the
    // CSSStyleDeclaration, so a vh assertion tests jsdom rather than us.
    render(
      <Drawer open onOpenChange={vi.fn()} title="Custom" side="top" height="320px">
        body
      </Drawer>
    );
    expect(screen.getByRole('dialog')).toHaveStyle({ height: '320px' });
  });

  it('ignores width/height that do not match the side axis', () => {
    render(
      <Drawer open onOpenChange={vi.fn()} title="Mismatch" side="bottom" width={400}>
        body
      </Drawer>
    );
    expect(screen.getByRole('dialog')).not.toHaveAttribute('style');
  });
});
