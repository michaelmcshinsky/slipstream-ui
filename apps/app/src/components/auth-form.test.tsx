// @vitest-environment jsdom
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthForm } from './auth-form';

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

function okJson(body: unknown) {
  return { ok: true, json: async () => body } as Response;
}

describe('AuthForm', () => {
  beforeEach(() => {
    mocks.push.mockReset();
    mocks.refresh.mockReset();
    vi.unstubAllGlobals();
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('login renders accessible labels and a forgot-password link', () => {
    render(<AuthForm mode="login" />);
    expect(screen.getByLabelText('Email')).toBeTruthy();
    expect(screen.getByLabelText('Password')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Reset it' }).getAttribute('href')).toBe('/forgot-password');
    expect(screen.getByRole('link', { name: 'Create account' }).getAttribute('href')).toBe('/signup');
  });

  it('honors a safe ?next= target after login', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(okJson({ data: { ok: true } })));
    render(<AuthForm mode="login" next="/admin/users" />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => expect(mocks.push).toHaveBeenCalledWith('/admin/users'));
    expect(mocks.refresh).toHaveBeenCalled();
  });

  it('rejects unsafe ?next= targets', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(okJson({ data: { ok: true } })));
    render(<AuthForm mode="login" next="//evil.example" />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => expect(mocks.push).toHaveBeenCalledWith('/dashboard'));
  });

  it('surfaces API errors and marks fields invalid', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, json: async () => ({ error: { message: 'Bad credentials.' } }) } as Response),
    );
    render(<AuthForm mode="login" />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect((await screen.findByRole('alert')).textContent).toContain('Bad credentials.');
    expect(screen.getByLabelText('Email').getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByLabelText('Email').getAttribute('aria-describedby')).toBe('auth-error');
  });

  it('signup rejects mismatched passwords before calling the API', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    render(<AuthForm mode="signup" />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: 'different' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

    expect((await screen.findByRole('alert')).textContent).toContain('Passwords do not match.');
    expect(screen.getByLabelText('Confirm password').getAttribute('aria-invalid')).toBe('true');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('forgot mode hides the password field', () => {
    render(<AuthForm mode="forgot" />);
    expect(screen.getByLabelText('Email')).toBeTruthy();
    expect(screen.queryByLabelText('Password')).toBeNull();
    expect(screen.getByRole('button', { name: 'Send reset link' })).toBeTruthy();
  });
});
