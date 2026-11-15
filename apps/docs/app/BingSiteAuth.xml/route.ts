/**
 * Bing Webmaster Tools site verification.
 *
 * Bing accepts either a `<meta name="msvalidate.01">` tag (added to the root
 * metadata in `app/layout.tsx`) or this XML file served from the site root.
 * Both are kept in sync so verification survives whichever method the
 * dashboard uses.
 */
const BING_SITE_AUTH = `<?xml version="1.0"?>
<users>
\t<user>F7F5C880C711B95FC4C74D4ECB48B909</user>
</users>
`;

export const dynamic = 'force-static';

export function GET() {
  return new Response(BING_SITE_AUTH, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
