/** Canonical app origin for links emitted into emails and API payloads. */
export function appUrl(): string {
  return process.env.APP_URL ?? 'http://localhost:3002';
}
