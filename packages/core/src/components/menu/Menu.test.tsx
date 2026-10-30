import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Menu, MenuContent, MenuItem, MenuLabel, MenuSeparator, MenuTrigger } from './Menu';

function BasicMenu({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  return (
    <Menu onOpenChange={onOpenChange}>
      <MenuTrigger>Options</MenuTrigger>
      <MenuContent>
        <MenuLabel>Actions</MenuLabel>
        <MenuItem>Profile</MenuItem>
        <MenuItem>Settings</MenuItem>
        <MenuSeparator />
        <MenuItem destructive>Sign out</MenuItem>
      </MenuContent>
    </Menu>
  );
}

describe('Menu', () => {
  it('renders the trigger with menu semantics', () => {
    render(<BasicMenu />);
    const trigger = screen.getByRole('button', { name: 'Options' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens the menu and shows items', async () => {
    const user = userEvent.setup();
    render(<BasicMenu />);
    await user.click(screen.getByRole('button', { name: 'Options' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getAllByRole('menuitem')).toHaveLength(3);
  });

  it('closes the menu after selecting an item', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Menu>
        <MenuTrigger>Options</MenuTrigger>
        <MenuContent>
          <MenuItem onClick={onClick}>Profile</MenuItem>
        </MenuContent>
      </Menu>
    );
    await user.click(screen.getByRole('button', { name: 'Options' }));
    await user.click(screen.getByRole('menuitem', { name: 'Profile' }));
    expect(onClick).toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    render(<BasicMenu />);
    await user.click(screen.getByRole('button', { name: 'Options' }));
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });

  it('navigates items with arrow keys', async () => {
    const user = userEvent.setup();
    render(<BasicMenu />);
    await user.click(screen.getByRole('button', { name: 'Options' }));
    // First item is focused automatically when the menu opens.
    expect(screen.getAllByRole('menuitem')[0]).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getAllByRole('menuitem')[1]).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getAllByRole('menuitem')[2]).toHaveFocus();
  });

  it('calls onOpenChange', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<BasicMenu onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole('button', { name: 'Options' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('has no accessibility violations', async () => {
    const user = userEvent.setup();
    const { container } = render(<BasicMenu />);
    await user.click(screen.getByRole('button', { name: 'Options' }));
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());
    expect(await axe(container)).toHaveNoViolations();
  });
});
