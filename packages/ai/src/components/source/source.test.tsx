import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Source } from './Source';
import { Sources } from './Sources';

describe('Source', () => {
  it('renders the title as a link when a URL is provided', () => {
    render(<Source source={{ id: '1', title: 'React docs', url: 'https://react.dev' }} index={1} />);
    const link = screen.getByRole('link', { name: 'React docs' });
    expect(link).toHaveAttribute('href', 'https://react.dev');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders plain text without a URL', () => {
    render(<Source source={{ id: '1', title: 'Internal note' }} />);
    expect(screen.getByText('Internal note')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('shows a citation marker that is hidden from assistive tech', () => {
    render(<Source source={{ id: '1', title: 'Docs' }} index={3} />);
    expect(screen.getByText('[3]')).toHaveAttribute('aria-hidden', 'true');
  });

  it('omits the marker when no index is given', () => {
    const { container } = render(<Source source={{ id: '1', title: 'Docs' }} />);
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
  });

  it('shows the snippet when provided', () => {
    render(<Source source={{ id: '1', title: 'Docs', snippet: 'Useful excerpt' }} />);
    expect(screen.getByText('Useful excerpt')).toBeInTheDocument();
  });
});

describe('Sources', () => {
  const sources = [
    { id: '1', title: 'First', url: 'https://example.com/1' },
    { id: '2', title: 'Second', url: 'https://example.com/2' },
    { id: '3', title: 'Third', url: 'https://example.com/3' },
    { id: '4', title: 'Fourth', url: 'https://example.com/4' },
  ];

  it('renders numbered citations in order', () => {
    render(<Sources sources={sources.slice(0, 2)} />);
    expect(screen.getByText('[1]')).toBeInTheDocument();
    expect(screen.getByText('[2]')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'First' })).toBeInTheDocument();
  });

  it('caps display at maxDisplay and shows an overflow count', () => {
    render(<Sources sources={sources} maxDisplay={3} />);
    expect(screen.queryByRole('link', { name: 'Fourth' })).not.toBeInTheDocument();
    expect(screen.getByText('+1 more sources')).toBeInTheDocument();
  });

  it('supports a custom label', () => {
    render(<Sources sources={sources.slice(0, 1)} label="Referencias" />);
    expect(screen.getByText('Referencias')).toBeInTheDocument();
  });

  it('renders nothing for an empty list', () => {
    const { container } = render(<Sources sources={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Sources sources={sources.slice(0, 2)} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
