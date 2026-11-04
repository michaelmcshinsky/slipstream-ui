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
