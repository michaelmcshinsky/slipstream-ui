import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Heading } from './Heading';

describe('Heading', () => {
  it('renders the semantic element for each level', () => {
    render(<Heading level={1}>Title</Heading>);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders h3 for level 3', () => {
    render(<Heading level={3}>Section</Heading>);
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('overrides visual size independently of level', () => {
    const { container } = render(<Heading level={4} size="2xl">Big h4</Heading>);
    expect(screen.getByRole('heading', { level: 4 })).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('text-4xl');
  });

  it('applies muted tone', () => {
    const { container } = render(<Heading level={2} muted>Sub</Heading>);
    expect(container.firstChild).toHaveClass('text-muted-foreground');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Heading level={2}>Section</Heading>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
