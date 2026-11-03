import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { InputGroup, InputGroupAddon } from './InputGroup';
import { Input } from '../input/Input';
import { FormField } from '../form-field/FormField';

describe('InputGroup', () => {
  it('renders a single outer shell with the nested input stripped of chrome', () => {
    const { container } = render(
      <InputGroup>
        <Input placeholder="Search" />
      </InputGroup>
    );
    const group = container.querySelector('[data-slot="input-group"]')!;
    expect(group).toHaveClass('border', 'rounded-md', 'focus-within:ring-2');
    // Chrome-stripping rides on descendant selectors in the group's class.
    expect(group.className).toContain('[&_input]:border-0');
    expect(group.className).toContain('[&_input]:bg-transparent');
    expect(group.className).toContain('[&_input]:flex-1');
    expect(group.querySelector('input')).toHaveAttribute('placeholder', 'Search');
  });

  it('places addons flush on the requested side with variant surfaces', () => {
    render(
      <InputGroup>
        <InputGroupAddon side="left" variant="muted">
          https://
        </InputGroupAddon>
        <Input defaultValue="example.com" />
        <InputGroupAddon side="right" variant="ghost">
          .com
        </InputGroupAddon>
      </InputGroup>
    );
    const left = screen.getByText('https://');
    expect(left).toHaveClass('bg-muted', 'pl-3');
    expect(left).toHaveAttribute('data-side', 'left');
    const right = screen.getByText('.com');
    expect(right).not.toHaveClass('bg-muted');
    expect(right).toHaveClass('pr-3');
  });

  it('keeps the field editable and reports typing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <InputGroup>
        <InputGroupAddon side="left">⌘K</InputGroupAddon>
        <Input aria-label="Command" onChange={onChange} />
      </InputGroup>
    );
    const input = screen.getByRole('textbox', { name: 'Command' });
    await user.type(input, 'ab');
    expect(input).toHaveValue('ab');
    expect(onChange).toHaveBeenCalled();
  });

  it('hosts interactive addons (buttons) inside the shell', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <InputGroup>
        <Input aria-label="Amount" defaultValue="10" />
        <InputGroupAddon side="right" variant="muted">
          <button type="button" onClick={onClick}>
            Go
          </button>
        </InputGroupAddon>
      </InputGroup>
    );
    await user.click(screen.getByRole('button', { name: 'Go' }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.getByRole('textbox', { name: 'Amount' })).toHaveValue('10');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <InputGroup>
        <InputGroupAddon side="left" aria-hidden="true">
          @
        </InputGroupAddon>
        <Input aria-label="Handle" placeholder="handle" />
      </InputGroup>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('FormField wiring forwarding', () => {
  it('forwards FormField id/describedby to the nested input, not the shell', () => {
    const { container } = render(
      <FormField id="ig-wire" label="Handle" hint="Lowercase only">
        <InputGroup>
          <InputGroupAddon side="left">@</InputGroupAddon>
          <Input />
        </InputGroup>
      </FormField>
    );
    const group = container.querySelector('[data-slot="input-group"]')!;
    const input = group.querySelector('input')!;
    expect(group).not.toHaveAttribute('id');
    expect(input).toHaveAttribute('id', 'ig-wire');
    expect(input).toHaveAttribute('aria-describedby', 'ig-wire-hint');
    // The visible label targets the editable control.
    const label = screen.getByText('Handle').closest('label')!;
    expect(label).toHaveAttribute('for', 'ig-wire');
    expect(screen.getByLabelText('Handle')).toBe(input);
  });

  it('keeps wiring on the shell when no known field is nested', () => {
    const { container } = render(
      <FormField id="ig-plain" label="Custom" hint="Custom child">
        <InputGroup>
          <div data-custom>custom</div>
        </InputGroup>
      </FormField>
    );
    const shell = container.querySelector('[data-slot="input-group"]')!;
    expect(shell).toHaveAttribute('id', 'ig-plain');
    expect(shell).toHaveAttribute('aria-describedby', 'ig-plain-hint');
  });
});
