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

  it('supports controlled value with onValueChange', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    function Controlled() {
      const [value, setValue] = useState<string | string[]>('default');
      return (
        <Select
          options={options}
          label="Size"
          value={value}
          onValueChange={(next) => {
            setValue(next);
            onValueChange(next);
          }}
        />
      );
    }
    render(<Controlled />);
    await user.selectOptions(screen.getByRole('combobox', { name: 'Size' }), 'sm');
    expect(onValueChange).toHaveBeenCalledWith('sm');
    expect(screen.getByRole('combobox', { name: 'Size' })).toHaveValue('sm');
  });

  it('calls onChange with the native event for react-hook-form compatibility', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select options={options} aria-label="Size" onChange={onChange} />);
    await user.selectOptions(screen.getByRole('combobox', { name: 'Size' }), 'sm');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].target.value).toBe('sm');
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


describe('Select groups, placeholder and multiple', () => {
  it('renders optgroups with headings', () => {
    render(
      <Select
        label="Plan"
        placeholder="Choose a plan"
        groups={[
          { label: 'Individual', options: [{ value: 'free', label: 'Free' }, { value: 'pro', label: 'Pro' }] },
          { label: 'Business', options: [{ value: 'team', label: 'Team' }] },
        ]}
      />
    );
    const groups = screen.getAllByRole('group');
    expect(groups).toHaveLength(2);
    expect(groups[0]).toHaveAttribute('label', 'Individual');
    expect(screen.getByRole('option', { name: 'Choose a plan' })).toBeDisabled();
  });

  it('supports native multi-select with a string[] contract', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Select
        label="Channels"
        multiple
        value={['email']}
        onValueChange={onValueChange}
        options={[
          { value: 'email', label: 'Email' },
          { value: 'slack', label: 'Slack' },
        ]}
      />
    );
    await user.selectOptions(screen.getByRole('listbox', { name: 'Channels' }), ['slack']);
    expect(onValueChange).toHaveBeenLastCalledWith(['email', 'slack']);
  });
});

describe('Select children, precedence and sizing', () => {
  it('renders native option children when no options/groups are given', () => {
    render(
      <Select label="State" defaultValue="ut">
        <option value="ut">Utah</option>
        <option value="id">Idaho</option>
      </Select>
    );
    const select = screen.getByRole('combobox', { name: 'State' });
    expect(select).toHaveValue('ut');
    expect(screen.getByRole('option', { name: 'Idaho' })).toBeInTheDocument();
  });

  it('lets options take precedence over children', () => {
    render(
      <Select label="State" options={[{ value: 'co', label: 'Colorado' }]}>
        <option value="ut">Utah</option>
      </Select>
    );
    expect(screen.getByRole('option', { name: 'Colorado' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Utah' })).not.toBeInTheDocument();
  });

  it('fills its container like Input does', () => {
    render(<Select label="State" options={[{ value: 'ut', label: 'Utah' }]} />);
    const select = screen.getByRole('combobox', { name: 'State' });
    expect(select).toHaveClass('w-full');
    expect(select.parentElement).toHaveClass('w-full');
  });
});
