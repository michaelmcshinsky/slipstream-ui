import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders title, description and actions', () => {
    render(
      <EmptyState
        title="No classes yet"
        description="Create your first class to get started."
        action={<button type="button">New class</button>}
        secondaryAction={<a href="/docs">Learn more</a>}
      />
    );
    expect(screen.getByText('No classes yet')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New class' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Learn more' })).toBeInTheDocument();
  });

  it('supports a compact size', () => {
    const { container } = render(<EmptyState size="sm" title="Nothing here" />);
    expect(container.firstChild).toHaveClass('py-6');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<EmptyState title="Empty" description="Nothing to show" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
