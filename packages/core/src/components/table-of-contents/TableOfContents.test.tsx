import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { TableOfContents } from './TableOfContents';

const headings = [
  { id: 'intro', text: 'Introduction', level: 2 as const },
  { id: 'setup', text: 'Setup', level: 3 as const },
  { id: 'api', text: 'API', level: 2 as const },
];

describe('TableOfContents', () => {
  it('renders anchored headings with the active one marked', () => {
    render(<TableOfContents headings={headings} activeId="setup" />);
    expect(screen.getByRole('navigation', { name: 'On this page' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Setup' })).toHaveAttribute('aria-current', 'location');
    expect(screen.getByRole('link', { name: 'Introduction' })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('link', { name: 'API' })).toHaveAttribute('href', '#api');
  });

  it('indents nested heading levels', () => {
    render(<TableOfContents headings={headings} />);
    const setupItem = screen.getByRole('link', { name: 'Setup' }).closest('li')!;
    expect(setupItem.style.paddingLeft).toBe('0.75rem');
  });

  it('reports navigation while keeping the native anchor behavior', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<TableOfContents headings={headings} onNavigate={onNavigate} />);
    const link = screen.getByRole('link', { name: 'API' });
    expect(link).toHaveAttribute('href', '#api');
    await user.click(link);
    expect(onNavigate).toHaveBeenCalledWith('api');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<TableOfContents headings={headings} activeId="intro" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
