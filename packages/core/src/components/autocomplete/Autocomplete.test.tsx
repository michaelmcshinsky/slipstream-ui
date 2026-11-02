import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Autocomplete } from './Autocomplete';

describe('Autocomplete', () => {
  it('reports every keystroke through onValueChange', () => {
    const onValueChange = vi.fn();
    render(
      <Autocomplete suggestions={['react', 'remix', 'astro']} onValueChange={onValueChange} aria-label="Framework" />
    );
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 're' } });
    expect(onValueChange).toHaveBeenCalledWith('re');
  });

  it('shows matching suggestions and accepts one on click', () => {
    const onValueChange = vi.fn();
    render(
      <Autocomplete suggestions={['react', 'remix', 'astro']} onValueChange={onValueChange} aria-label="Framework" defaultValue="re" />
    );
    fireEvent.focus(screen.getByRole('combobox'));
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(2); // react, remix
    fireEvent.click(screen.getByRole('option', { name: 'react' }));
    expect(onValueChange).toHaveBeenCalledWith('react');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('never offers the current value back as a suggestion', () => {
    render(
      <Autocomplete suggestions={['react', 'remix']} aria-label="Framework" defaultValue="react" />
    );
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    // The current value is the only match for its own text — excluded => empty.
    expect(screen.queryAllByRole('option')).toHaveLength(0);
    // Typing a broader query surfaces the other suggestions, minus the current value.
    fireEvent.change(input, { target: { value: 're' } });
    const labels = screen.getAllByRole('option').map((option) => option.textContent);
    expect(labels).toContain('react');
    expect(labels).toContain('remix');
  });

  it('keeps free-form text: Enter with no active suggestion does not clear the value', () => {
    const onValueChange = vi.fn();
    render(
      <Autocomplete suggestions={['react']} onValueChange={onValueChange} aria-label="Framework" defaultValue="my-own-tag" />
    );
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(input).toHaveValue('my-own-tag');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes the list with Escape', () => {
    render(<Autocomplete suggestions={['react', 'remix']} aria-label="Framework" />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('passes the native autoComplete attribute through', () => {
    render(
      <Autocomplete suggestions={[]} aria-label="Country" autoComplete="country-name" />
    );
    expect(screen.getByRole('combobox')).toHaveAttribute('autocomplete', 'country-name');
  });

  it('has no accessibility violations while open', async () => {
    const { container } = render(<Autocomplete suggestions={['react', 'remix']} aria-label="Framework" />);
    fireEvent.focus(screen.getByRole('combobox'));
    expect(await axe(container)).toHaveNoViolations();
  });
});
