import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Message } from './Message';
import type { Message as MessageType } from '../../types';

const userMessage: MessageType = {
  id: 'm1',
  role: 'user',
  content: 'What is the capital of France?',
};

const assistantMessage: MessageType = {
  id: 'm2',
  role: 'assistant',
  content: 'The capital of France is Paris.',
};

describe('Message', () => {
  it('renders message content', () => {
    render(<Message message={userMessage} />);
    expect(screen.getByText('What is the capital of France?')).toBeInTheDocument();
  });

  it('defaults to English role labels', () => {
    render(
      <div>
        <Message message={userMessage} />
        <Message message={assistantMessage} />
      </div>
    );
    expect(screen.getByText('You')).toBeInTheDocument();
    expect(screen.getByText('Assistant')).toBeInTheDocument();
  });

  it('supports localized role labels', () => {
    render(<Message message={userMessage} userLabel="Sie" />);
    expect(screen.getByText('Sie')).toBeInTheDocument();
    expect(screen.queryByText('You')).not.toBeInTheDocument();
  });

  it('shows a streaming cursor and aria-busy while isStreaming', () => {
    render(<Message message={assistantMessage} isStreaming />);
    expect(screen.getByTestId('streaming-cursor')).toBeInTheDocument();
    const bubble = screen.getByText(assistantMessage.content).closest('[aria-busy]');
    expect(bubble).not.toBeNull();
  });

  it('does not show a cursor when not streaming', () => {
    render(<Message message={assistantMessage} />);
    expect(screen.queryByTestId('streaming-cursor')).not.toBeInTheDocument();
  });

  it('delegates rendering to renderContent when provided', () => {
    render(
      <Message
        message={{ ...assistantMessage, content: '**bold** text' }}
        renderContent={(content) => <strong data-testid="custom">{content}</strong>}
      />
    );
    const custom = screen.getByTestId('custom');
    expect(custom).toHaveTextContent('**bold** text');
    // Default plain-text node is replaced by the custom renderer output.
    expect(custom.parentElement).not.toHaveTextContent('whitespace-pre-wrap');
  });

  it('shows a timestamp when provided', () => {
    render(
      <Message
        message={{ ...assistantMessage, timestamp: new Date('2026-01-01T12:00:00') }}
      />
    );
    expect(screen.getByText(/:\d{2}/)).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Message message={userMessage} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
