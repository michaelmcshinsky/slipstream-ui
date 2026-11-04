import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Flex, FlexItem } from './Flex';

describe('Flex / FlexItem', () => {
  it('applies direction, align, justify, gap, and wrap', () => {
    const { container } = render(
      <Flex direction="column" align="center" justify="between" gap="lg" wrap>
        <span>a</span>
      </Flex>
    );
    expect(container.firstChild).toHaveClass(
      'flex',
      'flex-col',
      'items-center',
      'justify-between',
      'gap-6',
      'flex-wrap'
    );
  });

  it('defaults to a row with md gap', () => {
    const { container } = render(<Flex><span>a</span></Flex>);
    expect(container.firstChild).toHaveClass('flex-row', 'gap-4');
  });

  it('emits flex values on FlexItem via style (never runtime classes)', () => {
    const { container } = render(
      <Flex>
        <FlexItem grow basis="240px" shrink={false} align="start" data-testid="item">
          child
        </FlexItem>
      </Flex>
    );
    const item = screen.getByTestId('item');
    expect(item).toHaveStyle({ flexGrow: '1', flexBasis: '240px', flexShrink: '0' });
    expect(item).toHaveClass('self-start');
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders the semantic element from as', () => {
    render(<Flex as="section">Region</Flex>);
    expect(screen.getByText('Region').tagName).toBe('SECTION');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Flex gap="md">
        <span>one</span>
        <span>two</span>
      </Flex>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
