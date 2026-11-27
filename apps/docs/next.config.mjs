/** @type {import('next').NextConfig} */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDevelopment = process.env.NODE_ENV !== 'production';

/**
 * Content Security Policy.
 *
 * Enforced directly: `script-src` already allows `'unsafe-inline'`, which
 * covers Next's inline bootstrap and theme-init scripts, so there is no
 * nonce dependency blocking enforcement. `'unsafe-eval'` stays dev-only.
 *
 * The Google origins below cover the consent-gated GA4 tag (gtag.js plus the
 * collection endpoints it posts to). If analytics is pointed at a
 * Plausible-style script via NEXT_PUBLIC_ANALYTICS_SRC, add that origin to
 * `script-src` and `connect-src` before enforcing.
 */
const googleAnalyticsOrigins = [
  'https://www.googletagmanager.com',
  'https://*.google-analytics.com',
  'https://*.analytics.google.com',
].join(' ');

// Cloudflare Web Analytics beacon (optional, consent-gated via
// NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN): static script plus the RUM ingest
// endpoint it posts Core Web Vitals to.
const cloudflareAnalyticsOrigins = 'https://static.cloudflareinsights.com https://cloudflareinsights.com';

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com ${cloudflareAnalyticsOrigins}${isDevelopment ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.googletagmanager.com https://*.google-analytics.com",
  "font-src 'self' data:",
  `connect-src 'self' ${googleAnalyticsOrigins} ${cloudflareAnalyticsOrigins}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  // frame-ancestors above is the modern control; X-Frame-Options covers legacy browsers.
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
  },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Resolve workspace packages from the monorepo root. Without this,
  // Turbopack treats apps/docs as the root and cannot follow the
  // workspace-linked core package imported by the built ai bundle.
  turbopack: {
    root: path.join(__dirname, '../..'),
  },
  transpilePackages: ['@slipstream-ui/core', '@slipstream-ui/ai', '@slipstream-ui/themes'],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      // One canonical host: `www` is attached to the Worker as a custom domain
      // (see wrangler.jsonc) purely so it can answer with a permanent redirect
      // to the apex rather than failing DNS resolution.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.slipstreamui.com' }],
        destination: 'https://slipstreamui.com/:path*',
        permanent: true,
      },
      // Cloudflare terminates TLS and forwards the original scheme in
      // `x-forwarded-proto`, so plain HTTP to the apex is bounced to HTTPS here.
      // HSTS only protects visitors who have already completed one HTTPS
      // request; this covers the first visit. Scoped to the canonical host so the
      // workers.dev alias keeps answering both schemes.
      {
        source: '/:path*',
        has: [
          { type: 'host', value: 'slipstreamui.com' },
          { type: 'header', key: 'x-forwarded-proto', value: 'http' },
        ],
        destination: 'https://slipstreamui.com/:path*',
        permanent: true,
      },
      // Old/alternate changelog URL - keep external links from 404ing.
      { source: '/docs/changelog', destination: '/changelog', permanent: true },
    ];
  },
};

export default nextConfig;

// Cloudflare Workers (OpenNext): expose bindings to `next dev`.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
