import { beforeEach, describe, expect, it } from 'vitest';
import { loginThrottleRemaining, recordLoginFailure, resetLoginFailures } from './login-throttle';

const EMAIL = `throttle-${Date.now()}@example.com`;

describe('login throttle', () => {
  beforeEach(() => resetLoginFailures(EMAIL));

  it('allows attempts until the failure ceiling, then blocks', () => {
    for (let i = 0; i < 8; i++) recordLoginFailure(EMAIL);
    const remaining = loginThrottleRemaining(EMAIL);
    expect(remaining).not.toBeNull();
    expect(remaining!).toBeGreaterThan(0);
    expect(remaining!).toBeLessThanOrEqual(15 * 60);
  });

  it('does not count successes against the ceiling', () => {
    for (let i = 0; i < 7; i++) recordLoginFailure(EMAIL);
    resetLoginFailures(EMAIL);
    expect(loginThrottleRemaining(EMAIL)).toBeNull();
  });

  it('tracks accounts independently', () => {
    for (let i = 0; i < 8; i++) recordLoginFailure(EMAIL);
    expect(loginThrottleRemaining(`other-${Date.now()}@example.com`)).toBeNull();
  });
});
