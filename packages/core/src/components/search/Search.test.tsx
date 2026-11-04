import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Search, type SearchOption } from './Search';

const OPTIONS: SearchOption[] = [
  { value: 'ada', label: 'Ada Lovelace', description: 'Design', keywords: 'ada design' },
  { value: 'alan', label: 'Alan Turing', description: 'Platform', keywords: 'alan platform' },
  { value: 'grace', label: 'Grace Hopper', description: 'Infra', keywords: 'grace infra' },
];

describe('Search', () => {
  it('opens with the full option set on focus', () => {
    render(<Search options={OPTIONS} aria-label="Assign to" />);
    const input = screen.getByRole('combobox', { name: 'Assign to' });
    fireEvent.focus(input);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('filters options while typing', () => {
    render(<Search options={OPTIONS} aria-label="Assign to" />);
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'alan' } });
    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.getByRole('option')).toHaveTextContent('Alan Turing');
  });

  it('shows the empty state when nothing matches', () => {
    render(<Search options={OPTIONS} aria-label="Assign to" emptyText="No people found" />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'zzz' } });
    expect(screen.queryAllByRole('option')).toHaveLength(0);
    expect(screen.getByText('No people found')).toBeInTheDocument();
  });

  it('selects via click and reports the value', () => {
    const onValueChange = vi.fn();
    render(<Search options={OPTIONS} aria-label="Assign to" onValueChange={onValueChange} />);
    fireEvent.focus(screen.getByRole('combobox'));
    fireEvent.click(screen.getByRole('option', { name: /Ada Lovelace/ }));
    expect(onValueChange).toHaveBeenCalledWith('ada');
    expect(screen.getByRole('combobox')).toHaveValue('Ada Lovelace');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('supports keyboard selection with ArrowDown + Enter', () => {
    const onValueChange = vi.fn();
    render(<Search options={OPTIONS} aria-label="Assign to" onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input).toHaveAttribute('aria-activedescendant');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onValueChange).toHaveBeenCalledWith('ada');
  });

  it('closes with Escape without selecting', () => {
    const onValueChange = vi.fn();
    render(<Search options={OPTIONS} aria-label="Assign to" onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('has no accessibility violations while open', async () => {
    const { container } = render(<Search options={OPTIONS} aria-label="Assign to" />);
    fireEvent.focus(screen.getByRole('combobox'));
    expect(await axe(container)).toHaveNoViolations();
  });
});


describe('Search controlled value', () => {
  it('follows the controlled value and clears when set to null', () => {
    const options = [
      { value: 'a', label: 'Alpha' },
      { value: 'b', label: 'Beta' },
    ];
    const { rerender } = render(<Search options={options} value="a" aria-label="Pick" />);
    expect(screen.getByRole('combobox')).toHaveValue('Alpha');
    rerender(<Search options={options} value="b" aria-label="Pick" />);
    expect(screen.getByRole('combobox')).toHaveValue('Beta');
    rerender(<Search options={options} value={null} aria-label="Pick" />);
    expect(screen.getByRole('combobox')).toHaveValue('');
  });
});
