import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { InlineCitation } from './InlineCitation';

const source = {
  id: 'src-1',
  title: 'React docs',
  url: 'https://react.dev',
  snippet: 'The library for web and native user interfaces.',
};

describe('InlineCitation', () => {
  it('renders the citation chip with a tooltip target', () => {
    render(<InlineCitation source={source} />);
    const trigger = screen.getByRole('button');
    const describedBy = trigger.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy!)).toBe(screen.getByRole('tooltip'));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('wraps custom children instead of the title', () => {
    render(
      <InlineCitation source={source}>
        as stated in the docs
      </InlineCitation>
    );
    expect(screen.getByRole('button')).toHaveTextContent('as stated in the docs');
  });

  it('gives each citation a unique tooltip id, even for the same source', () => {
    render(
      <div>
        <InlineCitation source={source} />
        <InlineCitation source={source} />
      </div>
    );
    const ids = screen
      .getAllByRole('tooltip')
      .map((tip) => tip.id);
    expect(new Set(ids).size).toBe(2);
    for (const trigger of screen.getAllByRole('button')) {
      const describedBy = trigger.getAttribute('aria-describedby');
      expect(document.getElementById(describedBy!)).not.toBeNull();
    }
  });

  it('is keyboard reachable', async () => {
    const user = userEvent.setup();
    render(<InlineCitation source={source} />);
    await user.tab();
    expect(screen.getByRole('button')).toHaveFocus();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<InlineCitation source={source} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
