import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('shows the tooltip on hover after the delay', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Helpful info" delay={0}>
        <button>Hover me</button>
      </Tooltip>
    );
    await user.hover(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toHaveTextContent('Helpful info');
    });
  });

  it('hides the tooltip on unhover', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Helpful info" delay={0}>
        <button>Hover me</button>
      </Tooltip>
    );
    await user.hover(screen.getByRole('button'));
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());
    await user.unhover(screen.getByRole('button'));
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('shows on keyboard focus', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Helpful info" delay={0}>
        <button>Focus me</button>
      </Tooltip>
    );
    await user.tab();
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());
  });

  it('dismisses with Escape while focused', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Helpful info" delay={0}>
        <button>Focus me</button>
      </Tooltip>
    );
    await user.tab();
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('injects aria-describedby into the trigger when open', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Helpful info" delay={0}>
        <button>Hover me</button>
      </Tooltip>
    );
    await user.hover(screen.getByRole('button'));
    const tooltip = await screen.findByRole('tooltip');
    expect(screen.getByRole('button')).toHaveAttribute('aria-describedby', tooltip.id);
  });

  it('does not set aria-describedby when closed', () => {
    render(
      <Tooltip content="Helpful info">
        <button>Hover me</button>
      </Tooltip>
    );
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-describedby');
  });

  it('has no accessibility violations when open', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Tooltip content="Helpful info" delay={0}>
        <button>Hover me</button>
      </Tooltip>
    );
    await user.hover(screen.getByRole('button'));
    await screen.findByRole('tooltip');
    expect(await axe(container)).toHaveNoViolations();
  });
});
