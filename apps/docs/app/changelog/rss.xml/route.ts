import { RELEASES } from '@/lib/releases';
import { SITE } from '@/lib/site';

export const dynamic = 'force-static';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** RSS 2.0 feed for the changelog — one item per release. */
export function GET() {
  const items = RELEASES.map((release) => {
    const link = `${SITE.url}/changelog#release-${release.version}`;
    const description = release.highlights.map((h) => `<li>${escapeXml(h)}</li>`).join('');
    return `    <item>
      <title>${escapeXml(`v${release.version}`)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description><![CDATA[<ul>${description}</ul>]]></description>
    </item>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Slipstream UI changelog</title>
    <link>${SITE.url}/changelog</link>
    <description>Release notes for Slipstream UI: new components, breaking changes, and migration notes for every version.</description>
    <language>en</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
