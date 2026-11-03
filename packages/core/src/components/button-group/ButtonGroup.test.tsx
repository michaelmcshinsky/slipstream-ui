import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { ButtonGroup } from './ButtonGroup';
import { Button } from '../button/Button';

describe('ButtonGroup', () => {
  it('joins children into one outline (no gap, squared middles)', () => {
    const { container } = render(
      <ButtonGroup>
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
    );
    const group = container.querySelector('[data-slot="button-group"]')!;
    // The group owns the single outline and clips the outer radius.
    expect(group).toHaveClass('overflow-hidden', 'rounded-md', 'border', 'border-border');
    expect(group.querySelectorAll('button')).toHaveLength(3);
    expect(group.className).toContain('[&>*]:rounded-none');
    expect(group.className).toContain('[&>*]:border-0');
    expect(group).toHaveClass('divide-x', 'divide-border');
  });

  it('vertical orientation stacks with collapsed borders', () => {
    const { container } = render(
      <ButtonGroup orientation="vertical">
        <Button>Up</Button>
        <Button>Down</Button>
      </ButtonGroup>
    );
    const group = container.querySelector('[data-slot="button-group"]')!;
    expect(group).toHaveClass('flex-col');
    expect(group).toHaveClass('divide-y', 'divide-border');
  });

  it('exposes a group role and forwards aria-label', () => {
    render(
      <ButtonGroup aria-label="View mode">
        <Button>List</Button>
        <Button>Grid</Button>
      </ButtonGroup>
    );
    expect(screen.getByRole('group', { name: 'View mode' })).toBeInTheDocument();
  });

  it('keeps every segment clickable', async () => {
    const user = userEvent.setup();
    const first = vi.fn();
    const second = vi.fn();
    render(
      <ButtonGroup>
        <Button onClick={first}>A</Button>
        <Button onClick={second}>B</Button>
      </ButtonGroup>
    );
    await user.click(screen.getByRole('button', { name: 'A' }));
    await user.click(screen.getByRole('button', { name: 'B' }));
    expect(first).toHaveBeenCalledOnce();
    expect(second).toHaveBeenCalledOnce();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <ButtonGroup aria-label="Zoom">
        <Button>−</Button>
        <Button>+</Button>
      </ButtonGroup>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
