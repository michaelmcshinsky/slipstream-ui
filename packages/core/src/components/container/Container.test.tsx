import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Container } from './Container';

describe('Container', () => {
  it('applies width and padding presets', () => {
    const { container } = render(<Container width="md" padding="lg">Content</Container>);
    const element = container.firstElementChild;
    expect(element).toHaveClass('mx-auto', 'w-full', 'max-w-5xl', 'px-4', 'sm:px-6', 'lg:px-8');
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders the requested semantic element', () => {
    render(<Container as="section" aria-label="Section content">Content</Container>);
    expect(screen.getByRole('region', { name: 'Section content' })).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Container>Content</Container>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
