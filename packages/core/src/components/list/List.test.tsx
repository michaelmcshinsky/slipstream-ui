import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { List, ListItem } from './List';

describe('List / ListItem', () => {
  it('renders semantic ul/li structure', () => {
    render(
      <List>
        <ListItem>One</ListItem>
        <ListItem>Two</ListItem>
      </List>
    );
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('wraps onClick rows in a button and keeps listitem semantics', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <List>
        <ListItem onClick={onClick}>Pressable</ListItem>
      </List>
    );
    const button = screen.getByRole('button', { name: 'Pressable' });
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });

  it('applies divided/bordered/selected classes', () => {
    render(
      <List divided bordered>
        <ListItem selected>Active</ListItem>
      </List>
    );
    expect(screen.getByRole('list')).toHaveClass('divide-y', 'border');
    expect(screen.getByText('Active').closest('li')?.firstElementChild).toHaveClass('bg-accent');
  });

  it('renders leading, trailing, and description slots', () => {
    render(
      <List>
        <ListItem leading={<span data-testid="lead" />} trailing={<span data-testid="trail" />} description="Sub-line">
          Title
        </ListItem>
      </List>
    );
    expect(screen.getByTestId('lead')).toBeInTheDocument();
    expect(screen.getByTestId('trail')).toBeInTheDocument();
    expect(screen.getByText('Sub-line')).toBeInTheDocument();
  });

  it('accepts rich content in the description slot', () => {
    render(
      <List>
        <ListItem description={<span><span data-testid="meta-dot" /> Meta line</span>}>
          Title
        </ListItem>
      </List>
    );
    expect(screen.getByTestId('meta-dot')).toBeInTheDocument();
    expect(screen.getByText('Meta line')).toBeInTheDocument();
  });

  it('disables pressable rows', () => {
    render(
      <List>
        <ListItem onClick={() => {}} disabled>
          Off
        </ListItem>
      </List>
    );
    expect(screen.getByRole('button', { name: 'Off' })).toBeDisabled();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <List bordered divided>
        <ListItem selected>Active</ListItem>
        <ListItem>Other</ListItem>
      </List>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
