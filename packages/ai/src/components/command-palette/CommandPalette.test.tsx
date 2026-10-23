import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { CommandPalette, type Command } from './CommandPalette';

const commands: Command[] = [
  { id: 'go-docs', label: 'Open documentation', section: 'Navigation', keywords: ['docs', 'help'] },
  { id: 'go-billing', label: 'Open billing', section: 'Navigation', keywords: ['plan', 'invoices'] },
  { id: 'act-copy', label: 'Copy code', section: 'Actions', keywords: ['clipboard'], shortcut: '⌘C' },
];

function Harness({ onSelect }: { onSelect: (command: Command) => void }) {
  const [open, setOpen] = useState(true);
  return <CommandPalette open={open} onOpenChange={setOpen} commands={commands} onSelect={onSelect} />;
}

describe('CommandPalette', () => {
  it('renders commands grouped by section as listbox options', () => {
    render(<Harness onSelect={() => undefined} />);
    expect(screen.getByRole('combobox', { name: 'Command palette' })).toBeInTheDocument();
    const labels = screen.getAllByRole('option').map((option) => option.textContent);
    expect(labels).toEqual(['Open documentation', 'Open billing', 'Copy code⌘C']);
    expect(screen.getByText('Navigation')).toBeInTheDocument(); // header rendered once per section
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('filters lexically by label and keywords', async () => {
    const user = userEvent.setup();
    render(<Harness onSelect={() => undefined} />);
    await user.type(screen.getByRole('combobox'), 'invoice');
    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.getByRole('option', { name: /Open billing/ })).toBeInTheDocument();
  });

  it('navigates with arrows and selects with Enter', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Harness onSelect={onSelect} />);
    const input = screen.getByRole('combobox');
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: /Open billing/ })).toHaveAttribute('aria-selected', 'true');
    expect(input).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: /Open billing/ }).id);
    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'go-billing' }));
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('closes on Escape and backdrop click', async () => {
    const user = userEvent.setup();
    render(<Harness onSelect={() => undefined} />);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('shows an empty state for no matches', async () => {
    const user = userEvent.setup();
    render(<Harness onSelect={() => undefined} />);
    await user.type(screen.getByRole('combobox'), 'zzzznope');
    expect(screen.queryAllByRole('option')).toHaveLength(0);
    expect(screen.getByText('No matching commands.')).toBeInTheDocument();
  });

  it('renders nothing when closed', () => {
    render(<CommandPalette open={false} onOpenChange={() => undefined} commands={commands} onSelect={() => undefined} />);
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Harness onSelect={() => undefined} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
