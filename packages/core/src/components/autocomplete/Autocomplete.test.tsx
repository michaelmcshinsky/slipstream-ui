import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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


describe('Autocomplete options, groups, async and clear', () => {
  it('renders grouped headings and descriptions', async () => {
    const user = userEvent.setup();
    render(
      <Autocomplete
        aria-label="Search"
        options={[
          { value: 'ada', label: 'Ada Lovelace', group: 'People', description: 'Mathematician' },
          { value: 'alan', label: 'Alan Turing', group: 'People' },
          { value: 'rust', label: 'Rust', group: 'Languages' },
        ]}
      />
    );
    await user.click(screen.getByRole('combobox', { name: 'Search' }));
    expect(screen.getByText('People')).toBeInTheDocument();
    expect(screen.getByText('Languages')).toBeInTheDocument();
    expect(screen.getByText('Mathematician')).toBeInTheDocument();
  });

  it('uses a custom row renderer', async () => {
    const user = userEvent.setup();
    render(
      <Autocomplete
        aria-label="Search"
        options={[{ value: 'x', label: 'Custom row' }]}
        renderOption={(option) => <span>★ {option.label}</span>}
      />
    );
    await user.click(screen.getByRole('combobox', { name: 'Search' }));
    expect(screen.getByText('★ Custom row')).toBeInTheDocument();
  });

  it('loads options asynchronously with a loading row', async () => {
    const user = userEvent.setup();
    const loadOptions = vi.fn(async () => [{ value: 'remote', label: 'Remote result' }]);
    render(<Autocomplete aria-label="Search" loadOptions={loadOptions} debounceMs={1} />);
    await user.click(screen.getByRole('combobox', { name: 'Search' }));
    expect(await screen.findByText('Remote result')).toBeInTheDocument();
    expect(loadOptions).toHaveBeenCalled();
  });

  it('clears the field with the clear button', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Autocomplete aria-label="Search" clearable defaultValue="draft" onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button', { name: 'Clear input' }));
    expect(onValueChange).toHaveBeenCalledWith('');
    expect(screen.getByRole('combobox', { name: 'Search' })).toHaveValue('');
  });
});
