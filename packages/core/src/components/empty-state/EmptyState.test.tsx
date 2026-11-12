import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
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

  it('accepts an actions alias and renders the title as a heading', () => {
    render(
      <EmptyState
        title="Nothing here"
        titleAs="h3"
        actions={<button type="button">Try again</button>}
      />
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Nothing here' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<EmptyState title="Empty" description="Nothing to show" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('action object form', () => {
  it('renders a button from { label, onClick }', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<EmptyState title="No results" action={{ label: 'Clear filters', onClick, variant: 'outline' }} />);
    const button = screen.getByRole('button', { name: 'Clear filters' });
    expect(button).toHaveClass('border');
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders a link when href is provided', () => {
    render(<EmptyState title="No results" action={{ label: 'Create one', href: '/new' }} />);
    const link = screen.getByRole('link', { name: 'Create one' });
    expect(link).toHaveAttribute('href', '/new');
    expect(screen.queryByRole('button', { name: 'Create one' })).not.toBeInTheDocument();
  });

  it('still accepts a rendered node', () => {
    render(<EmptyState title="No results" action={<button type="button">Custom</button>} />);
    expect(screen.getByRole('button', { name: 'Custom' })).toBeInTheDocument();
  });
});
