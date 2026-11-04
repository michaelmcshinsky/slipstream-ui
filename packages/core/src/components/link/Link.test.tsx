import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Link } from './Link';

describe('Link', () => {
  it('renders an anchor with the default variant', () => {
    render(<Link href="/docs">Docs</Link>);
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveAttribute('href', '/docs');
    expect(link).toHaveClass('text-primary');
  });

  it('auto-detects external URLs and adds rel/noopener', () => {
    render(<Link href="https://example.com">Example</Link>);
    const link = screen.getByRole('link', { name: /Example/ });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByText('(opens in a new tab)')).toHaveClass('sr-only');
  });

  it('never opens mailto/tel in a new tab', () => {
    render(<Link href="mailto:hi@example.com">Mail</Link>);
    expect(screen.getByRole('link', { name: 'Mail' })).not.toHaveAttribute('target');
  });

  it('can opt out of external handling', () => {
    render(
      <Link href="https://example.com" external={false}>
        Stay
      </Link>
    );
    const link = screen.getByRole('link', { name: 'Stay' });
    expect(link).not.toHaveAttribute('target');
    expect(screen.queryByText('(opens in a new tab)')).not.toBeInTheDocument();
  });

  it('supports asChild with a router link', () => {
    function RouterLink({ href, children, ...props }: React.ComponentProps<'a'>) {
      return (
        <a data-router href={href} {...props}>
          {children}
        </a>
      );
    }
    render(
      <Link asChild variant="underline">
        <RouterLink href="/posts">Posts</RouterLink>
      </Link>
    );
    const link = screen.getByRole('link', { name: 'Posts' });
    expect(link).toHaveAttribute('data-router');
    expect(link).toHaveClass('underline');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Link href="/docs">Docs</Link>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
