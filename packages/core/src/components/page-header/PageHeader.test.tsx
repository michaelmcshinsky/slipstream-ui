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
