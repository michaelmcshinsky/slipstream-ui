import { afterEach, describe, expect, it, vi } from 'vitest';
import { appUrl } from './app-url';

describe('appUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('defaults to the app dev port when APP_URL is unset', () => {
    const original = process.env.APP_URL;
    delete process.env.APP_URL;
    try {
      expect(appUrl()).toBe('http://localhost:3002');
    } finally {
      if (original === undefined) {
        delete process.env.APP_URL;
      } else {
        process.env.APP_URL = original;
      }
    }
  });

  it('prefers APP_URL when configured', () => {
    vi.stubEnv('APP_URL', 'https://app.example.com');
    expect(appUrl()).toBe('https://app.example.com');
  });
});
