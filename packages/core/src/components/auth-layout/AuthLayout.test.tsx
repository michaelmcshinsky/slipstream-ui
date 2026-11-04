import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { AuthLayout } from './AuthLayout';

describe('AuthLayout', () => {
  it('renders brand, heading, description and footer', () => {
    render(
      <AuthLayout
        title="Sign in"
        description="Welcome back."
        brand={<span>Acme</span>}
        footer={<a href="/signup">Create account</a>}
      >
        <form aria-label="Sign in form" />
      </AuthLayout>
    );
    expect(screen.getByText('Acme')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Sign in' })).toBeInTheDocument();
    expect(screen.getByText('Welcome back.')).toBeInTheDocument();
    expect(screen.getByRole('form', { name: 'Sign in form' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Create account' })).toBeInTheDocument();
  });

  it('supports size presets', () => {
    const { container } = render(<AuthLayout size="lg" title="Reset"><span /></AuthLayout>);
    expect(container.querySelector('.max-w-lg')).not.toBeNull();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<AuthLayout title="Sign up"><input aria-label="Email" /></AuthLayout>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
