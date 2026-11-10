/** @type {import('next').NextConfig} */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDevelopment = process.env.NODE_ENV !== 'production';

/**
 * Content Security Policy.
 *
 * Shipped as `Content-Security-Policy-Report-Only` first: Next injects inline
 * bootstrap scripts and the theme-init script, so an enforced policy would need
 * nonces threaded through the App Router before it can be turned on without
 * breaking hydration. Collect reports, then flip the header name once the only
 * remaining violations are ones we have deliberately allowed.
 *
 * When analytics is enabled via NEXT_PUBLIC_ANALYTICS_SRC, add that origin to
 * `script-src` and `connect-src` before enforcing.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy-Report-Only', value: contentSecurityPolicy },
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
      // Old/alternate changelog URL - keep external links from 404ing.
      { source: '/docs/changelog', destination: '/changelog', permanent: true },
    ];
  },
};

export default nextConfig;

// Cloudflare Workers (OpenNext): expose bindings to `next dev`.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
