import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { RadioGroup } from './Radio';
import { RadioCard } from './RadioCard';

describe('RadioCard', () => {
  it('renders title and description inside a clickable section', () => {
    render(
      <RadioGroup name="plan" legend="Plan">
        <RadioCard value="free" title="Free" description="For side projects" />
      </RadioGroup>
    );
    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText('For side projects')).toBeInTheDocument();
    // The native circle stays in the accessibility tree, hidden visually.
    const radio = screen.getByRole('radio');
    expect(radio).toBeInTheDocument();
    expect(radio.className).toContain('sr-only');
  });

  it('selects through the enclosing RadioGroup on click', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup name="plan" onValueChange={onValueChange}>
        <RadioCard value="free" title="Free" />
        <RadioCard value="pro" title="Pro" />
      </RadioGroup>
    );
    await user.click(screen.getByText('Pro'));
    expect(onValueChange).toHaveBeenCalledWith('pro');
    expect(screen.getByRole('radio', { name: 'Pro' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Free' })).not.toBeChecked();
  });

  it('marks the checked card and applies the selected border classes', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <RadioGroup name="plan" defaultValue="free">
        <RadioCard value="free" title="Free" />
        <RadioCard value="pro" title="Pro" />
      </RadioGroup>
    );
    const freeCard = screen.getByText('Free').closest('label')!;
    expect(freeCard.className).toContain('has-[:checked]:border-primary');
    await user.click(screen.getByText('Pro'));
    const proCard = screen.getByText('Pro').closest('label')!;
    expect(proCard.className).toContain('has-[:checked]:border-primary');
    expect(container.querySelectorAll('label')).toHaveLength(2);
  });

  it('rounded=false drops the outer radius', () => {
    render(
      <RadioGroup name="plan">
        <RadioCard value="a" title="Square" rounded={false} />
        <RadioCard value="b" title="Round" />
      </RadioGroup>
    );
    expect(screen.getByText('Square').closest('label')!.className).toContain('rounded-none');
    expect(screen.getByText('Round').closest('label')!.className).toContain('rounded-lg');
  });

  it('supports custom body content and disabled cards', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup name="plan" onValueChange={onValueChange}>
        <RadioCard value="a" title="A" disabled>
          <span>Extra detail</span>
        </RadioCard>
      </RadioGroup>
    );
    expect(screen.getByText('Extra detail')).toBeInTheDocument();
    await user.click(screen.getByText('A'));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole('radio')).toBeDisabled();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <RadioGroup name="plan" legend="Choose a plan">
        <RadioCard value="free" title="Free" description="For side projects" />
        <RadioCard value="pro" title="Pro" description="For teams" />
      </RadioGroup>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
