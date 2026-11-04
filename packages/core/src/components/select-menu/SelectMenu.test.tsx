import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { SelectMenu, type SelectMenuItem } from './SelectMenu';

const items: SelectMenuItem[] = [
  { value: 'free', label: 'Free', description: '1 project', group: 'Individual' },
  { value: 'pro', label: 'Pro', description: 'Unlimited', group: 'Individual' },
  { value: 'team', label: 'Team', description: 'SSO', group: 'Business' },
  { value: 'enterprise', label: 'Enterprise', disabled: true, group: 'Business' },
];

describe('SelectMenu', () => {
  it('opens a listbox with rich rows and groups', async () => {
    const user = userEvent.setup();
    render(<SelectMenu aria-label="Plan" items={items} placeholder="Choose a plan" />);
    const trigger = screen.getByRole('button', { name: 'Plan' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByText('Individual')).toBeInTheDocument();
    expect(screen.getByText('Unlimited')).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('selects a single value and closes', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<SelectMenu aria-label="Plan" items={items} onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('option', { name: /Pro/ }));
    expect(onValueChange).toHaveBeenCalledWith('pro');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Pro');
  });

  it('supports keyboard navigation and selection', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<SelectMenu aria-label="Plan" items={items} onValueChange={onValueChange} />);
    const trigger = screen.getByRole('button');
    trigger.focus();
    await user.keyboard('{ArrowDown}'); // open
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('pro');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('toggles values in multiple mode without closing', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<SelectMenu aria-label="Tags" multiple items={items} defaultValue={['free']} onValueChange={onValueChange} />);
    const trigger = screen.getByRole('button');
    expect(trigger).toHaveTextContent('Free');
    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: /Pro/ }));
    expect(onValueChange).toHaveBeenLastCalledWith(['free', 'pro']);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('2 selected');
  });

  it('skips disabled options and exposes aria-disabled', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<SelectMenu aria-label="Plan" items={items} onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button'));
    const disabled = screen.getByRole('option', { name: /Enterprise/ });
    expect(disabled).toHaveAttribute('aria-disabled', 'true');
    await user.click(disabled);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('renders custom rows and trigger content', async () => {
    const user = userEvent.setup();
    render(
      <SelectMenu
        aria-label="Plan"
        items={items}
        renderItem={(item) => <strong>★ {item.label}</strong>}
        renderValue={(selected) => <em>{selected.length ? selected[0].label : 'Pick'}</em>}
      />
    );
    expect(screen.getByRole('button')).toHaveTextContent('Pick');
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('★ Free')).toBeInTheDocument();
  });

  it('submits hidden inputs for forms', () => {
    const { container } = render(
      <form aria-label="Form">
        <SelectMenu aria-label="Plan" items={items} name="plan" value="pro" onValueChange={() => undefined} />
      </form>
    );
    expect(container.querySelector('input[type="hidden"][name="plan"]')).toHaveValue('pro');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<SelectMenu aria-label="Plan" items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
