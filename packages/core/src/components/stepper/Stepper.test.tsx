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

  it('centers a title vertically when the step has no description', () => {
    const { container } = render(<Stepper steps={steps} current={0} />);
    const rows = container.querySelectorAll('li > button, li > div[aria-current], li > div');
    // Account has no description, so marker and title are centred; Details has
    // a description and stays top aligned.
    expect(rows[0]).toHaveClass('items-center');
    expect(rows[1]).toHaveClass('items-start');
  });

  it('supports labels below the markers and a compact dots variant', () => {
    const { container } = render(
      <Stepper steps={steps} current={1} labelPlacement="below" variant="dots" size="sm" />
    );
    const row = container.querySelector('li > div[aria-current]');
    expect(row).toHaveClass('flex-col');
    expect(container.textContent).not.toContain('1');
    expect(container.querySelectorAll('li')[0]).toHaveClass('flex-1');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Stepper steps={steps} current={1} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
