import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { Select } from './Select';

const options = [
  { value: 'default', label: 'Default' },
  { value: 'sm', label: 'Small' },
  { value: 'lg', label: 'Large', disabled: true },
];

describe('Select', () => {
  it('renders options and an accessible label', () => {
    render(<Select options={options} label="Size" />);
    const select = screen.getByRole('combobox', { name: 'Size' });
    expect(screen.getByRole('option', { name: 'Default' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Large' })).toBeDisabled();
    expect(select).toBeInTheDocument();
  });

  it('supports uncontrolled defaultValue', () => {
    render(<Select options={options} defaultValue="sm" aria-label="Size" />);
    expect(screen.getByRole('combobox', { name: 'Size' })).toHaveValue('sm');
  });

  it('supports controlled value with onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    function Controlled() {
      const [value, setValue] = useState('default');
      return (
        <Select
          options={options}
          label="Size"
          value={value}
          onChange={(next) => {
            setValue(next);
            onChange(next);
          }}
        />
      );
    }
    render(<Controlled />);
    await user.selectOptions(screen.getByRole('combobox', { name: 'Size' }), 'sm');
    expect(onChange).toHaveBeenCalledWith('sm');
    expect(screen.getByRole('combobox', { name: 'Size' })).toHaveValue('sm');
  });

  it('forwards arbitrary select props (name, disabled)', () => {
    render(<Select options={options} name="size" disabled aria-label="Size" />);
    expect(screen.getByRole('combobox', { name: 'Size' })).toHaveAttribute('name', 'size');
    expect(screen.getByRole('combobox', { name: 'Size' })).toBeDisabled();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Select options={options} label="Size" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
