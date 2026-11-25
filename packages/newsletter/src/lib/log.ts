/** Structured JSON log line for newsletter generation/cron paths. */
export function logError(event: string, fields: Record<string, unknown> = {}): void {
  console.error(JSON.stringify({ level: 'error', event, ...fields }));
}

export function logWarn(event: string, fields: Record<string, unknown> = {}): void {
  console.warn(JSON.stringify({ level: 'warn', event, ...fields }));
}
