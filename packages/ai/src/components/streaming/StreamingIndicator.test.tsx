import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { StreamingIndicator } from './StreamingIndicator';

describe('StreamingIndicator', () => {
  it('shows the default text while streaming', () => {
    render(<StreamingIndicator isStreaming />);
    expect(screen.getByText('Generating...')).toBeInTheDocument();
  });

  it('supports custom text', () => {
    render(<StreamingIndicator isStreaming text="Denkt nach..." />);
    expect(screen.getByText('Denkt nach...')).toBeInTheDocument();
  });

  it('renders nothing when not streaming', () => {
    const { container } = render(<StreamingIndicator isStreaming={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('supports compact density, dot count and a hidden label', () => {
    render(<StreamingIndicator isStreaming size="lg" dotCount={5} showLabel={false} tone="muted" />);
    expect(screen.queryByText('Generating...')).not.toBeInTheDocument();
    const dots = document.querySelectorAll('[role="status"] > div > span');
    expect(dots).toHaveLength(5);
    expect(dots[0]).toHaveClass('w-2.5', 'h-2.5', 'bg-muted-foreground');
    // The accessible name survives even when the label is hidden.
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Generating...');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<StreamingIndicator isStreaming />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
