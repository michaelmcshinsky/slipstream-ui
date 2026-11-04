import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Text } from './Text';

describe('Text', () => {
  it('renders a block paragraph by default', () => {
    render(<Text>Body copy</Text>);
    const p = screen.getByText('Body copy');
    expect(p.tagName).toBe('P');
  });

  it('renders an inline span with inline', () => {
    render(
      <Text>
        Lead <Text inline weight="semibold">fragment</Text>
      </Text>
    );
    const span = screen.getByText('fragment');
    expect(span.tagName).toBe('SPAN');
    expect(span).toHaveClass('font-semibold');
  });

  it('applies size, weight, and muted classes', () => {
    const { container } = render(
      <Text size="sm" weight="medium" muted>
        Copy
      </Text>
    );
    expect(container.firstChild).toHaveClass('text-sm', 'font-medium', 'text-muted-foreground');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Text size="sm">Accessible copy.</Text>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
