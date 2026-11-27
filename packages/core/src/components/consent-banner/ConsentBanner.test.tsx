import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { ConsentBanner } from './ConsentBanner';

describe('ConsentBanner', () => {
  it('renders a labelled region with default actions', async () => {
    const { container } = render(
      <ConsentBanner onAccept={vi.fn()} onDecline={vi.fn()}>
        We use cookies for analytics.
      </ConsentBanner>
    );
    expect(screen.getByRole('region', { name: 'Cookie consent' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Accept' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Decline' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Manage' })).not.toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('fires onAccept, onDecline and onManage', async () => {
    const user = userEvent.setup();
    const onAccept = vi.fn();
    const onDecline = vi.fn();
    const onManage = vi.fn();
    render(
      <ConsentBanner
        title="We use cookies"
        onAccept={onAccept}
        onDecline={onDecline}
        onManage={onManage}
      >
        Body copy
      </ConsentBanner>
    );
    await user.click(screen.getByRole('button', { name: 'Accept' }));
    await user.click(screen.getByRole('button', { name: 'Decline' }));
    await user.click(screen.getByRole('button', { name: 'Manage' }));
    expect(onAccept).toHaveBeenCalledTimes(1);
    expect(onDecline).toHaveBeenCalledTimes(1);
    expect(onManage).toHaveBeenCalledTimes(1);
  });

  it('supports custom labels and region name', () => {
    render(
      <ConsentBanner
        label="Datenschutz"
        acceptLabel="Alle akzeptieren"
        declineLabel="Ablehnen"
        onAccept={vi.fn()}
        onDecline={vi.fn()}
      />
    );
    expect(screen.getByRole('region', { name: 'Datenschutz' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Alle akzeptieren' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ablehnen' })).toBeInTheDocument();
  });
});
