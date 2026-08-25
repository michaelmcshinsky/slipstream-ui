import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Suggestions } from './Suggestion';

const suggestions = [
  { id: '1', text: 'Explain recursion' },
  { id: '2', text: 'Write a haiku', type: 'action' as const },
  { id: '3', text: 'Summarize this page' },
];

describe('Suggestions', () => {
  it('renders every suggestion as a button', () => {
    render(<Suggestions suggestions={suggestions} />);
    expect(screen.getByRole('button', { name: 'Explain recursion' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Write a haiku' })).toBeInTheDocument();
  });

  it('calls onSelect with the clicked suggestion', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    render(<Suggestions suggestions={suggestions} onSelect={handleSelect} />);
    await user.click(screen.getByRole('button', { name: 'Write a haiku' }));
    expect(handleSelect).toHaveBeenCalledWith(suggestions[1]);
  });

  it('limits visible suggestions to maxDisplay', () => {
    render(<Suggestions suggestions={suggestions} maxDisplay={2} />);
    expect(screen.getByRole('button', { name: 'Explain recursion' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Summarize this page' })).not.toBeInTheDocument();
  });

  it('renders nothing for an empty list', () => {
    const { container } = render(<Suggestions suggestions={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Suggestions suggestions={suggestions} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
