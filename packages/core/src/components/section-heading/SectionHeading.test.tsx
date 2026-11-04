import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { SectionHeading } from './SectionHeading';

describe('SectionHeading', () => {
  it('renders eyebrow, title, description and actions at the requested level', () => {
    render(
      <SectionHeading
        eyebrow="Components"
        title="Built for agents"
        description="Every component ships a spec."
        level={3}
        actions={<a href="/docs">All docs</a>}
      />
    );
    expect(screen.getByText('Components')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Built for agents' })).toBeInTheDocument();
    expect(screen.getByText('Every component ships a spec.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'All docs' })).toBeInTheDocument();
  });

  it('supports centered hero sizes', () => {
    render(<SectionHeading title="Centered" align="center" size="lg" />);
    expect(screen.getByRole('heading', { name: 'Centered' })).toHaveClass('text-3xl');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<SectionHeading title="Section" description="Copy" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
