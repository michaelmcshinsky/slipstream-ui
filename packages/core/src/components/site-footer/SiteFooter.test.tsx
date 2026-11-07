import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { SiteFooter } from './SiteFooter';

describe('SiteFooter', () => {
  it('renders columns, external links and the legal bar', () => {
    render(
      <SiteFooter
        brand={<span>Acme</span>}
        tagline="Ship faster."
        columns={[
          { title: 'Product', links: [{ label: 'Docs', href: '/docs' }, { label: 'GitHub', href: 'https://github.com/x', external: true }] },
          { title: 'Legal', links: [{ label: 'Privacy', href: '/privacy' }] },
        ]}
        legal={<span>© 2026 Acme</span>}
      />
    );
    expect(screen.getByText('Acme')).toBeInTheDocument();
    expect(screen.getByText('Ship faster.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Product' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByText('© 2026 Acme')).toBeInTheDocument();
  });

  it('marks the active footer link and supports router `to` props', () => {
    function RouterLink({ to, children, ...props }: { to: string; children?: React.ReactNode }) {
      return <a href={to} data-to={to} {...props}>{children}</a>;
    }
    render(
      <SiteFooter
        columns={[{ title: 'Product', links: [{ label: 'Tools', href: '/tools' }] }]}
        activeHref="/tools/sde-estimator"
        linkComponent={RouterLink}
        linkHrefProp="to"
      />
    );
    const tools = screen.getByRole('link', { name: 'Tools' });
    expect(tools).toHaveAttribute('aria-current', 'page');
    expect(tools).toHaveAttribute('data-to', '/tools');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<SiteFooter columns={[{ title: 'Docs', links: [{ label: 'Intro', href: '/docs' }] }]} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
