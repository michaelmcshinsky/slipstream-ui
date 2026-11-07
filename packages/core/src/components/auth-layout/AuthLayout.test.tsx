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

describe('split variant', () => {
  it('renders the aside after the form', () => {
    const { container } = render(
      <AuthLayout variant="split" aside={<p>Trusted by teams</p>} title="Sign in">
        <form aria-label="Sign in form" />
      </AuthLayout>
    );
    const form = screen.getByRole('form', { name: 'Sign in form' });
    const aside = container.querySelector('aside');
    expect(aside).not.toBeNull();
    expect(screen.getByText('Trusted by teams')).toBeInTheDocument();
    expect(
      form.compareDocumentPosition(aside!) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it('falls back to centered when the aside is omitted', () => {
    const { container } = render(
      <AuthLayout variant="split" title="Sign in">
        <span />
      </AuthLayout>
    );
    expect(container.querySelector('aside')).toBeNull();
    expect(container.firstChild).toHaveClass('justify-center');
  });

  it('ignores the aside in the centered variant', () => {
    render(
      <AuthLayout aside={<p>Hidden panel</p>} title="Sign in">
        <span />
      </AuthLayout>
    );
    expect(screen.queryByText('Hidden panel')).not.toBeInTheDocument();
  });

  it('has no accessibility violations with an aside', async () => {
    const { container } = render(
      <AuthLayout variant="split" aside={<p>Quote</p>} title="Sign up">
        <input aria-label="Email" />
      </AuthLayout>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
