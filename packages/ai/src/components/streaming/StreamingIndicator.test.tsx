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

  it('has no accessibility violations', async () => {
    const { container } = render(<StreamingIndicator isStreaming />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
