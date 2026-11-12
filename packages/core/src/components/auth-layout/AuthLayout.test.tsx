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

describe('AuthLayout migration aliases', () => {
  it('reads subtitle and logo when description and brand are absent', () => {
    render(<AuthLayout title="Sign in" subtitle="Welcome back." logo={<span>Acme</span>} />);
    expect(screen.getByText('Welcome back.')).toBeInTheDocument();
    expect(screen.getByText('Acme')).toBeInTheDocument();
  });

  it('prefers description and brand when both forms are passed', () => {
    render(
      <AuthLayout
        title="Sign in"
        description="Canonical line"
        subtitle="Alias line"
        brand={<span>Canonical mark</span>}
        logo={<span>Alias mark</span>}
      />
    );
    expect(screen.getByText('Canonical line')).toBeInTheDocument();
    expect(screen.queryByText('Alias line')).not.toBeInTheDocument();
    expect(screen.getByText('Canonical mark')).toBeInTheDocument();
    expect(screen.queryByText('Alias mark')).not.toBeInTheDocument();
  });
});

describe('AuthLayout maxWidth', () => {
  it('overrides the size preset with a pixel width', () => {
    const { container } = render(<AuthLayout title="Sign in" maxWidth={420} />);
    expect(container.querySelector('[style*="max-width: 420px"]')).not.toBeNull();
  });

  it('accepts any CSS width', () => {
    const { container } = render(<AuthLayout title="Sign in" maxWidth="26rem" />);
    expect(container.querySelector('[style*="max-width: 26rem"]')).not.toBeNull();
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
