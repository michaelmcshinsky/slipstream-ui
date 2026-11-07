import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { LinkTabs } from './LinkTabs';

const items = [
  { label: 'Overview', href: '/app', exact: true },
  { label: 'Settings', href: '/app/settings' },
  { label: 'Billing', href: '/app/billing' },
];

describe('LinkTabs', () => {
  it('marks the active route with aria-current', () => {
    render(<LinkTabs items={items} activeHref="/app/settings/profile" />);
    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Overview' })).not.toHaveAttribute('aria-current');
  });

  it('honors exact matching', () => {
    render(<LinkTabs items={items} activeHref="/app/settings" />);
    expect(screen.getByRole('link', { name: 'Overview' })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute('aria-current', 'page');
  });

  it('supports a custom link component', () => {
    const Link = ({ href, children, ...props }: React.ComponentProps<'a'>) => (
      <a href={href} data-custom="true" {...props}>
        {children}
      </a>
    );
    render(<LinkTabs items={items} activeHref="/app" linkComponent={Link} />);
    expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute('data-custom', 'true');
  });

  it('renders disabled tabs without a link', () => {
    render(
      <LinkTabs
        items={[...items, { label: 'Soon', href: '/soon', disabled: true }]}
        activeHref="/app"
      />
    );
    expect(screen.queryByRole('link', { name: 'Soon' })).not.toBeInTheDocument();
    expect(screen.getByText('Soon')).toHaveAttribute('aria-disabled', 'true');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<LinkTabs items={items} activeHref="/app" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
