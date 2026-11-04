import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Stepper } from './Stepper';

const steps = [{ label: 'Account' }, { label: 'Details', description: 'Studio info' }, { label: 'Review' }];

describe('Stepper', () => {
  it('marks the active step with aria-current and states progress in text', () => {
    render(<Stepper steps={steps} current={1} />);
    const current = screen.getByText('Details').closest('[aria-current]');
    expect(current).toHaveAttribute('aria-current', 'step');
    expect(screen.getByText('(completed)')).toBeInTheDocument();
    expect(screen.getByText('(upcoming)')).toBeInTheDocument();
  });

  it('makes steps clickable when onStepClick is provided', async () => {
    const user = userEvent.setup();
    const onStepClick = vi.fn();
    render(<Stepper steps={steps} current={0} onStepClick={onStepClick} />);
    await user.click(screen.getByRole('button', { name: /Review/ }));
    expect(onStepClick).toHaveBeenCalledWith(2);
  });

  it('supports vertical orientation', () => {
    const { container } = render(<Stepper steps={steps} current={0} orientation="vertical" />);
    expect(container.querySelector('ol')).toHaveClass('flex-col');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Stepper steps={steps} current={1} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
