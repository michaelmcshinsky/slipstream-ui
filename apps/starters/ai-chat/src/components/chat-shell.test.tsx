import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { ChatShell } from './chat-shell';

describe('ChatShell accessibility', () => {
  it('renders the empty state without axe violations', async () => {
    const { container } = render(<ChatShell />);
    expect(screen.getByRole('heading', { name: /ai chat starter/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/ask the agent/i)).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
