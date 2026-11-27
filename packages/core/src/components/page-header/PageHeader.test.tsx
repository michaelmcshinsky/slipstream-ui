import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { PageHeader } from './PageHeader';

describe('PageHeader', () => {
  it('renders a level-1 heading with description and actions', () => {
    render(
      <PageHeader
        title="Classes"
        description="Manage your weekly schedule."
        actions={<button type="button">New</button>}
        breadcrumbs={<a href="/">Home</a>}
      />
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Classes' })).toBeInTheDocument();
    expect(screen.getByText('Manage your weekly schedule.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
  });

  it('renders children under the title row', () => {
    render(<PageHeader title="Reports"><span>tabs</span></PageHeader>);
    expect(screen.getByText('tabs')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<PageHeader title="Dashboard" description="Overview" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});


describe('PageHeader hero options', () => {
  it('renders eyebrow, hero size and centered alignment', () => {
    render(
      <PageHeader
        title="Your AI knows the system"
        eyebrow="AI-first"
        size="hero"
        align="center"
        description="Ship correct UI the first time."
      />
    );
    expect(screen.getByText('AI-first')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveClass('text-4xl');
  });
});

describe('PageHeader heading level', () => {
  it('renders an h2 when as="h2"', () => {
    render(<PageHeader as="h2" title="Section header" />);
    expect(screen.getByRole('heading', { level: 2, name: 'Section header' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });

  it('defaults to h1', () => {
    render(<PageHeader title="Page title" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Page title' })).toBeInTheDocument();
  });
});

describe('PageHeader migration aliases', () => {
  it('renders subtitle when description is absent', () => {
    render(<PageHeader title="Billing" subtitle="Manage invoices." />);
    expect(screen.getByText('Manage invoices.')).toBeInTheDocument();
  });

  it('prefers description when both description and subtitle are passed', () => {
    render(<PageHeader title="Billing" description="Canonical" subtitle="Alias" />);
    expect(screen.getByText('Canonical')).toBeInTheDocument();
    expect(screen.queryByText('Alias')).not.toBeInTheDocument();
  });

  it('renders ReactNode descriptions with links', () => {
    render(
      <PageHeader
        title="Events"
        description={
          <>
            Browse the <a href="/events">competitions page</a> or{' '}
            <a href="/subscribe">subscribe to the ICS feed</a>.
          </>
        }
      />
    );
    expect(screen.getByRole('link', { name: 'competitions page' })).toHaveAttribute('href', '/events');
    expect(screen.getByRole('link', { name: 'subscribe to the ICS feed' })).toHaveAttribute('href', '/subscribe');
  });
});
