import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Reasoning } from './Reasoning';

const steps = [
  { id: 's1', content: 'Parse the question' },
  { id: 's2', content: 'Recall facts' },
];

describe('Reasoning duration and live state', () => {
  it('renders a numeric duration in the header', () => {
    render(<Reasoning steps={steps} duration={4} />);
    expect(screen.getByRole('button')).toHaveTextContent('· 4s');
  });

  it('renders a string duration verbatim', () => {
    render(<Reasoning steps={steps} duration="4 seconds" />);
    expect(screen.getByRole('button')).toHaveTextContent('· 4 seconds');
  });

  it('marks streaming reasoning with an animated indicator', () => {
    render(<Reasoning steps={steps} isStreaming />);
    expect(screen.getByText(/thinking…/)).toBeInTheDocument();
  });

  it('keeps the toggle accessible with new header content', async () => {
    const user = userEvent.setup();
    render(<Reasoning steps={steps} defaultExpanded duration={2} />);
    const toggle = screen.getByRole('button');
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
});
