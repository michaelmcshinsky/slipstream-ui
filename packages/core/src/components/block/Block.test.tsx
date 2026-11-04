import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Block } from './Block';

describe('Block', () => {
  it('renders a div by default', () => {
    render(<Block>Content</Block>);
    expect(screen.getByText('Content').tagName).toBe('DIV');
  });

  it('renders the semantic element from as', () => {
    render(<Block as="section">Region</Block>);
    expect(screen.getByText('Region').tagName).toBe('SECTION');
  });

  it('renders a span with inline', () => {
    render(<Block inline>Flow</Block>);
    expect(screen.getByText('Flow').tagName).toBe('SPAN');
  });

  it('applies muted tone', () => {
    const { container } = render(<Block muted>Muted block</Block>);
    expect(container.firstChild).toHaveClass('text-muted-foreground');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Block as="article">Article content</Block>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
