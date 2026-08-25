import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Conversation } from './Conversation';
import type { Message as MessageType } from '../../types';

const messages: MessageType[] = [
  { id: 'm1', role: 'user', content: 'Hello!' },
  { id: 'm2', role: 'assistant', content: 'Hi, how can I help?' },
];

describe('Conversation', () => {
  it('renders every message in order', () => {
    render(<Conversation messages={messages} />);
    expect(screen.getByText('Hello!')).toBeInTheDocument();
    expect(screen.getByText('Hi, how can I help?')).toBeInTheDocument();
  });

  it('shows a loading placeholder while isLoading is true', () => {
    render(<Conversation messages={messages} isLoading />);
    expect(screen.getByText('Thinking...')).toBeInTheDocument();
  });

  it('supports a custom loading message', () => {
    render(<Conversation messages={messages} isLoading loadingMessage="Generiere..." />);
    expect(screen.getByText('Generiere...')).toBeInTheDocument();
  });

  it('hides the loading placeholder by default', () => {
    render(<Conversation messages={messages} />);
    expect(screen.queryByText('Thinking...')).not.toBeInTheDocument();
  });

  it('renders a streaming cursor on the message with streamingMessageId', () => {
    render(<Conversation messages={messages} streamingMessageId="m2" />);
    expect(screen.getByTestId('streaming-cursor')).toBeInTheDocument();
    expect(screen.getByText(messages[1].content).closest('[aria-busy]')).not.toBeNull();
  });

  it('does not render a cursor when no streamingMessageId is given', () => {
    render(<Conversation messages={messages} />);
    expect(screen.queryByTestId('streaming-cursor')).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Conversation messages={messages} isLoading />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
