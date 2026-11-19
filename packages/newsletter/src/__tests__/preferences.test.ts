/**
 * Newsletter preferences tests
 */

import { describe, it, expect } from 'vitest';
import {
  getAvailableContentTypes,
  getAvailableFrequencies,
  DEFAULT_PREFERENCES,
  VALID_CONTENT_TYPES,
  VALID_FREQUENCIES,
} from '../lib/preferences';

describe('Newsletter Preferences', () => {
  describe('getAvailableContentTypes', () => {
    it('returns all four content types with correct structure', () => {
      const types = getAvailableContentTypes();
      expect(types).toHaveLength(4);
      expect(types.map((t) => t.type)).toEqual(['audit_log', 'release', 'github', 'custom']);
    });

    it('each type has label and description', () => {
      const types = getAvailableContentTypes();
      for (const type of types) {
        expect(type.label).toBeTruthy();
        expect(type.description).toBeTruthy();
        expect(typeof type.label).toBe('string');
        expect(typeof type.description).toBe('string');
      }
    });
  });

  describe('getAvailableFrequencies', () => {
    it('returns three frequency options', () => {
      const frequencies = getAvailableFrequencies();
      expect(frequencies).toHaveLength(3);
      expect(frequencies.map((f) => f.value)).toEqual(['daily', 'weekly', 'both']);
    });

    it('each frequency has label and description', () => {
      const frequencies = getAvailableFrequencies();
      for (const freq of frequencies) {
        expect(freq.label).toBeTruthy();
        expect(freq.description).toBeTruthy();
      }
    });
  });

  describe('VALID_CONTENT_TYPES', () => {
    it('contains all expected content types', () => {
      expect(VALID_CONTENT_TYPES).toEqual(['audit_log', 'release', 'github', 'custom']);
    });
  });

  describe('VALID_FREQUENCIES', () => {
    it('contains all expected frequencies', () => {
      expect(VALID_FREQUENCIES).toEqual(['daily', 'weekly', 'both']);
    });
  });

  describe('DEFAULT_PREFERENCES', () => {
    it('has correct default values', () => {
      expect(DEFAULT_PREFERENCES.dailyEnabled).toBe(false);
      expect(DEFAULT_PREFERENCES.weeklyEnabled).toBe(true);
      expect(DEFAULT_PREFERENCES.frequency).toBe('weekly');
      expect(DEFAULT_PREFERENCES.timezone).toBe('America/Denver');
      expect(DEFAULT_PREFERENCES.contentTypes).toEqual(['audit_log', 'release', 'github', 'custom']);
    });
  });
});