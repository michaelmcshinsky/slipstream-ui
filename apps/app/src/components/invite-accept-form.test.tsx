// @vitest-environment jsdom
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InviteAcceptForm } from './invite-accept-form';

const mocks = vi.hoisted(() => ({ push: vi.fn(), refresh: vi.fn() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mocks.push, refresh: mocks.refresh }),
}));

vi.mock('next/link', () => ({
  default: function MockLink({
    href,
    children,
    ...rest
  }: { href: string; children?: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  },
}));

describe('InviteAcceptForm', () => {
  beforeEach(() => {
    mocks.push.mockReset();
    mocks.refresh.mockReset();
    vi.unstubAllGlobals();
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('posts the token and redirects to the team page on success', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { teamId: 'team_1' } }),
    } as Response);
    vi.stubGlobal('fetch', fetchMock);
    render(<InviteAcceptForm token="tok_123" />);

    fireEvent.click(screen.getByRole('button', { name: 'Accept invite' }));

    await waitFor(() => expect(mocks.push).toHaveBeenCalledWith('/dashboard/team'));
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/invites/accept',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ token: 'tok_123' }),
      }),
    );
  });

  it('surfaces API errors without redirecting', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: { message: 'This invite is invalid or has expired.' } }),
      } as Response),
    );
    render(<InviteAcceptForm token="bad" />);

    fireEvent.click(screen.getByRole('button', { name: 'Accept invite' }));

    expect((await screen.findByRole('alert')).textContent).toContain('invalid or has expired');
    expect(mocks.push).not.toHaveBeenCalled();
  });

  it('renders an invalid-link state when the token is missing', () => {
    render(<InviteAcceptForm token="" />);
    expect(screen.getByText('Invalid invite link')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Accept invite' })).toBeNull();
  });
});
