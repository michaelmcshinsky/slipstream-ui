import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { ArticleCard } from './ArticleCard';

describe('ArticleCard', () => {
  it('renders a linked article with eyebrow, copy and metadata', () => {
    render(
      <ArticleCard
        href="/articles/exit-planning"
        eyebrow="Advisors"
        title="The 2026 guide"
        description="What buyers are looking for."
        meta="8 min read"
        media={<img src="/cover.jpg" alt="Article cover" />}
      />
    );
    expect(screen.getByRole('link', { name: /The 2026 guide/ })).toHaveAttribute('href', '/articles/exit-planning');
    expect(screen.getByText('Advisors')).toBeInTheDocument();
    expect(screen.getByText('8 min read')).toBeInTheDocument();
    expect(screen.getByAltText('Article cover')).toBeInTheDocument();
  });

  it('supports a custom router link component', () => {
    const RouterLink = ({ href, children, ...props }: { href: string; children: ReactNode }) => (
      <a href={href} data-router="true" {...props}>
        {children}
      </a>
    );
    render(<ArticleCard href="/post" title="Post" linkComponent={RouterLink} />);
    expect(screen.getByRole('link', { name: 'Post' })).toHaveAttribute('data-router', 'true');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<ArticleCard href="/post" title="Post" description="Copy" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
