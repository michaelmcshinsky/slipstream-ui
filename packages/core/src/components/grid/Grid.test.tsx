import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Grid, GridItem } from './Grid';

describe('Grid / GridItem', () => {
  it('applies literal column classes per breakpoint', () => {
    const { container } = render(<Grid cols={2} mdCols={4} gap="sm"><span>a</span></Grid>);
    expect(container.firstChild).toHaveClass('grid', 'grid-cols-2', 'md:grid-cols-4', 'gap-2');
  });

  it('uses auto-fit template with minCol (overriding cols)', () => {
    const { container } = render(<Grid minCol="16rem" cols={3} />);
    expect(container.firstChild).toHaveStyle({ gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))' });
    expect(container.firstChild).not.toHaveClass('grid-cols-3');
  });

  it('applies literal span classes on GridItem', () => {
    render(
      <Grid>
        <GridItem span={2} smSpan={1} mdSpan={3} data-testid="cell">
          cell
        </GridItem>
      </Grid>
    );
    expect(screen.getByTestId('cell')).toHaveClass('col-span-2', 'sm:col-span-1', 'md:col-span-3');
  });

  it('renders the semantic element from as', () => {
    render(<Grid as="section">Region</Grid>);
    expect(screen.getByText('Region').tagName).toBe('SECTION');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Grid cols={2} gap="md">
        <span>a</span>
        <span>b</span>
      </Grid>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
