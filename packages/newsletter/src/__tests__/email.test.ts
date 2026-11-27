/**
 * Newsletter email template tests
 */

import { describe, it, expect } from 'vitest';
import { generateHtmlEmail, generateTextEmail, generateSubject, generatePreheader } from '../templates/email';
import type { EmailTemplateData, NewsletterContentItem } from '../types';

describe('Email Templates', () => {
  const mockItems: NewsletterContentItem[] = [
    {
      id: '1',
      type: 'audit_log',
      title: 'User Login',
      summary: 'john@example.com logged in',
      url: 'https://example.com/audit/1',
      metadata: { action: 'user.login' },
      publishedAt: new Date('2024-01-15T10:00:00Z'),
      createdAt: new Date('2024-01-15T10:00:00Z'),
    },
    {
      id: '2',
      type: 'release',
      title: 'v2.0.0 Released',
      summary: 'Major release with new features',
      url: 'https://github.com/example/repo/releases/tag/v2.0.0',
      metadata: { tag: 'v2.0.0' },
      publishedAt: new Date('2024-01-14T15:00:00Z'),
      createdAt: new Date('2024-01-14T15:00:00Z'),
    },
  ];

  const mockData: EmailTemplateData = {
    preheader: '2 new updates in your daily Slipstream UI digest.',
    title: 'Slipstream UI Daily Digest',
    items: mockItems,
    frequency: 'daily',
    date: 'Monday, January 15, 2024',
    unsubscribeUrl: 'https://example.com/unsubscribe',
    preferencesUrl: 'https://example.com/preferences',
    siteUrl: 'https://slipstream-ui.com',
  };

  describe('generateHtmlEmail', () => {
    it('generates valid HTML with all required elements', () => {
      const html = generateHtmlEmail(mockData);

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<html lang="en">');
      expect(html).toContain('Slipstream UI Daily Digest');
      expect(html).toContain('Monday, January 15, 2024');
      expect(html).toContain('User Login');
      expect(html).toContain('v2.0.0 Released');
      expect(html).toContain('john@example.com logged in');
      expect(html).toContain('Major release with new features');
      expect(html).toContain('https://example.com/audit/1');
      expect(html).toContain('https://github.com/example/repo/releases/tag/v2.0.0');
      expect(html).toContain('Unsubscribe');
      expect(html).toContain('Update preferences');
      expect(html).toContain('slipstream-ui.com');
    });

    it('includes preheader text', () => {
      const html = generateHtmlEmail(mockData);
      expect(html).toContain('2 new updates in your daily Slipstream UI digest.');
    });

    it('includes type badges with correct colors', () => {
      const html = generateHtmlEmail(mockData);
      expect(html).toContain('Activity'); // audit_log label
      expect(html).toContain('Release'); // release label
      expect(html).toContain('#1c55f2'); // brand blue for audit_log
      expect(html).toContain('#22c55e'); // green for release
    });

    it('handles empty items gracefully', () => {
      const emptyData = { ...mockData, items: [] };
      const html = generateHtmlEmail(emptyData);
      expect(html).toContain('No updates for this period.');
    });

    it('escapes HTML special characters', () => {
      const dataWithSpecialChars: EmailTemplateData = {
        ...mockData,
        items: [
          {
            ...mockItems[0],
            title: 'Test <script>alert("xss")</script>',
            summary: 'Summary with & special "quotes"',
          },
        ],
      };
      const html = generateHtmlEmail(dataWithSpecialChars);
      expect(html).not.toContain('<script>');
      expect(html).toContain('&lt;script&gt;');
      expect(html).toContain('&amp;');
      expect(html).toContain('&quot;');
    });
  });

  describe('generateTextEmail', () => {
    it('generates plain text with all content', () => {
      const text = generateTextEmail(mockData);

      expect(text).toContain('Slipstream UI Daily Digest');
      expect(text).toContain('Monday, January 15, 2024');
      expect(text).toContain('User Login');
      expect(text).toContain('v2.0.0 Released');
      expect(text).toContain('john@example.com logged in');
      expect(text).toContain('Major release with new features');
      expect(text).toContain('https://example.com/audit/1');
      expect(text).toContain('https://github.com/example/repo/releases/tag/v2.0.0');
      expect(text).toContain('Unsubscribe: https://example.com/unsubscribe');
      expect(text).toContain('Update preferences: https://example.com/preferences');
      expect(text).toContain('slipstream-ui.com');
    });

    it('includes preheader', () => {
      const text = generateTextEmail(mockData);
      expect(text).toContain('2 new updates in your daily Slipstream UI digest.');
    });

    it('handles empty items gracefully', () => {
      const emptyData = { ...mockData, items: [] };
      const text = generateTextEmail(emptyData);
      expect(text).toContain('No updates for this period.');
    });

    it('does not contain HTML tags', () => {
      const text = generateTextEmail(mockData);
      expect(text).not.toContain('<');
      expect(text).not.toContain('>');
    });
  });

  describe('postal address (CAN-SPAM/CASL)', () => {
    const address = 'Slipstream UI, 123 Main St, Denver, CO 80202';

    it('renders the postal address in the HTML footer when provided', () => {
      const html = generateHtmlEmail({ ...mockData, postalAddress: address });
      expect(html).toContain(address);
    });

    it('omits the postal address line when not provided', () => {
      const html = generateHtmlEmail(mockData);
      expect(html).not.toContain('Main St');
    });

    it('renders the postal address in the text footer when provided', () => {
      const text = generateTextEmail({ ...mockData, postalAddress: address });
      expect(text).toContain(address);
    });

    it('escapes HTML in the postal address', () => {
      const html = generateHtmlEmail({ ...mockData, postalAddress: 'A&B <Inc>' });
      expect(html).toContain('A&amp;B &lt;Inc&gt;');
      expect(html).not.toContain('A&B <Inc>');
    });
  });

  describe('generateSubject', () => {
    it('generates correct subject for daily', () => {
      const subject = generateSubject('daily', new Date('2024-01-15T12:00:00Z'), 2);
      expect(subject).toContain('Daily Slipstream UI Digest');
      expect(subject).toContain('Jan 15');
      expect(subject).toContain('(2 updates)');
    });

    it('generates correct subject for weekly', () => {
      const subject = generateSubject('weekly', new Date('2024-01-15T12:00:00Z'), 5);
      expect(subject).toContain('Weekly Slipstream UI Digest');
      expect(subject).toContain('(5 updates)');
    });

    it('handles singular update', () => {
      const subject = generateSubject('daily', new Date('2024-01-15T12:00:00Z'), 1);
      expect(subject).toContain('(1 updates)');
    });

    it('handles zero updates', () => {
      const subject = generateSubject('daily', new Date('2024-01-15T12:00:00Z'), 0);
      expect(subject).toContain('(0 updates)');
    });
  });

  describe('generatePreheader', () => {
    it('generates correct preheader for daily with items', () => {
      const preheader = generatePreheader('daily', 2);
      expect(preheader).toBe('2 new updates in your daily Slipstream UI digest.');
    });

    it('generates correct preheader for weekly with items', () => {
      const preheader = generatePreheader('weekly', 5);
      expect(preheader).toBe('5 new updates in your weekly Slipstream UI digest.');
    });

    it('generates correct preheader for zero items', () => {
      const preheader = generatePreheader('daily', 0);
      expect(preheader).toBe('No new updates for this daily period.');
    });

    it('uses singular "update" for 1 item', () => {
      const preheader = generatePreheader('daily', 1);
      expect(preheader).toBe('1 new update in your daily Slipstream UI digest.');
    });
  });
});