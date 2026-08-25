import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Reasoning } from './Reasoning';

const steps = [
  { id: 's1', content: 'Parse the question' },
  { id: 's2', content: 'Recall relevant facts' },
  { id: 's3', content: 'Compose the answer' },
];

describe('Reasoning', () => {
  it('renders collapsed by default with an accessible toggle', () => {
    render(<Reasoning steps={steps} />);
    const toggle = screen.getByRole('button');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Parse the question')).not.toBeInTheDocument();
  });

  it('expands to reveal steps and updates aria-expanded', async () => {
    const user = userEvent.setup();
    render(<Reasoning steps={steps} />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
    for (const step of steps) {
      expect(screen.getByText(step.content)).toBeInTheDocument();
    }
  });

  it('renders expanded when defaultExpanded is true', () => {
    render(<Reasoning steps={steps} defaultExpanded />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(steps[0].content)).toBeInTheDocument();
  });

  it('renders steps directly without a toggle when collapsible is false', () => {
    // Non-collapsible mode renders steps directly without a toggle.
    render(<Reasoning steps={steps} collapsible={false} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText(steps[0].content)).toBeInTheDocument();
  });

  it('renders nothing for an empty step list', () => {
    const { container } = render(<Reasoning steps={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('has no accessibility violations when collapsed', async () => {
    const { container } = render(<Reasoning steps={steps} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no accessibility violations when expanded', async () => {
    const { container } = render(<Reasoning steps={steps} defaultExpanded />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
