import { describe, expect, it, vi } from 'vitest';
import { createAnalytics } from './analytics';

describe('analytics', () => {
  it('is disabled by default and sends nothing', () => {
    const sink = vi.fn();
    const analytics = createAnalytics({ sink });
    expect(analytics.enabled).toBe(false);
    expect(analytics.track('chat_send', { messageCount: 2 })).toBe(false);
    expect(sink).not.toHaveBeenCalled();
  });

  it('sends only allow-listed numeric and boolean properties', () => {
    const sink = vi.fn();
    const analytics = createAnalytics({ enabled: true, sink });
    analytics.track('chat_complete', {
      messageCount: 2,
      durationMs: 1200,
      toolCount: 1,
      citationCount: 3,
      approved: true,
      // @ts-expect-error PII must not be accepted by the public type
      email: 'user@example.com',
    });
    expect(sink).toHaveBeenCalledTimes(1);
    expect(sink.mock.calls[0][0].props).toEqual({
      messageCount: 2,
      durationMs: 1200,
      toolCount: 1,
      citationCount: 3,
      approved: true,
    });
  });

  it('can be enabled and disabled at runtime', () => {
    const sink = vi.fn();
    const analytics = createAnalytics({ sink });
    analytics.setEnabled(true);
    expect(analytics.track('chat_send')).toBe(true);
    analytics.setEnabled(false);
    expect(analytics.track('chat_send')).toBe(false);
    expect(sink).toHaveBeenCalledTimes(1);
  });
});
