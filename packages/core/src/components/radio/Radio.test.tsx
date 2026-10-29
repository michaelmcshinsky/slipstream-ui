import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Radio, RadioGroup, RadioGroupItem } from './Radio';

describe('Radio', () => {
  it('renders a native radio input', () => {
    render(<Radio name="group" value="a" />);
    expect(screen.getByRole('radio')).toBeInTheDocument();
  });

  it('calls onCheckedChange when selected', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Radio name="g" value="a" onCheckedChange={onCheckedChange} />);
    await user.click(screen.getByRole('radio'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Radio name="g" value="a" aria-label="Option A" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('RadioGroup', () => {
  it('renders a group with a legend', () => {
    render(
      <RadioGroup name="plan" legend="Choose a plan">
        <RadioGroupItem value="free" label="Free" />
        <RadioGroupItem value="pro" label="Pro" />
      </RadioGroup>
    );
    expect(screen.getByRole('group')).toHaveAccessibleName('Choose a plan');
    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });

  it('selects the matching item by default', () => {
    render(
      <RadioGroup name="plan" defaultValue="pro">
        <RadioGroupItem value="free" label="Free" />
        <RadioGroupItem value="pro" label="Pro" />
      </RadioGroup>
    );
    const [free, pro] = screen.getAllByRole('radio');
    expect(free).not.toBeChecked();
    expect(pro).toBeChecked();
  });

  it('moves selection and calls onValueChange', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup name="plan" defaultValue="free" onValueChange={onValueChange}>
        <RadioGroupItem value="free" label="Free" />
        <RadioGroupItem value="pro" label="Pro" />
      </RadioGroup>
    );
    await user.click(screen.getByLabelText('Pro'));
    expect(onValueChange).toHaveBeenCalledWith('pro');
    expect(screen.getByLabelText('Pro')).toBeChecked();
  });

  it('supports arrow-key navigation like native radios', async () => {
    const user = userEvent.setup();
    render(
      <RadioGroup name="plan" defaultValue="free">
        <RadioGroupItem value="free" label="Free" />
        <RadioGroupItem value="pro" label="Pro" />
      </RadioGroup>
    );
    await user.tab();
    expect(screen.getByLabelText('Free')).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByLabelText('Pro')).toBeChecked();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <RadioGroup name="plan" legend="Choose a plan">
        <RadioGroupItem value="free" label="Free" />
        <RadioGroupItem value="pro" label="Pro" />
      </RadioGroup>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
