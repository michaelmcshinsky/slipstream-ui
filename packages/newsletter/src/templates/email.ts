/**
 * Email templates for newsletter delivery
 * Supports both HTML and plain text formats
 */

import type { EmailTemplateData, NewsletterContentItem } from '../types';

/**
 * Generate HTML email content
 */
export function generateHtmlEmail(data: EmailTemplateData): string {
  const { preheader, title, items, frequency, date, unsubscribeUrl, preferencesUrl, siteUrl } = data;

  const itemsHtml = items.length > 0
    ? items.map((item) => generateItemHtml(item)).join('\n')
    : '<p style="color: #6b7280; font-size: 14px; line-height: 1.6;">No updates for this period.</p>';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <div style="display: none; max-height: 0; overflow: hidden;">${escapeHtml(preheader)}</div>
  
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" max-width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">${escapeHtml(title)}</h1>
              <p style="margin: 8px 0 0; color: #bfdbfe; font-size: 14px;">${escapeHtml(date)} • ${frequency.charAt(0).toUpperCase() + frequency.slice(1)} Digest</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              ${itemsHtml}
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px 24px;">
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 0;">
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 0 40px 32px; text-align: center;">
              <p style="margin: 0 0 16px; color: #6b7280; font-size: 13px; line-height: 1.6;">
                You're receiving this because you subscribed to ${frequency} updates from Slipstream UI.
              </p>
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px;">
                <a href="${escapeHtml(preferencesUrl)}" style="color: #3b82f6; text-decoration: underline;">Update preferences</a> •
                <a href="${escapeHtml(unsubscribeUrl)}" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a>
              </p>
              <p style="margin: 16px 0 0; color: #9ca3af; font-size: 12px;">
                © ${new Date().getFullYear()} Slipstream UI. All rights reserved.<br>
                <a href="${escapeHtml(siteUrl)}" style="color: #9ca3af;">${escapeHtml(siteUrl)}</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Generate plain text email content
 */
export function generateTextEmail(data: EmailTemplateData): string {
  const { preheader, title, items, frequency, date, unsubscribeUrl, preferencesUrl, siteUrl } = data;

  const itemsText = items.length > 0
    ? items.map((item, index) => generateItemText(item, index + 1)).join('\n\n')
    : 'No updates for this period.';

  return `${title}
${date} • ${frequency.charAt(0).toUpperCase() + frequency.slice(1)} Digest

${preheader}

${itemsText}

---
You're receiving this because you subscribed to ${frequency} updates from Slipstream UI.

Update preferences: ${preferencesUrl}
Unsubscribe: ${unsubscribeUrl}

© ${new Date().getFullYear()} Slipstream UI. All rights reserved.
${siteUrl}
`;
}

/**
 * Generate HTML for a single content item
 */
function generateItemHtml(item: NewsletterContentItem): string {
  const typeLabel = getTypeLabel(item.type);
  const typeColor = getTypeColor(item.type);
  const url = item.url ? escapeHtml(item.url) : '#';

  return `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
    <tr>
      <td style="padding-bottom: 8px;">
        <span style="display: inline-block; background-color: ${typeColor}15; color: ${typeColor}; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">${escapeHtml(typeLabel)}</span>
      </td>
    </tr>
    <tr>
      <td>
        <h2 style="margin: 8px 0 8px; font-size: 18px; font-weight: 600; color: #111827; line-height: 1.4;">
          ${item.url ? `<a href="${url}" style="color: #111827; text-decoration: none;">${escapeHtml(item.title)}</a>` : escapeHtml(item.title)}
        </h2>
      </td>
    </tr>
    <tr>
      <td style="color: #4b5563; font-size: 14px; line-height: 1.6;">
        ${escapeHtml(item.summary)}
      </td>
    </tr>
    ${item.url ? `
    <tr>
      <td style="padding-top: 12px;">
        <a href="${url}" style="display: inline-block; color: #3b82f6; font-size: 13px; font-weight: 500; text-decoration: none;">Read more →</a>
      </td>
    </tr>
    ` : ''}
  </table>
  `;
}

/**
 * Generate plain text for a single content item
 */
function generateItemText(item: NewsletterContentItem, index: number): string {
  const typeLabel = getTypeLabel(item.type);
  let text = `${index}. [${typeLabel}] ${item.title}\n   ${item.summary}`;
  if (item.url) {
    text += `\n   ${item.url}`;
  }
  return text;
}

/**
 * Get human-readable label for content type
 */
function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    audit_log: 'Activity',
    release: 'Release',
    github: 'GitHub',
    custom: 'Announcement',
  };
  return labels[type] || type;
}

/**
 * Get color for content type
 */
function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    audit_log: '#3b82f6',    // blue
    release: '#22c55e',      // green
    github: '#8b5cf6',       // purple
    custom: '#f59e0b',       // amber
  };
  return colors[type] || '#6b7280';
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * Generate subject line for newsletter
 */
export function generateSubject(frequency: 'daily' | 'weekly', date: Date, itemCount: number): string {
  const dateStr = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const freqLabel = frequency === 'daily' ? 'Daily' : 'Weekly';
  return `${freqLabel} Slipstream UI Digest — ${dateStr} (${itemCount} updates)`;
}

/**
 * Generate preheader text
 */
export function generatePreheader(frequency: 'daily' | 'weekly', itemCount: number): string {
  if (itemCount === 0) {
    return `No new updates for this ${frequency} period.`;
  }
  return `${itemCount} new ${itemCount === 1 ? 'update' : 'updates'} in your ${frequency} Slipstream UI digest.`;
}