/**
 * Structured JSON logger for server-side paths that run outside handle()
 * (or before it can attach a requestId). Emits one JSON object per line so
 * log drains can index `event`, `requestId`, and context fields.
 */
export function logError(event: string, fields: Record<string, unknown> = {}): void {
  console.error(JSON.stringify({ level: 'error', event, ...fields }));
}

export function logWarn(event: string, fields: Record<string, unknown> = {}): void {
  console.warn(JSON.stringify({ level: 'warn', event, ...fields }));
}
