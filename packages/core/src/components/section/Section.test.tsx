import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Section } from './Section';

describe('Section', () => {
  it('renders a container and applies the requested tone and padding', () => {
    const { container } = render(
      <Section tone="muted" padding="lg" width="md" aria-label="Feature section">
        <p>Content</p>
      </Section>
    );
    const section = screen.getByRole('region', { name: 'Feature section' });
    expect(section).toHaveClass('bg-muted/40', 'py-16');
    expect(section).toHaveAttribute('data-tone', 'muted');
    expect(container.querySelector('.max-w-5xl')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('scopes inverse tokens for a readable dark band', () => {
    render(
      <Section tone="inverse" aria-label="Inverse section">
        <p>Content</p>
      </Section>
    );
    const section = screen.getByRole('region', { name: 'Inverse section' });
    expect(section).toHaveClass('bg-inverse', 'text-inverse-foreground');
    expect(section).toHaveAttribute('data-tone', 'inverse');
    expect(section).toHaveStyle({ '--background': 'var(--inverse)' });
  });

  it('can render without an inner container', () => {
    const { container } = render(<Section container={false}>Raw</Section>);
    expect(container.querySelector('.mx-auto')).not.toBeInTheDocument();
    expect(screen.getByText('Raw')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Section aria-label="Example section">
        <h2>Heading</h2>
        <p>Copy</p>
      </Section>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
