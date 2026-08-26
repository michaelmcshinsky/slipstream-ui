import { vi } from 'vitest';

/**
 * In-memory cookie store backing the mocked next/headers module.
 * Route handlers read/write real cookies through this map during tests.
 */
const store = new Map<string, { name: string; value: string }>();

vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (name: string) => {
      const entry = store.get(name);
      return entry ? { name, value: entry.value } : undefined;
    },
    set: (name: string, value: string) => {
      store.set(name, { name, value });
    },
    delete: (name: string) => {
      store.delete(name);
    },
    getAll: () => Array.from(store.values()),
  }),
}));

export function getCookieStore() {
  return store;
}

export function nextHeadersMock() {
  return {
    cookies: async () => ({
      get: (name: string) => (store.has(name) ? { name, value: store.get(name)!.value } : undefined),
      set: (name: string, value: string) => { store.set(name, { name, value }); },
      delete: (name: string) => { store.delete(name); },
      getAll: () => Array.from(store.values()),
    }),
  };
}
