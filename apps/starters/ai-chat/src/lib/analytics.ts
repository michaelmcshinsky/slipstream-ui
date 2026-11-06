export type AnalyticsEvent =
  | 'chat_send'
  | 'chat_stop'
  | 'chat_complete'
  | 'chat_error'
  | 'approval_approve'
  | 'approval_reject';

export type AnalyticsProperties = {
  messageCount?: number;
  durationMs?: number;
  toolCount?: number;
  citationCount?: number;
  approved?: boolean;
};

type Payload = { event: AnalyticsEvent; ts: number; props: AnalyticsProperties };
type Sink = (payload: Payload) => void;

function defaultSink(payload: Payload): void {
  if (typeof navigator === 'undefined') return;
  const endpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;
  if (!endpoint) return;
  navigator.sendBeacon(endpoint, JSON.stringify(payload));
}

/**
 * Consent-gated, PII-free event tracking. Disabled by default; the caller
 * enables it only after the user opts in. Only numeric/boolean properties are
 * forwarded, and only the allow-listed keys.
 */
export function createAnalytics(options: { enabled?: boolean; sink?: Sink } = {}) {
  let enabled = options.enabled ?? false;
  const sink = options.sink ?? defaultSink;

  return {
    get enabled(): boolean {
      return enabled;
    },
    setEnabled(value: boolean): void {
      enabled = value;
    },
    track(event: AnalyticsEvent, props: AnalyticsProperties = {}): boolean {
      if (!enabled) return false;
      const clean: AnalyticsProperties = {
        messageCount: props.messageCount,
        durationMs: props.durationMs,
        toolCount: props.toolCount,
        citationCount: props.citationCount,
        approved: props.approved,
      };
      sink({ event, ts: Date.now(), props: clean });
      return true;
    },
  };
}
