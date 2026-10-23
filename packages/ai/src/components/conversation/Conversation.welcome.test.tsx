import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Conversation } from './Conversation';

describe('Conversation welcome state', () => {
  it('renders welcome copy and starter prompts when empty', async () => {
    const user = userEvent.setup();
    const onWelcomeSelect = vi.fn();
    render(
      <Conversation
        messages={[]}
        welcomeTitle="Hello"
        welcomeDescription="Pick a starter"
        welcomeSuggestions={['Tell me a joke']}
        onWelcomeSelect={onWelcomeSelect}
      />
    );

    expect(screen.getByText('Hello')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Tell me a joke' }));
    expect(onWelcomeSelect).toHaveBeenCalledWith('Tell me a joke');
  });

  it('does not show the welcome state once messages exist', () => {
    render(
      <Conversation
        messages={[{ id: '1', role: 'user', content: 'Hi' }]}
        welcomeTitle="Hello"
      />
    );
    expect(screen.queryByText('Hello')).not.toBeInTheDocument();
  });

  it('hides the welcome state while loading the first response', () => {
    render(<Conversation messages={[]} isLoading welcomeTitle="Hello" />);
    expect(screen.queryByText('Hello')).not.toBeInTheDocument();
  });
});

describe('Conversation history pagination', () => {
  it('shows the load-earlier control only when history exists', async () => {
    const user = userEvent.setup();
    const onLoadMore = vi.fn();
    const { rerender } = render(
      <Conversation messages={[{ id: '1', role: 'user', content: 'Hi' }]} onLoadMore={onLoadMore} />
    );
    // No control without hasMoreHistory.
    expect(screen.queryByRole('button', { name: /Load earlier/ })).not.toBeInTheDocument();

    rerender(
      <Conversation
        messages={[{ id: '1', role: 'user', content: 'Hi' }]}
        hasMoreHistory
        onLoadMore={onLoadMore}
      />
    );
    await user.click(screen.getByRole('button', { name: /Load earlier/ }));
    expect(onLoadMore).toHaveBeenCalledOnce();
  });

  it('disables the control while loading more', () => {
    render(
      <Conversation
        messages={[{ id: '1', role: 'user', content: 'Hi' }]}
        hasMoreHistory
        isLoadingMore
        onLoadMore={() => {}}
      />
    );
    expect(screen.getByRole('button', { name: /Loading/ })).toBeDisabled();
  });
});
