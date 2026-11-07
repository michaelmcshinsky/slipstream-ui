import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { MultiSelect } from './MultiSelect';

const OPTIONS = [
  { value: 'tech', label: 'Technology' },
  { value: 'health', label: 'Healthcare' },
  { value: 'industrial', label: 'Industrials', description: 'Manufacturing and distribution' },
];

describe('MultiSelect', () => {
  it('opens the panel and toggles options into chips', () => {
    const onValueChange = vi.fn();
    render(<MultiSelect label="Industry" options={OPTIONS} onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Industry' }));
    fireEvent.click(screen.getByRole('checkbox', { name: /Technology/ }));
    expect(onValueChange).toHaveBeenCalledWith(['tech']);
    expect(screen.getByRole('button', { name: 'Remove Technology' })).toBeInTheDocument();
  });

  it('filters options by search text', () => {
    render(<MultiSelect label="Industry" options={OPTIONS} />);
    fireEvent.click(screen.getByRole('button', { name: 'Industry' }));
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search options' }), {
      target: { value: 'health' },
    });
    expect(screen.getByRole('checkbox', { name: /Healthcare/ })).toBeInTheDocument();
    expect(screen.queryByRole('checkbox', { name: /Technology/ })).not.toBeInTheDocument();
  });

  it('selects all and clears', () => {
    const onValueChange = vi.fn();
    render(<MultiSelect label="Industry" options={OPTIONS} onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Industry' }));
    fireEvent.click(screen.getByRole('button', { name: 'Select all' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['tech', 'health', 'industrial']);
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(onValueChange).toHaveBeenLastCalledWith([]);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<MultiSelect label="Industry" options={OPTIONS} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
